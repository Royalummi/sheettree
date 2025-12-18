<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\FormApiConfig;
use App\Models\ApiSubmission;
use App\Models\ApiUsageLog;
use App\Services\GoogleSheetsService;
use App\Services\CaptchaService;
use App\Services\SpamProtectionService;
use Illuminate\Support\Facades\Validator;
use Exception;

class ExternalApiController
{
    private $googleSheetsService;
    private $captchaService;
    private $spamProtectionService;

    public function __construct()
    {
        try {
            // Initialize Google Client
            $client = new \Google\Client();

            // Handle both config file path and individual credentials
            $configPath = $_ENV['GOOGLE_CLIENT_CONFIG_PATH'] ?? '';

            if ($configPath && file_exists($configPath)) {
                $client->setAuthConfig($configPath);
            } else {
                // Use individual environment variables
                $client->setClientId($_ENV['GOOGLE_CLIENT_ID'] ?? '');
                $client->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET'] ?? '');
                $client->setRedirectUri($_ENV['GOOGLE_REDIRECT_URI'] ?? '');
            }

            $client->setScopes([
                \Google\Service\Sheets::SPREADSHEETS,
                \Google\Service\Drive::DRIVE_READONLY
            ]);

            $this->googleSheetsService = new GoogleSheetsService($client);
            $this->captchaService = new CaptchaService();
            $this->spamProtectionService = new SpamProtectionService();
        } catch (Exception $e) {
            error_log("ExternalApiController initialization error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle external form submission
     * POST /api/external/submit/{apiHash}
     */
    public function submitForm(Request $request, Response $response, array $args): Response
    {
        $apiHash = $args['apiHash'] ?? null;

        if (!$apiHash) {
            return $this->errorResponse($response, 'API hash is required', 400);
        }

        try {
            // Find API configuration
            $apiConfig = FormApiConfig::where('api_hash', $apiHash)
                ->where('is_active', true)
                ->with('form.connectedSheet')
                ->first();

            if (!$apiConfig) {
                return $this->errorResponse($response, 'Invalid API configuration', 404);
            }

            // Log API usage
            try {
                ApiUsageLog::logUsage($apiConfig->id, $request, 200);
            } catch (Exception $e) {
                // Continue if logging fails
            }

            // Handle CORS preflight
            if ($request->getMethod() === 'OPTIONS') {
                return $this->handleCorsPreflightRequest($response, $apiConfig);
            }

            // Apply CORS headers
            $response = $this->applyCorsHeaders($response, $apiConfig, $request);

            // Authenticate API request
            if (!$this->authenticateApiRequest($request, $apiConfig)) {
                try {
                    ApiUsageLog::logUsage($apiConfig->id, $request, 401, 'Invalid API key');
                } catch (Exception $e) {
                    // Continue if logging fails
                }
                return $this->errorResponse($response, 'Invalid API key', 401);
            }

            // Get submission data
            $submissionData = $this->getSubmissionData($request);

            // ===== SECURITY ENHANCEMENTS =====

            // 1. Validate and sanitize input
            $validator = new \App\Validators\InputValidator();
            $form = $apiConfig->form;

            if ($form && $form->fields) {
                $validationResult = $validator->validateFormSubmission($submissionData, $form->fields);

                if (!$validationResult['valid']) {
                    try {
                        ApiUsageLog::logUsage($apiConfig->id, $request, 400, 'Validation failed: ' . $validationResult['message']);
                    } catch (Exception $e) {
                        // Continue if logging fails
                    }
                    return $this->errorResponse($response, $validationResult['message'], 400);
                }
            }

            // 2. Sanitize all input data
            $sanitizer = new \App\Security\Sanitizer();
            $submissionData = $sanitizer->sanitizeArray($submissionData);

            // 3. Check for honeypot (spam protection)
            $captchaValidator = new \App\Security\CaptchaValidator();
            if (!$captchaValidator::validateHoneypot($submissionData)) {
                try {
                    ApiUsageLog::logUsage($apiConfig->id, $request, 403, 'Honeypot triggered');
                } catch (Exception $e) {
                    // Continue if logging fails
                }
                return $this->errorResponse($response, 'Submission rejected', 403);
            }

            // 4. Validate CAPTCHA if provided
            if (isset($submissionData['g-recaptcha-response'])) {
                $recaptchaResponse = $submissionData['g-recaptcha-response'];
                unset($submissionData['g-recaptcha-response']); // Remove from submission data

                $remoteIp = $request->getServerParams()['REMOTE_ADDR'] ?? null;

                if (!$captchaValidator->verifyV2($recaptchaResponse, $remoteIp)) {
                    try {
                        ApiUsageLog::logUsage($apiConfig->id, $request, 403, 'CAPTCHA validation failed');
                    } catch (Exception $e) {
                        // Continue if logging fails
                    }
                    return $this->errorResponse($response, 'CAPTCHA validation failed', 403);
                }
            }

            // Store submission in database
            $submission = ApiSubmission::create([
                'form_api_config_id' => $apiConfig->id,
                'submission_data' => $submissionData,
                'raw_payload' => $submissionData,
                'ip_address' => $request->getServerParams()['REMOTE_ADDR'] ?? null,
                'user_agent' => $request->getHeaderLine('User-Agent'),
                'origin' => $request->getHeaderLine('Origin')
            ]);

            // Write to Google Sheets
            $sheetWriteSuccess = false;
            $sheetError = null;

            try {
                if ($apiConfig->form && $apiConfig->form->connectedSheet) {
                    $connectedSheet = $apiConfig->form->connectedSheet;

                    if ($connectedSheet->spreadsheet_id && $connectedSheet->sheet_name) {
                        $this->writeToGoogleSheets($apiConfig, $submissionData);
                        $submission->markSheetWritten();
                        $sheetWriteSuccess = true;
                    } else {
                        $sheetError = 'Google Sheet ID or sheet name not configured';
                        $submission->markSheetError($sheetError);
                    }
                } else {
                    $sheetError = 'No connected sheet found';
                    $submission->markSheetError($sheetError);
                }
            } catch (Exception $e) {
                $sheetError = $e->getMessage();
                $submission->markSheetError($sheetError);
                error_log("Google Sheets Error: " . $sheetError);
            }

            // Return success response with sheet status
            $responseData = [
                'success' => true,
                'message' => 'Data submitted successfully',
                'data' => $submissionData,
                'sheet_status' => [
                    'written' => $sheetWriteSuccess,
                    'error' => $sheetError
                ]
            ];

            $response->getBody()->write(json_encode($responseData));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            error_log("External API Error: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());

            return $this->errorResponse($response, 'Internal server error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get API configuration details (for documentation)
     * GET /api/external/config/{apiHash}
     */
    public function getApiConfig(Request $request, Response $response, array $args): Response
    {
        $apiHash = $args['apiHash'] ?? null;

        $apiConfig = FormApiConfig::where('api_hash', $apiHash)
            ->where('is_active', true)
            ->with('form')
            ->first();

        if (!$apiConfig) {
            return $this->errorResponse($response, 'API configuration not found', 404);
        }

        // Apply CORS headers
        $response = $this->applyCorsHeaders($response, $apiConfig, $request);

        $configData = [
            'api_name' => $apiConfig->api_name,
            'description' => $apiConfig->description,
            'endpoint' => "/api/external/submit/{$apiHash}",
            'method' => 'POST',
            'authentication' => [
                'type' => 'Bearer Token',
                'header' => 'Authorization: Bearer YOUR_API_KEY'
            ],
            'content_types' => ['application/json', 'application/x-www-form-urlencoded'],
            'cors_enabled' => $apiConfig->cors_enabled,
            'captcha_enabled' => $apiConfig->captcha_enabled,
            'captcha_type' => $apiConfig->captcha_type,
            'validation_enabled' => $apiConfig->validation_enabled,
            'required_fields' => $apiConfig->required_fields,
            'field_mapping' => $apiConfig->field_mapping,
            'response_type' => $apiConfig->response_type,
            'honeypot_field' => $apiConfig->honeypot_field_name,
            'example_payload' => $this->generateExamplePayload($apiConfig)
        ];

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $configData
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * Authenticate API request using Bearer token
     */
    private function authenticateApiRequest(Request $request, FormApiConfig $apiConfig): bool
    {
        // Check for Bearer token in Authorization header
        $authHeader = $request->getHeaderLine('Authorization');
        if (str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
            return $token === $apiConfig->api_key;
        }

        // Check for API key in X-API-Key header
        $apiKeyHeader = $request->getHeaderLine('X-API-Key');
        if ($apiKeyHeader) {
            return $apiKeyHeader === $apiConfig->api_key;
        }

        return false;
    }

    /**
     * Get submission data from request (JSON or form data)
     */
    private function getSubmissionData(Request $request): array
    {
        $contentType = $request->getHeaderLine('Content-Type');

        if (str_contains($contentType, 'application/json')) {
            $body = $request->getBody()->getContents();
            return json_decode($body, true) ?? [];
        } else {
            // Form data
            return $request->getParsedBody() ?? [];
        }
    }

    /**
     * Validate submission data
     */
    private function validateSubmissionData(array $data, FormApiConfig $apiConfig): array
    {
        $rules = $apiConfig->getLaravelValidationRules();

        if (empty($rules)) {
            return ['valid' => true, 'errors' => []];
        }

        // Simple validation implementation
        $errors = [];

        foreach ($rules as $field => $rule) {
            $ruleArray = is_string($rule) ? explode('|', $rule) : $rule;

            foreach ($ruleArray as $singleRule) {
                if ($singleRule === 'required' && (!isset($data[$field]) || empty($data[$field]))) {
                    $errors[$field][] = "The {$field} field is required.";
                } elseif (str_starts_with($singleRule, 'email') && isset($data[$field]) && !filter_var($data[$field], FILTER_VALIDATE_EMAIL)) {
                    $errors[$field][] = "The {$field} field must be a valid email address.";
                } elseif (str_starts_with($singleRule, 'min:')) {
                    $min = (int) substr($singleRule, 4);
                    if (isset($data[$field]) && strlen($data[$field]) < $min) {
                        $errors[$field][] = "The {$field} field must be at least {$min} characters.";
                    }
                } elseif (str_starts_with($singleRule, 'max:')) {
                    $max = (int) substr($singleRule, 4);
                    if (isset($data[$field]) && strlen($data[$field]) > $max) {
                        $errors[$field][] = "The {$field} field must not exceed {$max} characters.";
                    }
                }
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Map external field names to internal field names
     */
    private function mapFields(array $data, FormApiConfig $apiConfig): array
    {
        if (!$apiConfig->field_mapping) {
            return $data;
        }

        $mappedData = [];
        foreach ($apiConfig->field_mapping as $externalField => $internalField) {
            if (isset($data[$externalField])) {
                $mappedData[$internalField] = $data[$externalField];
            }
        }

        // Include unmapped fields
        foreach ($data as $key => $value) {
            if (!isset($apiConfig->field_mapping[$key])) {
                $mappedData[$key] = $value;
            }
        }

        return $mappedData;
    }

    /**
     * Write data to Google Sheets
     */
    private function writeToGoogleSheets(FormApiConfig $apiConfig, array $data): void
    {
        $form = $apiConfig->form;
        $connectedSheet = $form->connectedSheet;

        if (!$connectedSheet) {
            throw new Exception('No connected sheet found');
        }

        $this->googleSheetsService->appendToSheet(
            $connectedSheet->spreadsheet_id,
            $connectedSheet->sheet_name,
            $data,
            $form->user_id
        );
    }

    /**
     * Build success response based on configuration
     */
    private function buildSuccessResponse(Response $response, FormApiConfig $apiConfig, array $data): Response
    {
        if ($apiConfig->response_type === 'redirect' && $apiConfig->redirect_url) {
            return $response
                ->withStatus(302)
                ->withHeader('Location', $apiConfig->redirect_url);
        }

        $responseData = [
            'success' => true,
            'message' => $apiConfig->success_message
        ];

        if ($apiConfig->custom_response_data) {
            $responseData = array_merge($responseData, $apiConfig->custom_response_data);
        }

        $response->getBody()->write(json_encode($responseData));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * Handle CORS preflight request
     */
    private function handleCorsPreflightRequest(Response $response, FormApiConfig $apiConfig): Response
    {
        $response = $this->applyCorsHeaders($response, $apiConfig, null);
        return $response
            ->withHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, X-Requested-With, Accept, Origin')
            ->withStatus(200);
    }

    /**
     * Apply CORS headers to response
     */
    private function applyCorsHeaders(Response $response, FormApiConfig $apiConfig, ?Request $request): Response
    {
        // If CORS is not enabled/configured, allow all origins (external APIs should be accessible from anywhere)
        if (!$apiConfig->cors_enabled) {
            return $response
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Access-Control-Allow-Credentials', 'true')
                ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, X-API-Key')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                ->withHeader('Access-Control-Max-Age', '86400');
        }

        $origin = $request ? $request->getHeaderLine('Origin') : '*';

        if ($request && $apiConfig->isOriginAllowed($origin)) {
            $response = $response->withHeader('Access-Control-Allow-Origin', $origin);
        } elseif (!$request) {
            $response = $response->withHeader('Access-Control-Allow-Origin', '*');
        }

        return $response
            ->withHeader('Access-Control-Allow-Credentials', 'true')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, X-API-Key')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
            ->withHeader('Access-Control-Max-Age', '86400');
    }

    /**
     * Generate example payload for documentation
     */
    private function generateExamplePayload(FormApiConfig $apiConfig): array
    {
        $example = [];

        if ($apiConfig->required_fields) {
            foreach ($apiConfig->required_fields as $field) {
                $example[$field] = $this->getExampleValueForField($field);
            }
        }

        if ($apiConfig->field_mapping) {
            foreach ($apiConfig->field_mapping as $externalField => $internalField) {
                if (!isset($example[$externalField])) {
                    $example[$externalField] = $this->getExampleValueForField($externalField);
                }
            }
        }

        // Add CAPTCHA field if enabled
        if ($apiConfig->captcha_enabled) {
            if ($apiConfig->captcha_type === 'recaptcha_v2' || $apiConfig->captcha_type === 'recaptcha_v3') {
                $example['g-recaptcha-response'] = 'RECAPTCHA_RESPONSE_TOKEN';
            } elseif ($apiConfig->captcha_type === 'hcaptcha') {
                $example['h-captcha-response'] = 'HCAPTCHA_RESPONSE_TOKEN';
            }
        }

        // Add honeypot field
        $example[$apiConfig->honeypot_field_name] = '';

        return $example;
    }

    /**
     * Get example value for a field based on field name
     */
    private function getExampleValueForField(string $fieldName): string
    {
        $fieldName = strtolower($fieldName);

        if (str_contains($fieldName, 'email')) {
            return 'example@domain.com';
        } elseif (str_contains($fieldName, 'name')) {
            return 'John Doe';
        } elseif (str_contains($fieldName, 'phone')) {
            return '+1234567890';
        } elseif (str_contains($fieldName, 'message') || str_contains($fieldName, 'comment')) {
            return 'Your message here';
        } elseif (str_contains($fieldName, 'company')) {
            return 'Your Company Name';
        } else {
            return 'example value';
        }
    }

    /**
     * Return error response
     */
    private function errorResponse(Response $response, string $message, int $status = 400, array $errors = []): Response
    {
        $data = [
            'success' => false,
            'message' => $message
        ];

        if (!empty($errors)) {
            $data['errors'] = $errors;
        }

        $response->getBody()->write(json_encode($data));
        return $response
            ->withStatus($status)
            ->withHeader('Content-Type', 'application/json');
    }
}
