<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\FormApiConfig;
use App\Models\Form;
use App\Models\ApiSubmission;
use App\Models\ApiUsageLog;

class ApiConfigController
{
    /**
     * Get all API configurations for a user
     * GET /api/user/api-configs
     */
    public function getUserApiConfigs(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            $apiConfigs = FormApiConfig::whereHas('form', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
                ->with(['form', 'submissions'])
                ->orderBy('created_at', 'desc')
                ->get();

            $data = $apiConfigs->map(function ($config) {
                return [
                    'id' => $config->id,
                    'api_name' => $config->api_name,
                    'api_hash' => $config->api_hash,
                    'api_key' => $config->api_key,
                    'description' => $config->description,
                    'is_active' => $config->is_active,
                    'form' => [
                        'id' => $config->form->id,
                        'name' => $config->form->name
                    ],
                    'cors_enabled' => $config->cors_enabled,
                    'captcha_enabled' => $config->captcha_enabled,
                    'validation_enabled' => $config->validation_enabled,
                    'response_type' => $config->response_type,
                    'submissions_count' => $config->submissions()->count(),
                    'endpoint' => "/api/external/submit/{$config->api_hash}",
                    'created_at' => $config->created_at,
                    'updated_at' => $config->updated_at
                ];
            });

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $data
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to fetch API configurations'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Create new API configuration
     * POST /api/user/api-configs
     */
    public function createApiConfig(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $data = $request->getParsedBody();

            // Validate required fields
            if (!isset($data['form_id']) || !isset($data['api_name'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Form ID and API name are required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Check if form belongs to user
            $form = Form::where('id', $data['form_id'])
                ->where('user_id', $userId)
                ->first();

            if (!$form) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Form not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Create API configuration
            /** @var FormApiConfig $apiConfig */
            $apiConfig = FormApiConfig::create([
                'form_id' => $data['form_id'],
                'api_hash' => FormApiConfig::generateApiHash($data['form_id']),
                'api_key' => FormApiConfig::generateApiKey(),
                'api_name' => $data['api_name'],
                'description' => $data['description'] ?? '',
                'is_active' => $data['is_active'] ?? true,

                // CORS settings
                'cors_enabled' => $data['cors_enabled'] ?? false,
                'allowed_origins' => $data['allowed_origins'] ?? [],

                // Security settings
                'captcha_enabled' => $data['captcha_enabled'] ?? false,
                'captcha_type' => $data['captcha_type'] ?? null,
                'captcha_secret_key' => $data['captcha_secret_key'] ?? null,
                'honeypot_field_name' => $data['honeypot_field_name'] ?? 'website',

                // Validation settings
                'validation_enabled' => $data['validation_enabled'] ?? false,
                'validation_rules' => $data['validation_rules'] ?? [],
                'required_fields' => $data['required_fields'] ?? [],

                // Response settings
                'response_type' => $data['response_type'] ?? 'json',
                'success_message' => $data['success_message'] ?? 'Form submitted successfully',
                'redirect_url' => $data['redirect_url'] ?? null,
                'custom_response_data' => $data['custom_response_data'] ?? [],

                // Field mapping
                'field_mapping' => $data['field_mapping'] ?? []
            ]);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'API configuration created successfully',
                'data' => [
                    'id' => $apiConfig->id,
                    'api_hash' => $apiConfig->api_hash,
                    'api_key' => $apiConfig->api_key,
                    'endpoint' => "/api/external/submit/{$apiConfig->api_hash}"
                ]
            ]));

            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to create API configuration'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update API configuration
     * PUT /api/user/api-configs/{id}
     */
    public function updateApiConfig(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $configId = $args['id'] ?? null;
            $data = $request->getParsedBody();

            /** @var FormApiConfig|null $apiConfig */
            $apiConfig = FormApiConfig::whereHas('form', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->find($configId);

            if (!$apiConfig) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'API configuration not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Update configuration
            $apiConfig->update([
                'api_name' => $data['api_name'] ?? $apiConfig->api_name,
                'description' => $data['description'] ?? $apiConfig->description,
                'is_active' => $data['is_active'] ?? $apiConfig->is_active,

                // CORS settings
                'cors_enabled' => $data['cors_enabled'] ?? $apiConfig->cors_enabled,
                'allowed_origins' => $data['allowed_origins'] ?? $apiConfig->allowed_origins,

                // Security settings
                'captcha_enabled' => $data['captcha_enabled'] ?? $apiConfig->captcha_enabled,
                'captcha_type' => $data['captcha_type'] ?? $apiConfig->captcha_type,
                'captcha_secret_key' => $data['captcha_secret_key'] ?? $apiConfig->captcha_secret_key,
                'honeypot_field_name' => $data['honeypot_field_name'] ?? $apiConfig->honeypot_field_name,

                // Validation settings
                'validation_enabled' => $data['validation_enabled'] ?? $apiConfig->validation_enabled,
                'validation_rules' => $data['validation_rules'] ?? $apiConfig->validation_rules,
                'required_fields' => $data['required_fields'] ?? $apiConfig->required_fields,

                // Response settings
                'response_type' => $data['response_type'] ?? $apiConfig->response_type,
                'success_message' => $data['success_message'] ?? $apiConfig->success_message,
                'redirect_url' => $data['redirect_url'] ?? $apiConfig->redirect_url,
                'custom_response_data' => $data['custom_response_data'] ?? $apiConfig->custom_response_data,

                // Field mapping
                'field_mapping' => $data['field_mapping'] ?? $apiConfig->field_mapping
            ]);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'API configuration updated successfully'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to update API configuration'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete API configuration
     * DELETE /api/user/api-configs/{id}
     */
    public function deleteApiConfig(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $configId = $args['id'] ?? null;

            $apiConfig = FormApiConfig::whereHas('form', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->find($configId);

            if (!$apiConfig) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'API configuration not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $apiConfig->delete();

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'API configuration deleted successfully'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to delete API configuration'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get API usage statistics
     * GET /api/user/api-configs/{id}/stats
     */
    public function getApiStats(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $configId = $args['id'] ?? null;

            $apiConfig = FormApiConfig::whereHas('form', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->find($configId);

            if (!$apiConfig) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'API configuration not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Get usage statistics
            $usageStats = ApiUsageLog::getUsageStats($configId, 30);

            // Get submission statistics
            $totalSubmissions = ApiSubmission::where('form_api_config_id', $configId)->count();
            $successfulSubmissions = ApiSubmission::where('form_api_config_id', $configId)
                ->where('sheet_written', true)->count();
            $spamSubmissions = ApiSubmission::where('form_api_config_id', $configId)
                ->where('is_spam', true)->count();

            $stats = [
                'total_submissions' => $totalSubmissions,
                'successful_submissions' => $successfulSubmissions,
                'spam_submissions' => $spamSubmissions,
                'success_rate' => $totalSubmissions > 0 ? round(($successfulSubmissions / $totalSubmissions) * 100, 2) : 0,
                'daily_usage' => $usageStats
            ];

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $stats
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to fetch API statistics'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Regenerate API key
     * POST /api/user/api-configs/{id}/regenerate-key
     */
    public function regenerateApiKey(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $configId = $args['id'] ?? null;

            $apiConfig = FormApiConfig::whereHas('form', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->find($configId);

            if (!$apiConfig) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'API configuration not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $newApiKey = FormApiConfig::generateApiKey();
            $apiConfig->update(['api_key' => $newApiKey]);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'API key regenerated successfully',
                'data' => [
                    'api_key' => $newApiKey
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to regenerate API key'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
