<?php

namespace App\Services;

use Google\Client as Google_Client;
use Google\Service\Sheets as Google_Service_Sheets;
use App\Models\User;
use App\Models\OauthToken;
use App\Models\ConnectedSheet;

class GoogleSheetsService
{
    private Google_Client $client;
    private Google_Service_Sheets $sheetsService;

    public function __construct(Google_Client $client)
    {
        $this->client = $client;
        $this->sheetsService = new Google_Service_Sheets($this->client);
    }

    /**
     * Authenticate using user's stored OAuth token
     */
    public function authenticateUser($userId): bool
    {
        $oauthToken = OauthToken::where('user_id', $userId)->first();

        if (!$oauthToken) {
            throw new \Exception('No OAuth token found for user');
        }

        // Check if token is expired and needs refresh
        if ($oauthToken->isExpired()) {
            return $this->refreshAndSetToken($oauthToken);
        } else {
            return $this->setValidToken($oauthToken);
        }
    }

    /**
     * Set a valid (non-expired) token
     */
    private function setValidToken($oauthToken): bool
    {
        $this->client->setAccessToken([
            'access_token' => $oauthToken->access_token,
            'refresh_token' => $oauthToken->refresh_token,
            'expires_in' => 3600
        ]);

        return true;
    }

    /**
     * Refresh an expired token and set it
     */
    private function refreshAndSetToken($oauthToken): bool
    {
        try {
            // Set the expired token first
            $this->client->setAccessToken([
                'access_token' => $oauthToken->access_token,
                'refresh_token' => $oauthToken->refresh_token,
                'expires_in' => 3600
            ]);

            // Check if it's really expired and refresh if needed
            if ($this->client->isAccessTokenExpired()) {
                $newToken = $this->client->fetchAccessTokenWithRefreshToken($oauthToken->refresh_token);

                if (isset($newToken['error'])) {
                    throw new \Exception('Failed to refresh access token: ' . $newToken['error']);
                }

                // Update stored token
                $oauthToken->access_token = $newToken['access_token'];
                $oauthToken->token_expires_at = isset($newToken['expires_in']) ?
                    (new \DateTime())->add(new \DateInterval('PT' . $newToken['expires_in'] . 'S')) : null;

                // Update refresh token if provided
                if (isset($newToken['refresh_token'])) {
                    $oauthToken->refresh_token = $newToken['refresh_token'];
                }

                $oauthToken->save();

                // Set the new token
                $this->client->setAccessToken($newToken);
            }

            return true;
        } catch (\Exception $e) {
            throw new \Exception('Token refresh failed: ' . $e->getMessage());
        }
    }

    /**
     * Test if we can access a specific sheet
     */
    public function testSheetAccess($spreadsheetId, $sheetName): bool
    {
        try {
            $range = $sheetName . '!A1:Z1'; // Test read access to first row
            $this->sheetsService->spreadsheets_values->get($spreadsheetId, $range);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get the headers from the first row of the sheet
     */
    public function getSheetHeaders($spreadsheetId, $sheetName): array
    {
        try {
            $range = $sheetName . '!1:1'; // Get first row
            $response = $this->sheetsService->spreadsheets_values->get($spreadsheetId, $range);
            $values = $response->getValues();

            if (empty($values) || empty($values[0])) {
                return [];
            }

            return $values[0];
        } catch (\Exception $e) {
            throw new \Exception('Failed to read sheet headers: ' . $e->getMessage());
        }
    }

    /**
     * Append a new row to the sheet
     */
    public function appendRowToSheet($spreadsheetId, $sheetName, array $rowData): bool
    {
        try {
            // Debug: Log received row data
            error_log("GoogleSheetsService - received rowData: " . json_encode($rowData));

            // Get current headers to map the data correctly
            $headers = $this->getSheetHeaders($spreadsheetId, $sheetName);
            error_log("GoogleSheetsService - existing headers: " . json_encode($headers));

            // If no headers exist, create them first
            if (empty($headers)) {
                $headers = array_keys($rowData);
                $this->appendRowToSheet($spreadsheetId, $sheetName, $headers);
            }

            // Map form data to sheet columns and handle timestamp properly
            $orderedData = [];
            $timestamp = (new \DateTime())->format('Y-m-d H:i:s');

            foreach ($headers as $header) {
                if ($header === 'Submitted At') {
                    // Use timestamp for "Submitted At" column
                    $orderedData[] = $timestamp;
                } else {
                    // Use form data for other columns
                    $orderedData[] = $rowData[$header] ?? '';
                }
            }

            // Debug: Log ordered data
            error_log("GoogleSheetsService - orderedData: " . json_encode($orderedData));

            $range = $sheetName . '!A:Z';
            $values = [$orderedData];

            $body = new \Google\Service\Sheets\ValueRange([
                'values' => $values
            ]);

            $params = [
                'valueInputOption' => 'USER_ENTERED',
                'insertDataOption' => 'INSERT_ROWS'
            ];

            $this->sheetsService->spreadsheets_values->append(
                $spreadsheetId,
                $range,
                $body,
                $params
            );

            return true;
        } catch (\Exception $e) {
            throw new \Exception('Failed to append row to sheet: ' . $e->getMessage());
        }
    }

    /**
     * Create headers if sheet is empty
     */
    public function createHeaders($spreadsheetId, $sheetName, array $fieldNames): bool
    {
        try {
            // Add timestamp column
            $headers = array_merge($fieldNames, ['Submitted At']);

            $range = $sheetName . '!1:1';
            $values = [$headers];

            $body = new \Google\Service\Sheets\ValueRange([
                'values' => $values
            ]);

            $params = [
                'valueInputOption' => 'USER_ENTERED'
            ];

            $this->sheetsService->spreadsheets_values->update(
                $spreadsheetId,
                $range,
                $body,
                $params
            );

            return true;
        } catch (\Exception $e) {
            throw new \Exception('Failed to create headers: ' . $e->getMessage());
        }
    }

    /**
     * Append data to sheet with smart field mapping
     * Used by external API
     */
    public function appendToSheet($spreadsheetId, $sheetName, array $data, $userId): bool
    {
        // Authenticate user
        $this->authenticateUser($userId);

        // Get existing headers
        $existingHeaders = $this->getSheetHeaders($spreadsheetId, $sheetName);

        // Apply smart field mapping to map incoming data to existing columns
        $mappingResult = $this->smartFieldMapping($data, $existingHeaders);
        $mappedData = $mappingResult['mappedData'];
        $mappedOriginalFields = $mappingResult['mappedOriginalFields'];

        // Check if we need to add new columns for unmapped fields
        $unmappedFields = array_diff(array_keys($data), $mappedOriginalFields);

        if (!empty($unmappedFields)) {
            if (empty($existingHeaders)) {
                // No headers exist, create them with original field names
                $allHeaders = array_merge(array_keys($mappedData), $unmappedFields);
                $this->createHeaders($spreadsheetId, $sheetName, $allHeaders);
                $existingHeaders = $allHeaders;
            } else {
                // Append new headers for unmapped fields
                $this->appendNewHeaders($spreadsheetId, $sheetName, $unmappedFields);
                $existingHeaders = array_merge($existingHeaders, $unmappedFields);
            }

            // Add unmapped fields to mapped data
            foreach ($unmappedFields as $field) {
                $mappedData[$field] = $data[$field];
            }
        }

        // Map data to correct column order based on existing headers
        $orderedData = [];
        foreach ($existingHeaders as $header) {
            $orderedData[] = $mappedData[$header] ?? '';
        }

        // Handle timestamp column with smart mapping
        $timestampMapped = false;
        foreach ($existingHeaders as $header) {
            if ($this->isTimestampColumn($header)) {
                // Find the index of timestamp column and update it
                $timestampIndex = array_search($header, $existingHeaders);
                if ($timestampIndex !== false) {
                    $orderedData[$timestampIndex] = (new \DateTime())->format('Y-m-d H:i:s');
                    $timestampMapped = true;
                }
                break;
            }
        }

        // Add timestamp column if not already present and not mapped
        if (!$timestampMapped && !in_array('Submitted At', $existingHeaders)) {
            $existingHeaders[] = 'Submitted At';
            $orderedData[] = (new \DateTime())->format('Y-m-d H:i:s');
        }

        // Append the row
        return $this->appendRowToSheet($spreadsheetId, $sheetName, array_combine($existingHeaders, $orderedData));
    }

    /**
     * Append new headers to existing sheet
     */
    private function appendNewHeaders($spreadsheetId, $sheetName, array $newHeaders): bool
    {
        try {
            // Get the last column with data in the first row
            $existingHeaders = $this->getSheetHeaders($spreadsheetId, $sheetName);
            $lastColumn = count($existingHeaders);

            // Convert to A1 notation
            $startColumn = $this->numberToColumnLetter($lastColumn + 1);
            $endColumn = $this->numberToColumnLetter($lastColumn + count($newHeaders));

            $range = "{$sheetName}!{$startColumn}1:{$endColumn}1";

            $body = new \Google\Service\Sheets\ValueRange([
                'values' => [$newHeaders]
            ]);

            $params = [
                'valueInputOption' => 'RAW'
            ];

            $this->sheetsService->spreadsheets_values->update(
                $spreadsheetId,
                $range,
                $body,
                $params
            );

            return true;
        } catch (\Exception $e) {
            throw new \Exception('Failed to append new headers: ' . $e->getMessage());
        }
    }

    /**
     * Convert column number to letter (1 = A, 2 = B, etc.)
     */
    private function numberToColumnLetter($number): string
    {
        $letter = '';
        while ($number > 0) {
            $number--;
            $letter = chr(ord('A') + ($number % 26)) . $letter;
            $number = intval($number / 26);
        }
        return $letter;
    }

    /**
     * Smart field mapping: Maps incoming API fields to existing Google Sheet columns
     * Implements 3-tier matching: exact match, smart matching, case-insensitive matching
     * Returns both mapped data and list of original fields that were successfully mapped
     */
    private function smartFieldMapping(array $data, array $existingHeaders): array
    {
        $mappedData = [];
        $usedHeaders = [];
        $mappedOriginalFields = []; // Track which original field names were mapped

        // Tier 1: Exact match
        foreach ($data as $field => $value) {
            if (in_array($field, $existingHeaders)) {
                $mappedData[$field] = $value;
                $usedHeaders[] = $field;
                $mappedOriginalFields[] = $field;
            }
        }

        // Remove already mapped fields from data for next tiers
        $remainingData = [];
        foreach ($data as $field => $value) {
            if (!in_array($field, $mappedOriginalFields)) {
                $remainingData[$field] = $value;
            }
        }

        // Tier 2: Smart matching (common field name patterns)
        $smartMappings = [
            'name' => ['Full Name', 'Name', 'Customer Name', 'User Name'],
            'customer_name' => ['Full Name', 'Name', 'Customer Name', 'User Name'],
            'user_name' => ['Full Name', 'Name', 'Customer Name', 'User Name'],
            'fullname' => ['Full Name', 'Name', 'Customer Name', 'User Name'],
            'phone' => ['Phone Number', 'Phone', 'Contact Number', 'Mobile'],
            'contact_number' => ['Phone Number', 'Phone', 'Contact Number', 'Mobile'],
            'phone_number' => ['Phone Number', 'Phone', 'Contact Number', 'Mobile'],
            'mobile' => ['Phone Number', 'Phone', 'Contact Number', 'Mobile'],
            'email' => ['Email Address', 'Email', 'E-mail'],
            'email_address' => ['Email Address', 'Email', 'E-mail'],
            'message' => ['Message', 'Comment', 'Description', 'Note'],
            'comment' => ['Message', 'Comment', 'Description', 'Note'],
            'comments' => ['Message', 'Comment', 'Description', 'Note'],
            'notes' => ['Message', 'Comment', 'Description', 'Note'],
            'note' => ['Message', 'Comment', 'Description', 'Note'],
            'description' => ['Message', 'Comment', 'Description', 'Note'],
            'subject' => ['Subject', 'Title', 'Topic'],
            'company' => ['Company', 'Organization', 'Business Name'],
            'address' => ['Address', 'Location', 'Street Address'],
            'city' => ['City', 'Town', 'Municipality'],
            'state' => ['State', 'Province', 'Region'],
            'zip' => ['ZIP Code', 'Postal Code', 'ZIP'],
            'country' => ['Country', 'Nation'],
            'website' => ['Website', 'URL', 'Web Address'],
        ];

        $stillRemaining = $remainingData;
        foreach ($remainingData as $field => $value) {
            $fieldLower = strtolower($field);
            if (isset($smartMappings[$fieldLower])) {
                foreach ($smartMappings[$fieldLower] as $possibleHeader) {
                    if (in_array($possibleHeader, $existingHeaders) && !in_array($possibleHeader, $usedHeaders)) {
                        $mappedData[$possibleHeader] = $value;
                        $usedHeaders[] = $possibleHeader;
                        $mappedOriginalFields[] = $field;
                        unset($stillRemaining[$field]);
                        break;
                    }
                }
            }
        }

        // Tier 3: Case-insensitive matching
        foreach ($stillRemaining as $field => $value) {
            foreach ($existingHeaders as $header) {
                if (
                    !in_array($header, $usedHeaders) &&
                    strtolower($field) === strtolower($header)
                ) {
                    $mappedData[$header] = $value;
                    $usedHeaders[] = $header;
                    $mappedOriginalFields[] = $field;
                    break;
                }
            }
        }

        return [
            'mappedData' => $mappedData,
            'mappedOriginalFields' => $mappedOriginalFields
        ];
    }

    /**
     * Check if a column header represents a timestamp field
     */
    private function isTimestampColumn(string $header): bool
    {
        $timestampPatterns = [
            'submitted at',
            'timestamp',
            'created at',
            'date submitted',
            'submission time',
            'date',
            'time',
            'datetime',
            'created',
            'submitted',
            'entry time',
            'form submitted'
        ];

        $headerLower = strtolower($header);
        foreach ($timestampPatterns as $pattern) {
            if (strpos($headerLower, $pattern) !== false) {
                return true;
            }
        }

        return false;
    }
}
