<?php

namespace App\Security;

/**
 * CAPTCHA Validation Service
 * Supports Google reCAPTCHA v2 and v3
 */
class CaptchaValidator
{
    private string $secretKey;
    private string $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    private float $minimumScore = 0.5; // For reCAPTCHA v3

    public function __construct(?string $secretKey = null)
    {
        $this->secretKey = $secretKey ?? $_ENV['RECAPTCHA_SECRET_KEY'] ?? '';
    }

    /**
     * Verify reCAPTCHA v2 response
     */
    public function verifyV2(string $response, ?string $remoteIp = null): bool
    {
        if (empty($this->secretKey)) {
            // If no secret key configured, skip validation in development
            if (($_ENV['APP_ENV'] ?? 'production') === 'development') {
                return true;
            }
            return false;
        }

        $data = [
            'secret' => $this->secretKey,
            'response' => $response,
        ];

        if ($remoteIp) {
            $data['remoteip'] = $remoteIp;
        }

        $result = $this->makeRequest($data);

        return $result['success'] ?? false;
    }

    /**
     * Verify reCAPTCHA v3 response with score
     */
    public function verifyV3(string $response, ?string $remoteIp = null): array
    {
        if (empty($this->secretKey)) {
            // If no secret key configured, return success in development
            if (($_ENV['APP_ENV'] ?? 'production') === 'development') {
                return ['success' => true, 'score' => 1.0];
            }
            return ['success' => false, 'score' => 0.0];
        }

        $data = [
            'secret' => $this->secretKey,
            'response' => $response,
        ];

        if ($remoteIp) {
            $data['remoteip'] = $remoteIp;
        }

        $result = $this->makeRequest($data);

        $success = ($result['success'] ?? false) &&
            (($result['score'] ?? 0) >= $this->minimumScore);

        return [
            'success' => $success,
            'score' => $result['score'] ?? 0.0,
            'action' => $result['action'] ?? null,
            'challenge_ts' => $result['challenge_ts'] ?? null,
            'hostname' => $result['hostname'] ?? null,
        ];
    }

    /**
     * Make request to Google reCAPTCHA API
     */
    private function makeRequest(array $data): array
    {
        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data),
                'timeout' => 10,
            ],
        ];

        $context = stream_context_create($options);

        try {
            $response = @file_get_contents($this->verifyUrl, false, $context);

            if ($response === false) {
                return ['success' => false];
            }

            $result = json_decode($response, true);

            return is_array($result) ? $result : ['success' => false];
        } catch (\Exception $e) {
            error_log('CAPTCHA verification error: ' . $e->getMessage());
            return ['success' => false];
        }
    }

    /**
     * Set minimum score for v3 validation
     */
    public function setMinimumScore(float $score): self
    {
        $this->minimumScore = max(0.0, min(1.0, $score));
        return $this;
    }

    /**
     * Get current minimum score
     */
    public function getMinimumScore(): float
    {
        return $this->minimumScore;
    }

    /**
     * Simple honeypot validation (alternative to CAPTCHA)
     */
    public static function validateHoneypot(array $formData, string $honeypotField = 'website'): bool
    {
        // If honeypot field is filled, it's likely a bot
        return empty($formData[$honeypotField] ?? '');
    }

    /**
     * Time-based form validation (prevent instant submissions)
     */
    public static function validateFormTiming(int $formLoadTime, int $minimumSeconds = 3): bool
    {
        $currentTime = time();
        $elapsed = $currentTime - $formLoadTime;

        // Form was submitted too quickly (likely a bot)
        if ($elapsed < $minimumSeconds) {
            return false;
        }

        // Form was loaded too long ago (possible replay attack)
        if ($elapsed > 3600) { // 1 hour
            return false;
        }

        return true;
    }
}
