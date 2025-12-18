<?php

namespace App\Services;

use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\FormApiConfig;

class SpamProtectionService
{
    /**
     * Check if a submission is spam
     */
    public function checkSubmission(array $data, FormApiConfig $apiConfig, Request $request): array
    {
        $checks = [];

        // Honeypot field check
        $honeypotCheck = $this->checkHoneypotField($data, $apiConfig->honeypot_field_name);
        $checks[] = $honeypotCheck;

        // Basic spam patterns check
        $patternCheck = $this->checkSpamPatterns($data);
        $checks[] = $patternCheck;

        // Rate limiting by IP (basic implementation)
        $rateLimitCheck = $this->checkRateLimit($request);
        $checks[] = $rateLimitCheck;

        // Find the first spam check that failed
        foreach ($checks as $check) {
            if ($check['is_spam']) {
                return $check;
            }
        }

        return ['is_spam' => false, 'reason' => null];
    }

    /**
     * Check honeypot field (should be empty)
     */
    private function checkHoneypotField(array $data, string $honeypotFieldName): array
    {
        if (isset($data[$honeypotFieldName]) && !empty($data[$honeypotFieldName])) {
            return [
                'is_spam' => true,
                'reason' => 'Honeypot field filled'
            ];
        }

        return ['is_spam' => false, 'reason' => null];
    }

    /**
     * Check for common spam patterns
     */
    private function checkSpamPatterns(array $data): array
    {
        $spamPatterns = [
            // Common spam phrases
            '/\b(viagra|cialis|casino|poker|lottery|winner|congratulations|million dollars)\b/i',
            // Multiple URLs
            '/(https?:\/\/[^\s]+.*){3,}/',
            // Excessive caps
            '/[A-Z]{10,}/',
            // Excessive special characters
            '/[!@#$%^&*()]{5,}/',
        ];

        $allText = implode(' ', $data);

        foreach ($spamPatterns as $pattern) {
            if (preg_match($pattern, $allText)) {
                return [
                    'is_spam' => true,
                    'reason' => 'Spam pattern detected'
                ];
            }
        }

        return ['is_spam' => false, 'reason' => null];
    }

    /**
     * Basic rate limiting check (can be enhanced with Redis/database)
     */
    private function checkRateLimit(Request $request): array
    {
        // Simple in-memory rate limiting (for demo purposes)
        // In production, use Redis or database-based rate limiting

        static $requestCounts = [];

        $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
        $currentTime = time();
        $windowStart = $currentTime - 60; // 1-minute window

        // Clean old entries
        if (isset($requestCounts[$ip])) {
            $requestCounts[$ip] = array_filter(
                $requestCounts[$ip],
                function ($timestamp) use ($windowStart) {
                    return $timestamp > $windowStart;
                }
            );
        }

        // Initialize if not exists
        if (!isset($requestCounts[$ip])) {
            $requestCounts[$ip] = [];
        }

        // Check rate limit (max 10 requests per minute)
        if (count($requestCounts[$ip]) >= 10) {
            return [
                'is_spam' => true,
                'reason' => 'Rate limit exceeded'
            ];
        }

        // Add current request
        $requestCounts[$ip][] = $currentTime;

        return ['is_spam' => false, 'reason' => null];
    }
}
