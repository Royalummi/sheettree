<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\FormApiConfig;

class ApiDocumentationController
{
    /**
     * Generate API documentation page
     * GET /api/docs/{apiHash}
     */
    public function generateDocumentation(Request $request, Response $response, array $args): Response
    {
        $apiHash = $args['apiHash'] ?? null;

        $apiConfig = FormApiConfig::where('api_hash', $apiHash)
            ->where('is_active', true)
            ->with('form.connectedSheet')
            ->first();

        if (!$apiConfig) {
            $response->getBody()->write('<h1>API Not Found</h1><p>The requested API configuration was not found.</p>');
            return $response->withStatus(404)->withHeader('Content-Type', 'text/html');
        }

        $html = $this->generateHtmlDocumentation($apiConfig);

        $response->getBody()->write($html);
        return $response->withHeader('Content-Type', 'text/html');
    }

    /**
     * Generate HTML documentation
     */
    private function generateHtmlDocumentation(FormApiConfig $apiConfig): string
    {
        $endpoint = $_SERVER['HTTP_HOST'] . "/api/external/submit/{$apiConfig->api_hash}";

        $examplePayload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'Hello from external form!'
        ];

        if ($apiConfig->required_fields) {
            foreach ($apiConfig->required_fields as $field) {
                if (!isset($examplePayload[$field])) {
                    $examplePayload[$field] = $this->getExampleValueForField($field);
                }
            }
        }

        if ($apiConfig->captcha_enabled) {
            if ($apiConfig->captcha_type === 'recaptcha_v2' || $apiConfig->captcha_type === 'recaptcha_v3') {
                $examplePayload['g-recaptcha-response'] = 'RECAPTCHA_RESPONSE_TOKEN';
            } elseif ($apiConfig->captcha_type === 'hcaptcha') {
                $examplePayload['h-captcha-response'] = 'HCAPTCHA_RESPONSE_TOKEN';
            }
        }

        // Add honeypot field
        $examplePayload[$apiConfig->honeypot_field_name] = '';

        return "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>{$apiConfig->api_name} - API Documentation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 0; border-radius: 12px; margin-bottom: 2rem; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .header p { font-size: 1.1rem; opacity: 0.9; }
        .card { background: white; border-radius: 12px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .endpoint { background: #1a202c; color: #68d391; padding: 1rem; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 1.1rem; margin: 1rem 0; }
        .method { background: #38a169; color: white; padding: 0.3rem 0.8rem; border-radius: 4px; font-weight: bold; margin-right: 1rem; }
        .code-block { background: #2d3748; color: #e2e8f0; padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-family: 'Courier New', monospace; margin: 1rem 0; }
        .feature { background: #e6fffa; border-left: 4px solid #38b2ac; padding: 1rem; margin: 1rem 0; border-radius: 0 8px 8px 0; }
        .warning { background: #fffbeb; border-left: 4px solid #f6ad55; padding: 1rem; margin: 1rem 0; border-radius: 0 8px 8px 0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        h2 { color: #2d3748; margin-bottom: 1rem; font-size: 1.8rem; }
        h3 { color: #4a5568; margin-bottom: 0.8rem; font-size: 1.3rem; }
        .badge { background: #edf2f7; color: #2d3748; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
        .success { background: #f0fff4; color: #22543d; }
        .danger { background: #fed7d7; color: #742a2a; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th, td { padding: 0.8rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>{$apiConfig->api_name}</h1>
            <p>{$apiConfig->description}</p>
        </div>

        <div class='card'>
            <h2>🚀 Quick Start</h2>
            <p>Submit form data to your Google Sheets using this API endpoint:</p>
            <div class='endpoint'>
                <span class='method'>POST</span>https://{$endpoint}
            </div>
        </div>

        <div class='grid'>
            <div class='card'>
                <h2>🔐 Authentication</h2>
                <p>Include your API key in the Authorization header:</p>
                <div class='code-block'>Authorization: Bearer YOUR_API_KEY</div>
                <div class='warning'>
                    <strong>Keep your API key secure!</strong> Never expose it in client-side code.
                </div>
            </div>

            <div class='card'>
                <h2>📝 Content Types</h2>
                <p>Supports both JSON and form data:</p>
                <ul style='margin: 1rem 0; padding-left: 1.5rem;'>
                    <li><code>application/json</code></li>
                    <li><code>application/x-www-form-urlencoded</code></li>
                </ul>
            </div>
        </div>

        <div class='card'>
            <h2>📋 Example Request</h2>
            <h3>JavaScript/Fetch:</h3>
            <div class='code-block'>fetch('https://{$endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(" . json_encode($examplePayload, JSON_PRETTY_PRINT) . ")
})
.then(response => response.json())
.then(data => console.log(data));</div>

            <h3>cURL:</h3>
            <div class='code-block'>curl -X POST https://{$endpoint} \\
  -H \"Content-Type: application/json\" \\
  -H \"Authorization: Bearer YOUR_API_KEY\" \\
  -d '" . json_encode($examplePayload) . "'</div>

            <h3>HTML Form:</h3>
            <div class='code-block'>&lt;form action=\"https://{$endpoint}\" method=\"POST\"&gt;
  &lt;input type=\"hidden\" name=\"Authorization\" value=\"Bearer YOUR_API_KEY\"&gt;
  &lt;input type=\"text\" name=\"name\" placeholder=\"Name\" required&gt;
  &lt;input type=\"email\" name=\"email\" placeholder=\"Email\" required&gt;
  &lt;textarea name=\"message\" placeholder=\"Message\"&gt;&lt;/textarea&gt;
  &lt;input type=\"hidden\" name=\"{$apiConfig->honeypot_field_name}\" value=\"\"&gt;
  &lt;button type=\"submit\"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</div>
        </div>

        <div class='card'>
            <h2>⚡ Features</h2>
            <div class='grid'>
                " . ($apiConfig->cors_enabled ? "<div class='feature'><strong>✅ CORS Enabled</strong><br>Cross-origin requests allowed from: " . implode(', ', $apiConfig->allowed_origins ?? ['*']) . "</div>" : "<div class='warning'><strong>❌ CORS Disabled</strong><br>Only same-origin requests allowed</div>") . "
                
                " . ($apiConfig->captcha_enabled ? "<div class='feature'><strong>🛡️ CAPTCHA Protection</strong><br>Type: " . ucfirst($apiConfig->captcha_type) . "</div>" : "<div class='badge'>No CAPTCHA</div>") . "
                
                " . ($apiConfig->validation_enabled ? "<div class='feature'><strong>✅ Validation Enabled</strong><br>Required fields: " . implode(', ', $apiConfig->required_fields ?? []) . "</div>" : "<div class='badge'>No Validation</div>") . "
            </div>
        </div>

        <div class='card'>
            <h2>📤 Response Format</h2>
            <h3>Success Response:</h3>
            <div class='code-block'>{
  \"success\": true,
  \"message\": \"{$apiConfig->success_message}\"
}</div>

            <h3>Error Response:</h3>
            <div class='code-block'>{
  \"success\": false,
  \"message\": \"Error description\",
  \"errors\": {
    \"field_name\": [\"Validation error\"]
  }
}</div>
        </div>

        " . ($apiConfig->field_mapping ? "
        <div class='card'>
            <h2>🔄 Field Mapping</h2>
            <p>Your form fields are mapped to these Google Sheets columns:</p>
            <table>
                <thead>
                    <tr><th>Your Field Name</th><th>Sheet Column</th></tr>
                </thead>
                <tbody>
                    " . implode('', array_map(function ($external, $internal) {
            return "<tr><td><code>{$external}</code></td><td><code>{$internal}</code></td></tr>";
        }, array_keys($apiConfig->field_mapping), $apiConfig->field_mapping)) . "
                </tbody>
            </table>
        </div>
        " : "") . "

        <div class='card'>
            <h2>🔒 Security</h2>
            <ul style='margin: 1rem 0; padding-left: 1.5rem;'>
                <li><strong>Honeypot Field:</strong> Include empty field <code>{$apiConfig->honeypot_field_name}</code> for spam protection</li>
                <li><strong>Rate Limiting:</strong> Maximum 10 requests per minute per IP</li>
                <li><strong>Authentication:</strong> API key required in Authorization header</li>
                " . ($apiConfig->captcha_enabled ? "<li><strong>CAPTCHA:</strong> " . ucfirst($apiConfig->captcha_type) . " verification required</li>" : "") . "
            </ul>
        </div>

        <div class='card'>
            <h2>📊 Connected Sheet</h2>
            <p><strong>Spreadsheet:</strong> {$apiConfig->form->connectedSheet->spreadsheet_name}</p>
            <p><strong>Sheet:</strong> {$apiConfig->form->connectedSheet->sheet_name}</p>
            <div class='feature'>
                <strong>Auto-Column Creation:</strong> New fields will automatically create columns in your sheet.
            </div>
        </div>

        <div style='text-align: center; margin: 3rem 0; color: #718096;'>
            <p>Generated by SheetTree API Documentation</p>
        </div>
    </div>
</body>
</html>";
    }

    /**
     * Get example value for field based on name
     */
    private function getExampleValueForField(string $fieldName): string
    {
        $fieldName = strtolower($fieldName);

        if (str_contains($fieldName, 'email')) {
            return 'user@example.com';
        } elseif (str_contains($fieldName, 'name')) {
            return 'John Doe';
        } elseif (str_contains($fieldName, 'phone')) {
            return '+1234567890';
        } elseif (str_contains($fieldName, 'message') || str_contains($fieldName, 'comment')) {
            return 'Your message here';
        } elseif (str_contains($fieldName, 'company')) {
            return 'Example Company';
        } else {
            return 'example value';
        }
    }
}
