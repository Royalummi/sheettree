<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\ConnectedSheet;
use App\Models\User;
use App\Models\OauthToken;
use App\Services\GoogleSheetsService;
use Google\Client as Google_Client;

class SheetController
{
    private GoogleSheetsService $sheetsService;
    private Google_Client $googleClient;

    public function __construct()
    {
        // Initialize Google Client
        $this->googleClient = new Google_Client();
        $this->googleClient->setClientId($_ENV['GOOGLE_CLIENT_ID']);
        $this->googleClient->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);
        $this->googleClient->setRedirectUri($_ENV['GOOGLE_REDIRECT_URI']);
        $this->googleClient->addScope([
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive.file'
        ]);

        // Initialize Sheets Service
        $this->sheetsService = new GoogleSheetsService($this->googleClient);
    }
    /**
     * Get all connected sheets for the authenticated user
     */
    public function getUserSheets(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            $sheets = ConnectedSheet::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

            $data = [
                'sheets' => $sheets->map(function ($sheet) {
                    return [
                        'id' => $sheet->id,
                        'spreadsheet_id' => $sheet->spreadsheet_id,
                        'spreadsheet_name' => $sheet->spreadsheet_name,
                        'sheet_name' => $sheet->sheet_name,
                        'connection_type' => $sheet->connection_type,
                        'created_at' => $sheet->created_at,
                        'updated_at' => $sheet->updated_at
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
     * Connect a new Google Sheet
     */
    public function connectSheet(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $data = $request->getParsedBody();

            // Validate required fields
            if (!isset($data['spreadsheet_id']) || empty($data['spreadsheet_id'])) {
                $response->getBody()->write(json_encode(['error' => 'Spreadsheet ID is required']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Check if user has OAuth token
            $oauthToken = OauthToken::where('user_id', $userId)->first();
            if (!$oauthToken) {
                $response->getBody()->write(json_encode(['error' => 'Google OAuth authentication required']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            // Validate spreadsheet exists and user has access using Google Sheets API
            try {
                $this->sheetsService->authenticateUser($userId);

                $sheetName = $data['sheet_name'] ?? 'Sheet1';
                $hasAccess = $this->sheetsService->testSheetAccess($data['spreadsheet_id'], $sheetName);

                if (!$hasAccess) {
                    $response->getBody()->write(json_encode([
                        'error' => 'Unable to access the specified spreadsheet. Please ensure the sheet exists and you have permission to access it.'
                    ]));
                    return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
                }

                // Get actual spreadsheet name from Google if not provided
                if (!isset($data['spreadsheet_name']) || empty($data['spreadsheet_name'])) {
                    try {
                        $sheetsServiceInstance = new \Google\Service\Sheets($this->googleClient);
                        $spreadsheet = $sheetsServiceInstance->spreadsheets->get($data['spreadsheet_id']);
                        $data['spreadsheet_name'] = $spreadsheet->getProperties()->getTitle();
                    } catch (\Exception $e) {
                        $data['spreadsheet_name'] = 'Unnamed Spreadsheet';
                    }
                }
            } catch (\Exception $e) {
                $response->getBody()->write(json_encode([
                    'error' => 'Failed to validate Google Sheet: ' . $e->getMessage()
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $sheet = ConnectedSheet::create([
                'user_id' => $userId,
                'spreadsheet_id' => $data['spreadsheet_id'],
                'spreadsheet_name' => $data['spreadsheet_name'] ?? 'Unnamed Spreadsheet',
                'sheet_name' => $data['sheet_name'] ?? 'Sheet1',
                'connection_type' => $data['connection_type'] ?? 'private',
                'created_at' => new \DateTime(),
                'updated_at' => new \DateTime()
            ]);

            $response->getBody()->write(json_encode([
                'message' => 'Sheet connected successfully',
                'sheet' => $sheet
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get a specific connected sheet
     */
    public function getSheet(Request $request, Response $response, array $args): Response
    {
        try {
            $sheetId = $args['id'];
            $userId = $request->getAttribute('user_id');

            /** @var ConnectedSheet|null $sheet */
            $sheet = ConnectedSheet::where('id', $sheetId)
                ->where('user_id', $userId)
                ->first();

            if (!$sheet) {
                $response->getBody()->write(json_encode(['error' => 'Sheet not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // TODO: Get actual sheet data from Google Sheets API
            $data = [
                'sheet' => [
                    'id' => $sheet->id,
                    'spreadsheet_id' => $sheet->spreadsheet_id,
                    'spreadsheet_name' => $sheet->spreadsheet_name,
                    'sheet_name' => $sheet->sheet_name,
                    'connection_type' => $sheet->connection_type,
                    'created_at' => $sheet->created_at,
                    'updated_at' => $sheet->updated_at,
                    'google_sheets_url' => "https://docs.google.com/spreadsheets/d/{$sheet->spreadsheet_id}/edit"
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
     * Update connected sheet settings
     */
    public function updateSheet(Request $request, Response $response, array $args): Response
    {
        try {
            $sheetId = $args['id'];
            $userId = $request->getAttribute('user_id');
            $data = $request->getParsedBody();

            $sheet = ConnectedSheet::where('id', $sheetId)
                ->where('user_id', $userId)
                ->first();

            if (!$sheet) {
                $response->getBody()->write(json_encode(['error' => 'Sheet not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Update allowed fields
            $allowedFields = ['spreadsheet_name', 'sheet_name', 'connection_type'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $sheet->$field = $data[$field];
                }
            }

            $sheet->updated_at = new \DateTime();
            $sheet->save();

            $response->getBody()->write(json_encode([
                'message' => 'Sheet updated successfully',
                'sheet' => $sheet
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Disconnect a sheet
     */
    public function disconnectSheet(Request $request, Response $response, array $args): Response
    {
        try {
            $sheetId = $args['id'];
            $userId = $request->getAttribute('user_id');

            $sheet = ConnectedSheet::where('id', $sheetId)
                ->where('user_id', $userId)
                ->first();

            if (!$sheet) {
                $response->getBody()->write(json_encode(['error' => 'Sheet not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $sheet->delete();

            $response->getBody()->write(json_encode(['message' => 'Sheet disconnected successfully']));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get sheet data from Google Sheets
     */
    public function getSheetData(Request $request, Response $response, array $args): Response
    {
        try {
            $sheetId = $args['id'];
            $userId = $request->getAttribute('user_id');

            $sheet = ConnectedSheet::where('id', $sheetId)
                ->where('user_id', $userId)
                ->first();

            if (!$sheet) {
                $response->getBody()->write(json_encode(['error' => 'Sheet not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check if user has OAuth token
            $oauthToken = OauthToken::where('user_id', $userId)->first();
            if (!$oauthToken) {
                $response->getBody()->write(json_encode(['error' => 'Google OAuth authentication required']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            // Fetch actual data from Google Sheets API
            try {
                $this->sheetsService->authenticateUser($userId);

                // Get headers
                $headers = $this->sheetsService->getSheetHeaders($sheet->spreadsheet_id, $sheet->sheet_name);

                // Get first 10 rows of data for preview
                $sheetsServiceInstance = new \Google\Service\Sheets($this->googleClient);
                $range = $sheet->sheet_name . '!A2:Z11'; // Get rows 2-11 (skipping header)
                $response_data = $sheetsServiceInstance->spreadsheets_values->get($sheet->spreadsheet_id, $range);
                $rows = $response_data->getValues() ?? [];

                $data = [
                    'sheet_info' => [
                        'id' => $sheet->id,
                        'spreadsheet_id' => $sheet->spreadsheet_id,
                        'spreadsheet_name' => $sheet->spreadsheet_name,
                        'sheet_name' => $sheet->sheet_name
                    ],
                    'data' => [
                        'headers' => $headers,
                        'rows' => $rows,
                        'total_rows' => count($rows)
                    ]
                ];

                $response->getBody()->write(json_encode($data));
                return $response->withHeader('Content-Type', 'application/json');
            } catch (\Exception $e) {
                $response->getBody()->write(json_encode([
                    'error' => 'Failed to fetch sheet data: ' . $e->getMessage()
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Connect a sheet using Google Picker API (selected from user's Google Drive)
     */
    public function connectSheetFromPicker(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $data = $request->getParsedBody();

            // Validate required fields from Google Picker
            if (!isset($data['spreadsheet_id']) || empty($data['spreadsheet_id'])) {
                $response->getBody()->write(json_encode(['error' => 'Spreadsheet ID is required']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Check if user has OAuth token
            $oauthToken = OauthToken::where('user_id', $userId)->first();
            if (!$oauthToken) {
                $response->getBody()->write(json_encode(['error' => 'Google OAuth authentication required']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            // Validate and fetch spreadsheet details from Google
            try {
                $this->sheetsService->authenticateUser($userId);

                // Get spreadsheet metadata from Google Sheets API
                $sheetsServiceInstance = new \Google\Service\Sheets($this->googleClient);
                $spreadsheet = $sheetsServiceInstance->spreadsheets->get($data['spreadsheet_id']);

                $spreadsheetName = $spreadsheet->getProperties()->getTitle();
                $sheets = $spreadsheet->getSheets();

                // Use the first sheet if no specific sheet name provided
                $sheetName = $data['sheet_name'] ?? ($sheets[0]->getProperties()->getTitle() ?? 'Sheet1');

                // Test access to the sheet
                $hasAccess = $this->sheetsService->testSheetAccess($data['spreadsheet_id'], $sheetName);

                if (!$hasAccess) {
                    $response->getBody()->write(json_encode([
                        'error' => 'Unable to access the specified sheet within the spreadsheet.'
                    ]));
                    return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
                }

                // Check if sheet is already connected
                $existingSheet = ConnectedSheet::where('user_id', $userId)
                    ->where('spreadsheet_id', $data['spreadsheet_id'])
                    ->where('sheet_name', $sheetName)
                    ->first();

                if ($existingSheet) {
                    $response->getBody()->write(json_encode([
                        'error' => 'This sheet is already connected',
                        'sheet' => $existingSheet
                    ]));
                    return $response->withStatus(409)->withHeader('Content-Type', 'application/json');
                }

                // Create the connection
                $sheet = ConnectedSheet::create([
                    'user_id' => $userId,
                    'spreadsheet_id' => $data['spreadsheet_id'],
                    'spreadsheet_name' => $spreadsheetName,
                    'sheet_name' => $sheetName,
                    'connection_type' => 'picker',
                    'created_at' => new \DateTime(),
                    'updated_at' => new \DateTime()
                ]);

                $response->getBody()->write(json_encode([
                    'message' => 'Sheet connected successfully from Google Picker',
                    'sheet' => [
                        'id' => $sheet->id,
                        'spreadsheet_id' => $sheet->spreadsheet_id,
                        'spreadsheet_name' => $sheet->spreadsheet_name,
                        'sheet_name' => $sheet->sheet_name,
                        'connection_type' => $sheet->connection_type,
                        'google_sheets_url' => "https://docs.google.com/spreadsheets/d/{$sheet->spreadsheet_id}/edit",
                        'created_at' => $sheet->created_at
                    ]
                ]));
                return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
            } catch (\Exception $e) {
                $response->getBody()->write(json_encode([
                    'error' => 'Failed to connect sheet from Google Picker: ' . $e->getMessage()
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Preview sheet data (first few rows with headers)
     */
    public function previewSheet(Request $request, Response $response, array $args): Response
    {
        try {
            $sheetId = $args['id'];
            $userId = $request->getAttribute('user_id');

            $sheet = ConnectedSheet::where('id', $sheetId)
                ->where('user_id', $userId)
                ->first();

            if (!$sheet) {
                $response->getBody()->write(json_encode(['error' => 'Sheet not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check if user has OAuth token
            $oauthToken = OauthToken::where('user_id', $userId)->first();
            if (!$oauthToken) {
                $response->getBody()->write(json_encode(['error' => 'Google OAuth authentication required']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            // Fetch preview data from Google Sheets
            try {
                $this->sheetsService->authenticateUser($userId);

                // Get headers
                $headers = $this->sheetsService->getSheetHeaders($sheet->spreadsheet_id, $sheet->sheet_name);

                // Get first 5 rows for preview
                $sheetsServiceInstance = new \Google\Service\Sheets($this->googleClient);
                $range = $sheet->sheet_name . '!A2:Z6'; // Get rows 2-6 (skipping header)
                $response_data = $sheetsServiceInstance->spreadsheets_values->get($sheet->spreadsheet_id, $range);
                $rows = $response_data->getValues() ?? [];

                $data = [
                    'sheet' => [
                        'id' => $sheet->id,
                        'spreadsheet_id' => $sheet->spreadsheet_id,
                        'spreadsheet_name' => $sheet->spreadsheet_name,
                        'sheet_name' => $sheet->sheet_name,
                        'google_sheets_url' => "https://docs.google.com/spreadsheets/d/{$sheet->spreadsheet_id}/edit"
                    ],
                    'preview' => [
                        'headers' => $headers,
                        'sample_rows' => $rows,
                        'row_count' => count($rows)
                    ],
                    'message' => 'Preview shows first 5 rows of data'
                ];

                $response->getBody()->write(json_encode($data));
                return $response->withHeader('Content-Type', 'application/json');
            } catch (\Exception $e) {
                $response->getBody()->write(json_encode([
                    'error' => 'Failed to preview sheet: ' . $e->getMessage()
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
