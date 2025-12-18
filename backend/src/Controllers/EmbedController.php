<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Form;
use App\Models\FormApiConfig;
use App\Models\ApiSubmission;
use App\Models\ApiUsageLog;
use App\Services\GoogleSheetsService;
use App\Services\CaptchaService;
use App\Services\SpamProtectionService;
use Illuminate\Support\Facades\Validator;
use Exception;

class EmbedController
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
            error_log("EmbedController initialization error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Display embeddable form
     * GET /embed/form/{formId}
     */
    public function showForm(Request $request, Response $response, array $args): Response
    {
        $formId = $args['formId'] ?? null;

        if (!$formId) {
            return $this->errorResponse($response, 'Form ID is required', 400);
        }

        try {
            // Get form with connected sheet
            $form = Form::with(['connectedSheet', 'apiConfigs'])
                ->where('id', $formId)
                ->where('is_active', true)
                ->first();

            if (!$form) {
                return $this->errorResponse($response, 'Form not found or inactive', 404);
            }

            // Check if form has embed-enabled API config, create if not exists
            $embedConfig = $form->apiConfigs()
                ->where('is_active', true)
                ->first();

            if (!$embedConfig) {
                // Auto-create a default embed config for the form
                $embedConfig = $this->createDefaultEmbedConfig($form);
            }

            // Get theme and customization settings
            $theme = $this->getFormTheme($embedConfig);

            // Override theme with query parameters if provided
            $queryParams = $request->getQueryParams();

            // Debug: Log received parameters (only in development)
            if ($_ENV['APP_ENV'] === 'development' && isset($queryParams['borderColor'])) {
                error_log("Border Color Received: " . $queryParams['borderColor']);
            }

            $theme = $this->applyQueryParamsToTheme($theme, $queryParams);

            // Debug: Log applied theme (only in development)
            if ($_ENV['APP_ENV'] === 'development') {
                error_log("Applied border_color: " . ($theme['border_color'] ?? 'NOT SET'));
            }

            // Generate form HTML
            $formHtml = $this->generateFormHtml($form, $embedConfig, $theme);

            // Return HTML response for iframe
            $response->getBody()->write($formHtml);
            return $response->withHeader('Content-Type', 'text/html');
        } catch (Exception $e) {
            error_log("Embed form error: " . $e->getMessage());
            return $this->errorResponse($response, 'Unable to load form', 500);
        }
    }

    /**
     * Handle form submission from embedded form
     * POST /embed/form/{formId}/submit
     */
    public function submitForm(Request $request, Response $response, array $args): Response
    {
        $formId = $args['formId'] ?? null;

        if (!$formId) {
            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Form ID is required'
            ], 400);
        }

        try {
            // Get form and API config
            $form = Form::with(['connectedSheet', 'apiConfigs'])
                ->where('id', $formId)
                ->where('is_active', true)
                ->first();

            if (!$form) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'Form not found or inactive'
                ], 404);
            }

            $apiConfig = $form->apiConfigs()
                ->where('is_active', true)
                ->first();

            if (!$apiConfig) {
                // Auto-create a default embed config if none exists
                $apiConfig = $this->createDefaultEmbedConfig($form);
                if (!$apiConfig) {
                    return $this->jsonResponse($response, [
                        'success' => false,
                        'message' => 'Form configuration not found'
                    ], 404);
                }
            }

            // Log API usage
            try {
                ApiUsageLog::logUsage($apiConfig->id, $request, 200);
            } catch (Exception $e) {
                // Continue if logging fails
            }

            // Handle CORS for iframe
            $response = $this->applyCorsHeaders($response, $apiConfig, $request);

            // Get submission data
            $submissionData = $this->getSubmissionData($request);

            // Debug logging
            if ($_ENV['APP_ENV'] === 'development') {
                error_log("Submission data received: " . json_encode($submissionData));
                error_log("CAPTCHA enabled: " . ($apiConfig->captcha_enabled ? 'yes' : 'no'));
                error_log("Honeypot field: " . ($apiConfig->honeypot_field_name ?? 'none'));
            }

            // Apply same security checks as External API
            // CAPTCHA validation
            if ($apiConfig->captcha_enabled) {
                $captchaResponse = $submissionData['g-recaptcha-response'] ?? $submissionData['h-captcha-response'] ?? null;
                if (!$captchaResponse) {
                    return $this->jsonResponse($response, [
                        'success' => false,
                        'message' => 'CAPTCHA verification required'
                    ], 400);
                }

                $captchaValid = $this->captchaService->verifyCaptcha(
                    $submissionData,
                    $apiConfig->captcha_type ?? 'recaptcha_v2',
                    $apiConfig->captcha_secret_key ?? ''
                );
                if (!$captchaValid) {
                    return $this->jsonResponse($response, [
                        'success' => false,
                        'message' => 'CAPTCHA verification failed'
                    ], 400);
                }
            }

            // Spam Protection
            if ($apiConfig->honeypot_field_name) {
                $spamCheckResult = $this->spamProtectionService->checkSubmission($submissionData, $apiConfig, $request);
                if (isset($spamCheckResult['valid']) && !$spamCheckResult['valid']) {
                    return $this->jsonResponse($response, [
                        'success' => false,
                        'message' => 'Submission blocked: ' . ($spamCheckResult['reason'] ?? 'Spam detected')
                    ], 400);
                }
            }

            // Field Validation
            if ($apiConfig->validation_enabled && $apiConfig->validation_rules) {
                $validator = Validator::make($submissionData, $apiConfig->validation_rules);
                if ($validator->fails()) {
                    return $this->jsonResponse($response, [
                        'success' => false,
                        'message' => 'Validation failed: ' . implode(', ', $validator->errors()->all())
                    ], 400);
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
                if ($form->connectedSheet) {
                    $connectedSheet = $form->connectedSheet;

                    if ($connectedSheet->spreadsheet_id && $connectedSheet->sheet_name) {
                        $this->writeToGoogleSheets($form, $connectedSheet, $submissionData);
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

            // Return success response
            return $this->jsonResponse($response, [
                'success' => true,
                'message' => $apiConfig->success_message ?? 'Form submitted successfully!',
                'data' => $submissionData,
                'sheet_status' => [
                    'written' => $sheetWriteSuccess,
                    'error' => $sheetError
                ]
            ]);
        } catch (Exception $e) {
            error_log("Embed submission error: " . $e->getMessage());

            // Log failed usage
            try {
                if (isset($apiConfig)) {
                    ApiUsageLog::logUsage($apiConfig->id, $request, 500, $e->getMessage());
                }
            } catch (Exception $logException) {
                // Continue if logging fails
            }

            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Generate the form HTML for embedding
     */
    private function generateFormHtml(Form $form, FormApiConfig $config, array $theme): string
    {
        $formFields = $form->fields ?? [];
        $honeypotField = $config->honeypot_field_name;
        $captchaEnabled = $config->captcha_enabled;
        $captchaType = $config->captcha_type;
        $captchaSiteKey = $config->captcha_site_key ?? '';

        // Apply field mapping if configured
        if ($config->field_mapping) {
            $fieldMapping = $config->field_mapping;
        } else {
            $fieldMapping = [];
        }

        ob_start();
?>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title><?= htmlspecialchars($form->title) ?></title>
            <style>
                <?= $this->generateFormCss($theme) ?><?php if (!empty($theme['custom_css'])): ?>
                /* Custom CSS */
                <?= $theme['custom_css'] ?><?php endif; ?>
            </style>
            <?php if ($captchaEnabled && $captchaType === 'recaptcha_v2'): ?>
                <script src="https://www.google.com/recaptcha/api.js" async defer></script>
            <?php elseif ($captchaEnabled && $captchaType === 'recaptcha_v3'): ?>
                <script src="https://www.google.com/recaptcha/api.js?render=<?= htmlspecialchars($captchaSiteKey) ?>"></script>
            <?php elseif ($captchaEnabled && $captchaType === 'hcaptcha'): ?>
                <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
            <?php endif; ?>
        </head>

        <body>
            <div class="sheettree-form-container">
                <form id="sheetTreeForm" class="sheettree-form" method="POST">
                    <?php if (!empty($theme['show_form_title'])): ?>
                        <h1 class="form-title">
                            <?= htmlspecialchars(!empty($theme['form_title_text']) ? $theme['form_title_text'] : $form->title) ?>
                        </h1>
                    <?php endif; ?>

                    <?php if ($form->description && empty($theme['hide_header'])): ?>
                        <div class="form-description">
                            <?= htmlspecialchars($form->description) ?>
                        </div>
                    <?php endif; ?>

                    <div id="form-fields">
                        <?php foreach ($formFields as $field): ?>
                            <div class="form-field">
                                <?= $this->renderFormField($field, $fieldMapping) ?>
                            </div>
                        <?php endforeach; ?>

                        <?php if ($honeypotField): ?>
                            <!-- Honeypot field for spam protection -->
                            <input type="text" name="<?= htmlspecialchars($honeypotField) ?>" style="display: none !important;" tabindex="-1" autocomplete="off">
                        <?php endif; ?>

                        <?php if ($captchaEnabled): ?>
                            <div class="form-field captcha-field">
                                <?php if ($captchaType === 'recaptcha_v2'): ?>
                                    <div class="g-recaptcha" data-sitekey="<?= htmlspecialchars($captchaSiteKey) ?>"></div>
                                <?php elseif ($captchaType === 'hcaptcha'): ?>
                                    <div class="h-captcha" data-sitekey="<?= htmlspecialchars($captchaSiteKey) ?>"></div>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="submit-button" id="submitButton">
                            <span class="button-text"><?= htmlspecialchars($theme['submit_button_text'] ?? 'Submit') ?></span>
                            <span class="button-loading" style="display: none;">Submitting...</span>
                        </button>
                    </div>

                    <div id="form-message" class="form-message" style="display: none;"></div>
                </form>

                <?php if (empty($theme['hide_footer'])): ?>
                    <div class="sheettree-branding">
                        <a href="https://sheettree.com" target="_blank" rel="noopener">
                            Powered by SheetTree
                        </a>
                    </div>
                <?php endif; ?>
            </div>

            <script>
                <?= $this->generateFormJs($captchaEnabled, $captchaType, $captchaSiteKey, $form->id) ?>
            </script>
        </body>

        </html>
    <?php
        return ob_get_clean();
    }

    /**
     * Render individual form field
     */
    private function renderFormField(array $field, array $fieldMapping): string
    {
        $type = $field['type'] ?? 'text';
        $name = $fieldMapping[$field['name']] ?? $field['name'];
        $label = $field['label'] ?? ucfirst($field['name']);
        $required = $field['required'] ?? false;
        $placeholder = $field['placeholder'] ?? ($label . '...');

        ob_start();
    ?>
        <label class="field-label <?= $required ? 'required' : '' ?>">
            <?= htmlspecialchars($label) ?>
            <?php if ($required): ?>
                <span class="required-indicator">*</span>
            <?php endif; ?>
        </label>

        <?php if ($type === 'textarea'): ?>
            <textarea
                name="<?= htmlspecialchars($name) ?>"
                class="form-input"
                placeholder="<?= htmlspecialchars($placeholder) ?>"
                <?= $required ? 'required' : '' ?>
                rows="4"> </textarea>
        <?php elseif ($type === 'select'): ?>
            <select
                name="<?= htmlspecialchars($name) ?>"
                class="form-input"
                <?= $required ? 'required' : '' ?>>
                <option value="">Choose an option...</option>
                <?php foreach ($field['options'] ?? [] as $option): ?>
                    <option value="<?= htmlspecialchars($option) ?>">
                        <?= htmlspecialchars($option) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        <?php else: ?>
            <input
                type="<?= htmlspecialchars($type) ?>"
                name="<?= htmlspecialchars($name) ?>"
                class="form-input"
                placeholder="<?= htmlspecialchars($placeholder) ?>"
                <?= $required ? 'required' : '' ?>>
        <?php endif; ?>
<?php
        return ob_get_clean();
    }

    /**
     * Get form theme settings
     */
    private function getFormTheme(FormApiConfig $config): array
    {
        // Default theme
        $defaultTheme = [
            'primary_color' => '#007cba',
            'background_color' => '#ffffff',
            'text_color' => '#333333',
            'border_color' => '#dddddd',
            'border_width' => '1px',
            'border_style' => 'solid',
            'border_radius' => '4px',
            'font_family' => 'Arial, sans-serif',
            'font_size' => '16px',
            'form_width' => '100%',
            'field_spacing' => '20px',
            'show_form_title' => false,
            'form_title_text' => '',
            'form_title_size' => '24px',
            'form_title_color' => '#333333',
            'form_title_align' => 'left',
            'custom_css' => ''
        ];

        // Merge with custom theme if available
        $customTheme = $config->custom_response_data['theme'] ?? [];

        return array_merge($defaultTheme, $customTheme);
    }

    /**
     * Apply query parameters to theme
     */
    private function applyQueryParamsToTheme(array $theme, array $queryParams): array
    {
        // Apply theme preset FIRST (so individual colors can override it)
        if (isset($queryParams['theme'])) {
            if ($queryParams['theme'] === 'dark') {
                $theme['background_color'] = '#1f2937';
                $theme['text_color'] = '#f9fafb';
                $theme['border_color'] = '#374151';
            } elseif ($queryParams['theme'] === 'light') {
                $theme['background_color'] = '#ffffff';
                $theme['text_color'] = '#333333';
                $theme['border_color'] = '#dddddd';
            }
        }

        // Now apply individual color overrides (these take priority)
        if (isset($queryParams['bgColor'])) {
            $theme['background_color'] = '#' . ltrim($queryParams['bgColor'], '#');
        }
        if (isset($queryParams['primaryColor'])) {
            $theme['primary_color'] = '#' . ltrim($queryParams['primaryColor'], '#');
        }
        if (isset($queryParams['textColor'])) {
            $theme['text_color'] = '#' . ltrim($queryParams['textColor'], '#');
        }
        if (isset($queryParams['borderColor'])) {
            $theme['border_color'] = '#' . ltrim($queryParams['borderColor'], '#');
        }

        // Border styling
        if (isset($queryParams['borderWidth'])) {
            $theme['border_width'] = $queryParams['borderWidth'];
        }
        if (isset($queryParams['borderStyle'])) {
            $theme['border_style'] = $queryParams['borderStyle'];
        }
        if (isset($queryParams['borderRadius'])) {
            $theme['border_radius'] = $queryParams['borderRadius'];
        }

        // Typography
        if (isset($queryParams['fontFamily'])) {
            $theme['font_family'] = urldecode($queryParams['fontFamily']);
        }
        if (isset($queryParams['fontSize'])) {
            $theme['font_size'] = $queryParams['fontSize'];
        }

        // Form title
        if (isset($queryParams['showFormTitle'])) {
            $theme['show_form_title'] = $queryParams['showFormTitle'] === '1';
        }
        if (isset($queryParams['formTitleText'])) {
            $theme['form_title_text'] = urldecode($queryParams['formTitleText']);
        }
        if (isset($queryParams['formTitleSize'])) {
            $theme['form_title_size'] = $queryParams['formTitleSize'];
        }
        if (isset($queryParams['formTitleColor'])) {
            $theme['form_title_color'] = '#' . ltrim($queryParams['formTitleColor'], '#');
        }
        if (isset($queryParams['formTitleAlign'])) {
            $theme['form_title_align'] = $queryParams['formTitleAlign'];
        }

        // Custom CSS
        if (isset($queryParams['customCSS'])) {
            $theme['custom_css'] = urldecode($queryParams['customCSS']);
        }

        // Other options
        if (isset($queryParams['submitButton'])) {
            $theme['submit_button_text'] = urldecode($queryParams['submitButton']);
        }
        if (isset($queryParams['hideHeader']) && $queryParams['hideHeader'] === '1') {
            $theme['hide_header'] = true;
        }
        if (isset($queryParams['hideFooter']) && $queryParams['hideFooter'] === '1') {
            $theme['hide_footer'] = true;
        }
        if (isset($queryParams['animations']) && $queryParams['animations'] === '0') {
            $theme['animations'] = false;
        }

        return $theme;
    }

    /**
     * Generate form CSS
     */
    private function generateFormCss(array $theme): string
    {
        return "
        * {
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 20px;
            font-family: {$theme['font_family']};
            font-size: {$theme['font_size']};
            background-color: {$theme['background_color']};
            color: {$theme['text_color']};
            line-height: 1.6;
        }
        
        .sheettree-form-container {
            max-width: {$theme['form_width']};
            margin: 0 auto;
        }
        
        .sheettree-form {
            background: {$theme['background_color']};
            border-radius: {$theme['border_radius']};
        }
        
        .form-title {
            font-size: {$theme['form_title_size']};
            color: {$theme['form_title_color']};
            text-align: {$theme['form_title_align']};
            margin-bottom: 20px;
            font-weight: 700;
            line-height: 1.3;
        }
        
        .form-description {
            margin-bottom: {$theme['field_spacing']};
            color: {$theme['text_color']};
            font-size: 16px;
        }
        
        .form-field {
            margin-bottom: {$theme['field_spacing']};
        }
        
        .field-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: {$theme['text_color']};
            font-size: 14px;
        }
        
        .required-indicator {
            color: #e74c3c;
            margin-left: 4px;
        }
        
        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: {$theme['border_width']} {$theme['border_style']} {$theme['border_color']} !important;
            border-radius: {$theme['border_radius']};
            font-size: {$theme['font_size']};
            font-family: inherit;
            color: {$theme['text_color']};
            background-color: {$theme['background_color']};
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .form-input:focus {
            outline: none;
            border-color: {$theme['primary_color']} !important;
            box-shadow: 0 0 0 3px rgba(0, 124, 186, 0.1);
        }
        
        /* Only show red border on invalid fields that have been touched/submitted */
        .form-input:invalid:not(:placeholder-shown),
        .form-input.error {
            border-color: #e74c3c !important;
        }
        
        .form-actions {
            margin-top: {$theme['field_spacing']};
        }
        
        .submit-button {
            width: 100%;
            padding: 14px 24px;
            background-color: {$theme['primary_color']};
            color: white;
            border: none;
            border-radius: {$theme['border_radius']};
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.1s ease;
        }
        
        .submit-button:hover:not(:disabled) {
            background-color: color-mix(in srgb, {$theme['primary_color']} 85%, black);
            transform: translateY(-1px);
        }
        
        .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        
        .form-message {
            margin-top: 16px;
            padding: 12px 16px;
            border-radius: {$theme['border_radius']};
            font-size: 14px;
        }
        
        .form-message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .form-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .captcha-field {
            display: flex;
            justify-content: center;
            margin: {$theme['field_spacing']} 0;
        }
        
        .sheettree-branding {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            opacity: 0.7;
        }
        
        .sheettree-branding a {
            color: {$theme['text_color']};
            text-decoration: none;
        }
        
        .sheettree-branding a:hover {
            text-decoration: underline;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .form-input {
                font-size: 16px; /* Prevent zoom on iOS */
            }
        }
        ";
    }

    /**
     * Generate form JavaScript
     */
    private function generateFormJs(bool $captchaEnabled, ?string $captchaType, string $captchaSiteKey, int $formId): string
    {
        return "
        // Form submission handling
        document.getElementById('sheetTreeForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = document.getElementById('submitButton');
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoading = submitButton.querySelector('.button-loading');
            const messageDiv = document.getElementById('form-message');
            
            // Disable button and show loading
            submitButton.disabled = true;
            buttonText.style.display = 'none';
            buttonLoading.style.display = 'inline';
            messageDiv.style.display = 'none';
            
            try {
                // Handle reCAPTCHA v3
                " . ($captchaEnabled && $captchaType === 'recaptcha_v3' ? "
                if (typeof grecaptcha !== 'undefined') {
                    const token = await grecaptcha.execute('$captchaSiteKey', {action: 'submit'});
                    const tokenInput = document.createElement('input');
                    tokenInput.type = 'hidden';
                    tokenInput.name = 'g-recaptcha-response';
                    tokenInput.value = token;
                    this.appendChild(tokenInput);
                }
                " : "") . "
                
                // Collect form data
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Get base URL from current location
                const baseUrl = window.location.origin;
                
                // Submit form
                const response = await fetch(baseUrl + '/embed/form/$formId/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    messageDiv.className = 'form-message success';
                    messageDiv.textContent = result.message;
                    messageDiv.style.display = 'block';
                    
                    // Reset form
                    this.reset();
                    
                    // Notify parent window if in iframe
                    if (window.parent !== window) {
                        window.parent.postMessage({
                            type: 'sheetTreeFormSuccess',
                            formId: $formId,
                            message: result.message
                        }, '*');
                    }
                } else {
                    // Show error message
                    messageDiv.className = 'form-message error';
                    messageDiv.textContent = result.message;
                    messageDiv.style.display = 'block';
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                messageDiv.className = 'form-message error';
                messageDiv.textContent = 'An error occurred: ' + error.message + '. Please try again.';
                messageDiv.style.display = 'block';
            }
            
            // Re-enable button
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
        });
        
        // Auto-resize iframe functionality
        function resizeIframe() {
            const height = document.body.scrollHeight;
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'sheetTreeFormResize',
                    formId: $formId,
                    height: height + 20 // Add padding
                }, '*');
            }
        }
        
        // Initial resize
        window.addEventListener('load', resizeIframe);
        
        // Resize on content changes
        const observer = new MutationObserver(resizeIframe);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        // Resize on window resize
        window.addEventListener('resize', resizeIframe);
        ";
    }

    // Shared utility methods (same as ExternalApiController)
    private function getSubmissionData(Request $request): array
    {
        $body = $request->getBody()->getContents();

        if (empty($body)) {
            return [];
        }

        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            parse_str($body, $data);
        }

        return $data ?? [];
    }

    private function applyCorsHeaders(Response $response, FormApiConfig $apiConfig, Request $request): Response
    {
        $origin = $request->getHeaderLine('Origin');

        if ($apiConfig->cors_enabled && $apiConfig->allowed_origins) {
            $allowedOrigins = $apiConfig->allowed_origins;

            if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
                $response = $response->withHeader('Access-Control-Allow-Origin', $origin ?: '*');
            }
        } else {
            $response = $response->withHeader('Access-Control-Allow-Origin', '*');
        }

        $response = $response
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
            ->withHeader('Access-Control-Allow-Credentials', 'true');

        return $response;
    }

    /**
     * Handle CORS preflight requests
     * OPTIONS /embed/form/{formId}/submit
     */
    public function handleOptions(Request $request, Response $response, array $args): Response
    {
        $formId = $args['formId'] ?? null;

        if (!$formId) {
            return $response->withStatus(400);
        }

        try {
            // Get form and API config for CORS settings
            $form = Form::where('id', $formId)
                ->where('is_active', true)
                ->first();

            if (!$form) {
                return $response->withStatus(404);
            }

            $apiConfig = $form->apiConfigs()
                ->where('is_active', true)
                ->first();

            if (!$apiConfig) {
                return $response->withStatus(404);
            }

            // Apply CORS headers
            $response = $this->applyCorsHeaders($response, $apiConfig, $request);

            return $response->withStatus(200);
        } catch (Exception $e) {
            return $response->withStatus(500);
        }
    }

    private function writeToGoogleSheets(Form $form, $connectedSheet, array $data): void
    {
        // Authenticate using the form owner's credentials
        $this->googleSheetsService->authenticateUser($form->user_id);

        // Map submission data to form field labels for Google Sheets
        $formFields = $form->fields; // Already cast as array in model
        $mappedData = [];

        foreach ($formFields as $field) {
            $fieldName = $field['name'];
            $fieldLabel = $field['label'];

            // Get the value from submission data
            $value = $data[$fieldName] ?? '';

            // Handle different field types
            if (is_array($value)) {
                // For checkboxes/multiple selection, join with commas
                $mappedData[$fieldLabel] = implode(', ', $value);
            } else {
                $mappedData[$fieldLabel] = $value;
            }
        }

        // Check if sheet has headers, create them if not
        $headers = $this->googleSheetsService->getSheetHeaders($connectedSheet->spreadsheet_id, $connectedSheet->sheet_name);
        if (empty($headers)) {
            $fieldLabels = array_map(function ($field) {
                return $field['label'];
            }, $formFields);
            $this->googleSheetsService->createHeaders($connectedSheet->spreadsheet_id, $connectedSheet->sheet_name, $fieldLabels);
        }

        // Append the mapped data to the connected sheet
        $this->googleSheetsService->appendRowToSheet(
            $connectedSheet->spreadsheet_id,
            $connectedSheet->sheet_name,
            $mappedData
        );
    }

    private function errorResponse(Response $response, string $message, int $statusCode): Response
    {
        $html = "
        <!DOCTYPE html>
        <html>
        <head>
            <title>Error</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
                .error { color: #e74c3c; font-size: 18px; }
            </style>
        </head>
        <body>
            <div class='error'>$message</div>
        </body>
        </html>";

        $response->getBody()->write($html);
        return $response->withStatus($statusCode)->withHeader('Content-Type', 'text/html');
    }

    private function jsonResponse(Response $response, array $data, int $statusCode = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withStatus($statusCode)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Create a default embed configuration for a form
     */
    private function createDefaultEmbedConfig($form)
    {
        try {
            // Generate API hash and key for the embed config
            $apiHash = bin2hex(random_bytes(16));
            $apiKey = bin2hex(random_bytes(32));

            $embedConfig = FormApiConfig::create([
                'form_id' => $form->id,
                'api_hash' => $apiHash,
                'api_key' => $apiKey,
                'api_name' => 'Default Embed Config',
                'description' => 'Auto-generated configuration for form embedding',
                'is_active' => true,
                'cors_enabled' => true,
                'allowed_origins' => ['*'], // Allow all origins for embedding
                'captcha_enabled' => false,
                'validation_enabled' => true,
                'response_type' => 'json',
                'success_message' => 'Thank you for your submission!',
                'field_mapping' => []
            ]);

            return $embedConfig;
        } catch (Exception $e) {
            error_log("Error creating default embed config: " . $e->getMessage());
            return null;
        }
    }
}
