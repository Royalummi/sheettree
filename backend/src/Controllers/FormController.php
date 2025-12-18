<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Form;
use App\Models\FormSubmission;
use App\Models\ApiSubmission;
use App\Services\GoogleSheetsService;
use App\Models\ConnectedSheet;
use App\Models\User;

class FormController
{
    /**
     * Get all forms for the authenticated user
     */
    public function getUserForms(Request $request, Response $response): Response
    {
        try {
            // Get user from JWT token (assumes middleware sets this)
            $userId = $request->getAttribute('user_id');

            $forms = Form::where('user_id', $userId)
                ->with(['connectedSheet', 'submissions', 'apiConfigs.submissions'])
                ->withCount(['submissions'])
                ->orderBy('created_at', 'desc')
                ->get();

            $data = [
                'forms' => $forms->map(function ($form) {
                    // Count submissions from both sources:
                    // 1. Direct form submissions
                    $directSubmissions = $form->submissions_count ?? 0;

                    // 2. API/Embed submissions through FormApiConfig
                    $apiSubmissions = 0;
                    if ($form->apiConfigs) {
                        foreach ($form->apiConfigs as $config) {
                            $apiSubmissions += $config->submissions->count();
                        }
                    }

                    $totalSubmissions = $directSubmissions + $apiSubmissions;

                    return [
                        'id' => $form->id,
                        'title' => $form->title,
                        'description' => $form->description,
                        'fields' => is_string($form->fields) ? json_decode($form->fields, true) : $form->fields,
                        'is_active' => $form->is_active,
                        'is_public' => $form->is_public,
                        'created_at' => $form->created_at,
                        'updated_at' => $form->updated_at,
                        'submissions_count' => $totalSubmissions,
                        'connected_sheet' => $form->connectedSheet ? [
                            'id' => $form->connectedSheet->id,
                            'spreadsheet_name' => $form->connectedSheet->spreadsheet_name,
                            'spreadsheet_id' => $form->connectedSheet->spreadsheet_id,
                            'sheet_name' => $form->connectedSheet->sheet_name
                        ] : null
                    ];
                })
            ];

            $response->getBody()->write(json_encode($data));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Create a new form
     */
    public function createForm(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $data = $request->getParsedBody();

            // Validate required fields
            if (!isset($data['title']) || empty($data['title'])) {
                $response->getBody()->write(json_encode(['error' => 'Title is required']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            if (!isset($data['fields']) || !is_array($data['fields'])) {
                $response->getBody()->write(json_encode(['error' => 'Fields array is required']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $form = Form::create([
                'user_id' => $userId,
                'title' => $data['title'],
                'description' => $data['description'] ?? '',
                'fields' => $data['fields'], // Let the model handle array casting
                'connected_sheet_id' => $data['connected_sheet_id'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'is_public' => $data['is_public'] ?? false,
                'created_at' => new \DateTime(),
                'updated_at' => new \DateTime()
            ]);

            $form->load('connectedSheet');

            $response->getBody()->write(json_encode([
                'message' => 'Form created successfully',
                'form' => $form
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get a specific form by ID
     */
    public function getForm(Request $request, Response $response, array $args): Response
    {
        try {
            $formId = $args['id'];
            $userId = $request->getAttribute('user_id'); // This might be null for public access

            /** @var Form|null $form */
            $form = Form::with(['connectedSheet', 'user'])
                ->where('id', $formId)
                ->first();

            if (!$form) {
                $response->getBody()->write(json_encode(['error' => 'Form not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Allow access if form is public OR user owns the form
            $hasAccess = $form->is_public || ($userId && $form->user_id === $userId);

            if (!$hasAccess) {
                $response->getBody()->write(json_encode(['error' => 'Access denied']));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            $formData = [
                'id' => $form->id,
                'title' => $form->title,
                'description' => $form->description,
                'fields' => $form->fields, // Already cast as array in model
                'connected_sheet_id' => $form->connected_sheet_id,
                'is_active' => $form->is_active,
                'is_public' => $form->is_public,
                'created_at' => $form->created_at,
                'updated_at' => $form->updated_at,
                'connected_sheet' => $form->connectedSheet ? [
                    'id' => $form->connectedSheet->id,
                    'spreadsheet_name' => $form->connectedSheet->spreadsheet_name,
                    'spreadsheet_id' => $form->connectedSheet->spreadsheet_id,
                    'sheet_name' => $form->connectedSheet->sheet_name
                ] : null,
                'owner' => [
                    'id' => $form->user->id,
                    'name' => $form->user->name,
                    'email' => $form->user->email
                ]
            ];

            $response->getBody()->write(json_encode($formData));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update a form
     */
    public function updateForm(Request $request, Response $response, array $args): Response
    {
        try {
            $formId = $args['id'];
            $userId = $request->getAttribute('user_id');
            $data = $request->getParsedBody();

            /** @var Form|null $form */
            $form = Form::find($formId);

            if (!$form) {
                $response->getBody()->write(json_encode(['error' => 'Form not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check if user owns the form
            if ($form->user_id !== $userId) {
                $response->getBody()->write(json_encode(['error' => 'Access denied']));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Update allowed fields
            $allowedFields = ['title', 'description', 'fields', 'connected_sheet_id', 'is_active', 'is_public'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    // Let the model handle array casting for fields
                    $form->$field = $data[$field];
                }
            }

            $form->updated_at = new \DateTime();
            $form->save();

            $form->load('connectedSheet');

            $response->getBody()->write(json_encode([
                'message' => 'Form updated successfully',
                'form' => $form
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete a form
     */
    public function deleteForm(Request $request, Response $response, array $args): Response
    {
        try {
            $formId = $args['id'];
            $userId = $request->getAttribute('user_id');

            /** @var Form|null $form */
            $form = Form::find($formId);

            if (!$form) {
                $response->getBody()->write(json_encode(['error' => 'Form not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check if user owns the form
            if ($form->user_id !== $userId) {
                $response->getBody()->write(json_encode(['error' => 'Access denied']));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Delete the form
            $form->delete();

            $response->getBody()->write(json_encode(['message' => 'Form deleted successfully']));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Submit data to a form (directly to Google Sheets)
     */
    public function submitForm(Request $request, Response $response, array $args): Response
    {
        try {
            $formId = $args['id'];
            $data = $request->getParsedBody();

            $form = Form::with(['connectedSheet', 'user'])->find($formId);

            if (!$form) {
                $response->getBody()->write(json_encode(['error' => 'Form not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            /** @var Form $form */

            // Check if form is active
            if (!$form->is_active) {
                $response->getBody()->write(json_encode(['error' => 'Form is not currently accepting submissions']));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Check if form has connected sheet
            if (!$form->connectedSheet) {
                $response->getBody()->write(json_encode(['error' => 'This form is not connected to a Google Sheet']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Validate submission data against form fields
            $formFields = $form->fields; // Already cast as array in model
            $submissionData = [];

            foreach ($formFields as $field) {
                $fieldName = $field['name'];
                $isRequired = $field['required'] ?? false;

                if ($isRequired && (!isset($data[$fieldName]) || empty($data[$fieldName]))) {
                    $response->getBody()->write(json_encode([
                        'error' => "Field '{$field['label']}' is required"
                    ]));
                    return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
                }

                // Handle different field types
                $value = $data[$fieldName] ?? '';
                if (is_array($value)) {
                    // For checkboxes/multiple selection, join with commas
                    $submissionData[$field['label']] = implode(', ', $value);
                } else {
                    $submissionData[$field['label']] = $value;
                }
            }

            // Initialize Google Sheets service with retry configuration
            $googleClient = new \Google\Client();
            $googleClient->setClientId($_ENV['GOOGLE_CLIENT_ID']);
            $googleClient->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);
            $googleClient->setRedirectUri($_ENV['GOOGLE_REDIRECT_URI']);
            $googleClient->setScopes([
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive.file'
            ]);

            // Set retry configuration for better reliability
            $googleClient->setConfig('retry', [
                'retries' => 2,
                'delay' => function ($attempt) {
                    return 1000 * $attempt; // 1s, 2s delays
                }
            ]);

            $sheetsService = new GoogleSheetsService($googleClient);

            // Authenticate using form owner's credentials with retry
            try {
                $sheetsService->authenticateUser($form->user_id);
            } catch (\Exception $e) {
                // Single retry with fresh client instance
                $googleClient = new \Google\Client();
                $googleClient->setClientId($_ENV['GOOGLE_CLIENT_ID']);
                $googleClient->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);
                $googleClient->setRedirectUri($_ENV['GOOGLE_REDIRECT_URI']);
                $googleClient->setScopes([
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/spreadsheets',
                    'https://www.googleapis.com/auth/drive.file'
                ]);

                $sheetsService = new GoogleSheetsService($googleClient);

                try {
                    $sheetsService->authenticateUser($form->user_id);
                } catch (\Exception $retryException) {
                    $response->getBody()->write(json_encode([
                        'error' => 'Unable to connect to Google Sheets. Please contact the form owner to re-authenticate.'
                    ]));
                    return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
                }
            }

            // Test sheet access
            if (!$sheetsService->testSheetAccess($form->connectedSheet->spreadsheet_id, $form->connectedSheet->sheet_name)) {
                $response->getBody()->write(json_encode([
                    'error' => 'Cannot access the connected Google Sheet. Please contact the form owner.'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            // Check if sheet has headers, create them if not
            $headers = $sheetsService->getSheetHeaders($form->connectedSheet->spreadsheet_id, $form->connectedSheet->sheet_name);
            if (empty($headers)) {
                $fieldLabels = array_map(function ($field) {
                    return $field['label'];
                }, $formFields);
                $sheetsService->createHeaders($form->connectedSheet->spreadsheet_id, $form->connectedSheet->sheet_name, $fieldLabels);
            }

            // Save submission to database first
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

            $formSubmission = FormSubmission::create([
                'form_id' => $formId,
                'submission_data' => json_encode($submissionData),
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent
            ]);

            // Then append submission to Google Sheet
            $sheetWritten = false;
            $sheetError = null;
            try {
                $sheetsService->appendRowToSheet(
                    $form->connectedSheet->spreadsheet_id,
                    $form->connectedSheet->sheet_name,
                    $submissionData
                );
                $sheetWritten = true;
            } catch (\Exception $e) {
                // Log the error but don't fail the submission since it's saved in database
                $sheetError = $e->getMessage();
                error_log("Failed to write to Google Sheet for form {$formId}: " . $sheetError);
            }

            $message = $sheetWritten
                ? 'Form submitted successfully!'
                : 'Form submitted successfully! (Note: Could not sync to Google Sheets)';

            $responseData = [
                'message' => $message,
                'submission_id' => $formSubmission->id
            ];

            if ($sheetWritten && $form->connectedSheet) {
                $responseData['sheet_url'] = "https://docs.google.com/spreadsheets/d/{$form->connectedSheet->spreadsheet_id}/edit";
            }

            $response->getBody()->write(json_encode($responseData));

            // Clean up resources
            $googleClient = null;
            $sheetsService = null;

            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            // Clean up resources on error
            if (isset($googleClient)) {
                $googleClient = null;
            }
            if (isset($sheetsService)) {
                $sheetsService = null;
            }

            $response->getBody()->write(json_encode(['error' => 'Submission failed: ' . $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get form submissions
     */
    /**
     * Get form submissions from connected Google Sheet
     */
    public function getFormSubmissions(Request $request, Response $response, array $args): Response
    {
        try {
            $formId = $args['id'];
            $userId = $request->getAttribute('user_id');
            $queryParams = $request->getQueryParams();

            // Pagination parameters
            $page = isset($queryParams['page']) ? max(1, (int)$queryParams['page']) : 1;
            $limit = isset($queryParams['limit']) ? min(100, max(1, (int)$queryParams['limit'])) : 50;
            $offset = ($page - 1) * $limit;

            /** @var Form|null $form */
            $form = Form::with(['connectedSheet', 'apiConfigs'])->find($formId);

            if (!$form) {
                $response->getBody()->write(json_encode(['error' => 'Form not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check if user owns the form
            if ($form->user_id !== $userId) {
                $response->getBody()->write(json_encode(['error' => 'Access denied']));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Get direct form submissions
            $directSubmissions = FormSubmission::where('form_id', $formId)
                ->orderBy('created_at', 'desc')
                ->skip($offset)
                ->take($limit)
                ->get()
                ->map(function ($sub) {
                    return [
                        'id' => $sub->id,
                        'data' => $sub->submission_data,
                        'source' => 'direct',
                        'ip_address' => $sub->ip_address,
                        'user_agent' => $sub->user_agent,
                        'created_at' => $sub->created_at->toIso8601String()
                    ];
                });

            // Get API/Embed submissions
            $apiSubmissions = collect();
            if ($form->apiConfigs->isNotEmpty()) {
                $configIds = $form->apiConfigs->pluck('id')->toArray();
                $apiSubmissions = ApiSubmission::whereIn('form_api_config_id', $configIds)
                    ->orderBy('created_at', 'desc')
                    ->skip($offset)
                    ->take($limit)
                    ->get()
                    ->map(function ($sub) {
                        return [
                            'id' => $sub->id,
                            'data' => $sub->submission_data,
                            'source' => 'api/embed',
                            'ip_address' => $sub->ip_address,
                            'user_agent' => $sub->user_agent,
                            'origin' => $sub->origin,
                            'sheet_written' => $sub->sheet_written,
                            'sheet_error' => $sub->sheet_error,
                            'created_at' => $sub->created_at->toIso8601String()
                        ];
                    });
            }

            // Merge and sort by created_at
            $allSubmissions = $directSubmissions->merge($apiSubmissions)
                ->sortByDesc('created_at')
                ->values();

            // Count totals
            $totalDirect = FormSubmission::where('form_id', $formId)->count();
            $totalApi = 0;
            if ($form->apiConfigs->isNotEmpty()) {
                $configIds = $form->apiConfigs->pluck('id')->toArray();
                $totalApi = ApiSubmission::whereIn('form_api_config_id', $configIds)->count();
            }
            $totalSubmissions = $totalDirect + $totalApi;

            $response->getBody()->write(json_encode([
                'form' => [
                    'id' => $form->id,
                    'title' => $form->title,
                    'fields' => $form->fields,
                    'connected_sheet' => $form->connectedSheet ? [
                        'name' => $form->connectedSheet->spreadsheet_name,
                        'sheet_name' => $form->connectedSheet->sheet_name,
                        'url' => "https://docs.google.com/spreadsheets/d/{$form->connectedSheet->spreadsheet_id}/edit"
                    ] : null
                ],
                'submissions' => $allSubmissions,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $totalSubmissions,
                    'total_pages' => ceil($totalSubmissions / $limit)
                ],
                'stats' => [
                    'total' => $totalSubmissions,
                    'direct' => $totalDirect,
                    'api_embed' => $totalApi
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Get form submissions error: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
