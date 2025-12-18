<?php

namespace App\Security;

/**
 * API Request Signing and Verification
 * Ensures request authenticity and prevents tampering
 */
class RequestSigning
{
    private string $secretKey;
    private string $algorithm = 'sha256';
    private int $timestampTolerance = 300; // 5 minutes

    public function __construct(?string $secretKey = null)
    {
        $this->secretKey = $secretKey ?? getenv('API_SIGNING_SECRET') ?: getenv('JWT_SECRET') ?: 'default_secret_change_in_production';

        if ($this->secretKey === 'default_secret_change_in_production') {
            error_log('Warning: Using default API signing secret. Please set API_SIGNING_SECRET in .env');
        }
    }

    /**
     * Sign a request payload
     */
    public function signRequest(array $payload, ?int $timestamp = null): string
    {
        $timestamp = $timestamp ?? time();

        // Add timestamp to payload
        $payload['timestamp'] = $timestamp;

        // Sort payload keys for consistent hashing
        ksort($payload);

        // Create signature
        $message = $this->createMessage($payload);
        $signature = hash_hmac($this->algorithm, $message, $this->secretKey);

        return $signature;
    }

    /**
     * Verify a request signature
     */
    public function verifyRequest(array $payload, string $signature): bool
    {
        // Check timestamp
        if (!isset($payload['timestamp'])) {
            return false;
        }

        $timestamp = (int)$payload['timestamp'];
        $currentTime = time();

        // Check if timestamp is within tolerance
        if (abs($currentTime - $timestamp) > $this->timestampTolerance) {
            return false;
        }

        // Verify signature
        $expectedSignature = $this->signRequest($payload, $timestamp);

        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Create message string from payload
     */
    private function createMessage(array $payload): string
    {
        $parts = [];

        foreach ($payload as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value);
            }
            $parts[] = $key . '=' . $value;
        }

        return implode('&', $parts);
    }

    /**
     * Generate signature for webhook
     */
    public function generateWebhookSignature(string $payload, string $secret): string
    {
        return hash_hmac($this->algorithm, $payload, $secret);
    }

    /**
     * Verify webhook signature
     */
    public function verifyWebhookSignature(string $payload, string $signature, string $secret): bool
    {
        $expectedSignature = $this->generateWebhookSignature($payload, $secret);

        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Create signed URL with expiration
     */
    public function createSignedUrl(string $url, int $expiresIn = 3600): string
    {
        $expires = time() + $expiresIn;

        $parsedUrl = parse_url($url);
        parse_str($parsedUrl['query'] ?? '', $queryParams);

        $queryParams['expires'] = $expires;

        // Generate signature
        $signature = $this->signRequest($queryParams, $expires);
        $queryParams['signature'] = $signature;

        // Rebuild URL
        $baseUrl = $parsedUrl['scheme'] . '://' . $parsedUrl['host'];
        if (isset($parsedUrl['port'])) {
            $baseUrl .= ':' . $parsedUrl['port'];
        }
        $baseUrl .= $parsedUrl['path'] ?? '/';

        return $baseUrl . '?' . http_build_query($queryParams);
    }

    /**
     * Verify signed URL
     */
    public function verifySignedUrl(string $url): bool
    {
        $parsedUrl = parse_url($url);
        parse_str($parsedUrl['query'] ?? '', $queryParams);

        if (!isset($queryParams['signature']) || !isset($queryParams['expires'])) {
            return false;
        }

        $signature = $queryParams['signature'];
        unset($queryParams['signature']);

        // Check expiration
        if (time() > (int)$queryParams['expires']) {
            return false;
        }

        return $this->verifyRequest($queryParams, $signature);
    }
}
