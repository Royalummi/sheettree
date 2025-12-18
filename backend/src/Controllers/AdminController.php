<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\User;
use App\Models\ConnectedSheet;
use App\Models\Form;
use App\Models\FormSubmission;

class AdminController
{
    /**
     * Get all users
     */
    public function getAllUsers(Request $request, Response $response): Response
    {
        try {
            $users = User::with(['connectedSheets', 'forms'])->get();

            $data = [
                'users' => $users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'is_admin' => $user->is_admin,
                        'created_at' => $user->created_at,
                        'last_login' => $user->last_login,
                        'sheets_count' => $user->connectedSheets->count(),
                        'forms_count' => $user->forms->count()
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
     * Get specific user by ID
     */
    public function getUser(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['id'];
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
                    'google_id' => $user->google_id,
                    'is_admin' => $user->is_admin,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                    'last_login' => $user->last_login,
                    'sheets' => $user->connectedSheets,
                    'forms' => $user->forms,
                    'has_oauth_token' => $user->oauthTokens->isNotEmpty()
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
     * Update user information
     */
    public function updateUser(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['id'];
            $data = $request->getParsedBody();

            $user = User::find($userId);
            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Update allowed fields
            $allowedFields = ['name', 'email', 'is_admin'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $user->$field = $data[$field];
                }
            }

            $user->updated_at = new \DateTime();
            $user->save();

            $response->getBody()->write(json_encode([
                'message' => 'User updated successfully',
                'user' => $user
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete user
     */
    public function deleteUser(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $args['id'];
            $user = User::find($userId);

            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Don't allow deletion of admin users
            if ($user->is_admin) {
                $response->getBody()->write(json_encode(['error' => 'Cannot delete admin users']));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            $user->delete();

            $response->getBody()->write(json_encode(['message' => 'User deleted successfully']));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get all sheets across all users
     */
    public function getAllSheets(Request $request, Response $response): Response
    {
        try {
            $sheets = ConnectedSheet::with(['user'])->get();

            $data = [
                'sheets' => $sheets->map(function ($sheet) {
                    return [
                        'id' => $sheet->id,
                        'title' => $sheet->spreadsheet_name,
                        'spreadsheet_id' => $sheet->spreadsheet_id,
                        'sheet_name' => $sheet->sheet_name,
                        'connection_type' => $sheet->connection_type,
                        'created_at' => $sheet->created_at,
                        'updated_at' => $sheet->updated_at,
                        'user' => [
                            'id' => $sheet->user->id,
                            'name' => $sheet->user->name,
                            'email' => $sheet->user->email
                        ]
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
     * Get all forms across all users
     */
    public function getAllForms(Request $request, Response $response): Response
    {
        try {
            $forms = Form::with(['user', 'connectedSheet'])->get();

            $data = [
                'forms' => $forms->map(function ($form) {
                    return [
                        'id' => $form->id,
                        'title' => $form->title,
                        'description' => $form->description,
                        'is_active' => $form->is_active,
                        'is_public' => $form->is_public,
                        'created_at' => $form->created_at,
                        'updated_at' => $form->updated_at,
                        'user' => [
                            'id' => $form->user->id,
                            'name' => $form->user->name,
                            'email' => $form->user->email
                        ],
                        'sheet' => $form->connectedSheet ? [
                            'id' => $form->connectedSheet->id,
                            'title' => $form->connectedSheet->spreadsheet_name,
                            'spreadsheet_id' => $form->connectedSheet->spreadsheet_id
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
     * Get analytics and statistics
     */
    public function getAnalytics(Request $request, Response $response): Response
    {
        try {
            $analytics = [
                'users' => [
                    'total' => User::count(),
                    'admins' => User::where('is_admin', true)->count(),
                    'regular' => User::where('is_admin', false)->count(),
                    'with_oauth' => User::whereHas('oauthTokens')->count()
                ],
                'sheets' => [
                    'total' => ConnectedSheet::count(),
                    'public' => ConnectedSheet::where('connection_type', 'public')->count(),
                    'private' => ConnectedSheet::where('connection_type', 'private')->count()
                ],
                'forms' => [
                    'total' => Form::count(),
                    'active' => Form::where('is_active', true)->count(),
                    'public' => Form::where('is_public', true)->count(),
                    'submissions' => FormSubmission::count()
                ],
                'recent_activity' => [
                    'recent_users' => User::orderBy('created_at', 'desc')->limit(5)->get(['id', 'name', 'email', 'created_at']),
                    'recent_sheets' => ConnectedSheet::with('user')->orderBy('created_at', 'desc')->limit(5)->get(),
                    'recent_forms' => Form::with('user')->orderBy('created_at', 'desc')->limit(5)->get()
                ]
            ];

            $response->getBody()->write(json_encode($analytics));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
