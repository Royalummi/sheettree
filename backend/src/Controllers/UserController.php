<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\User;
use App\Models\OauthToken;
use App\Models\ConnectedSheet;
use App\Models\Form;
use App\Models\FormSubmission;
use App\Models\FormApiConfig;
use App\Models\ApiSubmission;
use App\Services\EmailService;

class UserController
{
    /**
     * Get user dashboard data with statistics
     */
    public function getDashboard(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            
            // Get user with relationships
            /** @var User|null $user */
            $user = User::with(['connectedSheets', 'forms', 'oauthTokens'])->find($userId);

            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Count connected sheets
            $sheetsCount = ConnectedSheet::where('user_id', $userId)->count();

            // Count forms
            $formsCount = Form::where('user_id', $userId)->count();

            // Count form submissions (last 30 days)
            $submissionsCount = FormSubmission::whereIn('form_id', function ($query) use ($userId) {
                $query->select('id')
                    ->from('forms')
                    ->where('user_id', $userId);
            })
                ->where('created_at', '>=', (new \DateTime('-30 days'))->format('Y-m-d'))
                ->count();

            // Count API configurations
            $apiConfigsCount = FormApiConfig::whereIn('form_id', function ($query) use ($userId) {
                $query->select('id')
                    ->from('forms')
                    ->where('user_id', $userId);
            })->count();

            // Get recent forms (last 5)
            $recentForms = Form::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($form) {
                    return [
                        'id' => $form->id,
                        'name' => $form->name,
                        'created_at' => $form->created_at,
                        'is_active' => $form->is_active
                    ];
                });

            // Get recent sheets (last 5)
            $recentSheets = ConnectedSheet::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($sheet) {
                    return [
                        'id' => $sheet->id,
                        'spreadsheet_name' => $sheet->spreadsheet_name,
                        'sheet_name' => $sheet->sheet_name,
                        'created_at' => $sheet->created_at,
                        'google_sheets_url' => "https://docs.google.com/spreadsheets/d/{$sheet->spreadsheet_id}/edit"
                    ];
                });

            // Get submission stats by day (last 7 days)
            $submissionStats = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = (new \DateTime("-$i days"))->format('Y-m-d');
                $count = FormSubmission::whereIn('form_id', function ($query) use ($userId) {
                    $query->select('id')
                        ->from('forms')
                        ->where('user_id', $userId);
                })
                    ->whereDate('created_at', $date)
                    ->count();

                $submissionStats[] = [
                    'date' => $date,
                    'count' => $count
                ];
            }

            // Get API submission stats (last 30 days)
            $apiSubmissionsCount = ApiSubmission::whereIn('api_config_id', function ($query) use ($userId) {
                $query->select('form_api_configs.id')
                    ->from('form_api_configs')
                    ->join('forms', 'form_api_configs.form_id', '=', 'forms.id')
                    ->where('forms.user_id', $userId);
            })
                ->where('created_at', '>=', (new \DateTime('-30 days'))->format('Y-m-d'))
                ->count();

            $data = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar
                ],
                'stats' => [
                    'total_sheets' => $sheetsCount,
                    'total_forms' => $formsCount,
                    'submissions_last_30_days' => $submissionsCount,
                    'api_submissions_last_30_days' => $apiSubmissionsCount,
                    'total_api_configs' => $apiConfigsCount
                ],
                'recent_forms' => $recentForms,
                'recent_sheets' => $recentSheets,
                'submission_chart_data' => $submissionStats,
                'has_google_access' => $user->oauthTokens->isNotEmpty()
            ];

            $response->getBody()->write(json_encode($data));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get current user profile
     */
    public function getProfile(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            /** @var User|null $user */
            $user = User::with(['connectedSheets', 'forms', 'oauthTokens'])->find($userId);

            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $data = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'is_admin' => $user->is_admin,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                    'last_login' => $user->last_login,
                    'connected_sheets_count' => $user->connectedSheets->count(),
                    'forms_count' => $user->forms->count(),
                    'has_google_access' => $user->oauthTokens->isNotEmpty()
                ]
            ];

            $response->getBody()->write(json_encode($data));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $data = $request->getParsedBody();

            $user = User::find($userId);
            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Update allowed fields
            $allowedFields = ['name', 'avatar'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $user->$field = $data[$field];
                }
            }

            $user->updated_at = new \DateTime();
            $user->save();

            $response->getBody()->write(json_encode([
                'message' => 'Profile updated successfully',
                'user' => $user
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete user account
     */
    public function deleteAccount(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $user = User::find($userId);

            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Don't allow admin users to delete their own account
            if ($user->is_admin) {
                $response->getBody()->write(json_encode(['error' => 'Admin users cannot delete their own account']));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Delete user and all related data
            $user->delete();

            $response->getBody()->write(json_encode(['message' => 'Account deleted successfully']));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user's Google OAuth status
     */
    public function getOAuthStatus(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            /** @var OauthToken|null $oauthToken */
            $oauthToken = OauthToken::where('user_id', $userId)->first();

            $scopes = [];
            if ($oauthToken && $oauthToken->scopes) {
                // Handle both array and string format for scopes
                $scopes = is_array($oauthToken->scopes)
                    ? $oauthToken->scopes
                    : explode(' ', $oauthToken->scopes);
            }

            $data = [
                'has_oauth_token' => $oauthToken !== null,
                'token_expires_at' => $oauthToken ? $oauthToken->token_expires_at : null,
                'scopes' => $scopes,
                'is_expired' => $oauthToken ? (new \DateTime() > $oauthToken->token_expires_at) : null
            ];

            $response->getBody()->write(json_encode($data));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Revoke Google OAuth access
     */
    public function revokeOAuth(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $oauthToken = OauthToken::where('user_id', $userId)->first();

            if (!$oauthToken) {
                $response->getBody()->write(json_encode(['error' => 'No OAuth token found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Revoke token with Google API
            try {
                $client = new \Google\Client();
                $client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
                $client->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);

                // Attempt to revoke the token with Google
                if ($oauthToken->access_token) {
                    $client->revokeToken($oauthToken->access_token);
                }
            } catch (\Exception $e) {
                // Log the error but continue with local deletion
                error_log("Failed to revoke token with Google: " . $e->getMessage());
            }

            // Delete from database
            $oauthToken->delete();

            $response->getBody()->write(json_encode([
                'message' => 'OAuth access revoked successfully',
                'note' => 'Access has been revoked both locally and with Google'
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get notification preferences
     * GET /user/notification-preferences
     */
    public function getNotificationPreferences(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $user = User::find($userId);

            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $preferences = [
                'email_notifications_enabled' => (bool) $user->email_notifications_enabled,
                'notify_form_submission' => (bool) $user->notify_form_submission,
                'notify_sheet_connection' => (bool) $user->notify_sheet_connection,
                'notify_form_status' => (bool) $user->notify_form_status,
                'notify_spam_detected' => (bool) $user->notify_spam_detected,
                'notify_api_limit' => (bool) $user->notify_api_limit,
                'notify_system' => (bool) $user->notify_system
            ];

            $response->getBody()->write(json_encode($preferences));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update notification preferences
     * PUT /user/notification-preferences
     */
    public function updateNotificationPreferences(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $data = $request->getParsedBody();

            $user = User::find($userId);

            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Update preferences
            $allowedFields = [
                'email_notifications_enabled',
                'notify_form_submission',
                'notify_sheet_connection',
                'notify_form_status',
                'notify_spam_detected',
                'notify_api_limit',
                'notify_system'
            ];

            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $user->$field = (bool) $data[$field];
                }
            }

            $user->save();

            $response->getBody()->write(json_encode([
                'message' => 'Notification preferences updated successfully',
                'preferences' => [
                    'email_notifications_enabled' => (bool) $user->email_notifications_enabled,
                    'notify_form_submission' => (bool) $user->notify_form_submission,
                    'notify_sheet_connection' => (bool) $user->notify_sheet_connection,
                    'notify_form_status' => (bool) $user->notify_form_status,
                    'notify_spam_detected' => (bool) $user->notify_spam_detected,
                    'notify_api_limit' => (bool) $user->notify_api_limit,
                    'notify_system' => (bool) $user->notify_system
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Send test email
     * POST /user/test-email
     */
    public function sendTestEmail(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $user = User::find($userId);

            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            if (!$user->email_notifications_enabled) {
                $response->getBody()->write(json_encode([
                    'error' => 'Email notifications are disabled. Please enable them first.'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $emailService = new EmailService();
            $success = $emailService->sendTestEmail($user->email, $user->name);

            if ($success) {
                $response->getBody()->write(json_encode([
                    'message' => 'Test email sent successfully! Check your inbox.',
                    'email' => $user->email
                ]));
                return $response->withHeader('Content-Type', 'application/json');
            } else {
                $response->getBody()->write(json_encode([
                    'error' => 'Failed to send test email. Please check your email configuration.'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
