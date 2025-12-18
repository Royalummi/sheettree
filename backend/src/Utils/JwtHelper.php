<?php

namespace App\Utils;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper
{
    /**
     * Decode JWT token and get payload without verification (useful for expired tokens)
     */
    public static function decodeWithoutVerification(string $token): ?array
    {
        try {
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return null;
            }

            $payload = json_decode(base64_decode($parts[1]), true);
            return $payload ?: null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Check if JWT token is expired
     */
    public static function isTokenExpired(string $token): bool
    {
        $payload = self::decodeWithoutVerification($token);

        if (!$payload || !isset($payload['exp'])) {
            return true;
        }

        return time() >= $payload['exp'];
    }

    /**
     * Get token expiry time
     */
    public static function getTokenExpiry(string $token): ?int
    {
        $payload = self::decodeWithoutVerification($token);
        return $payload['exp'] ?? null;
    }

    /**
     * Get time until token expires (in seconds)
     */
    public static function getTimeUntilExpiry(string $token): ?int
    {
        $expiry = self::getTokenExpiry($token);
        if (!$expiry) {
            return null;
        }

        $timeLeft = $expiry - time();
        return $timeLeft > 0 ? $timeLeft : 0;
    }

    /**
     * Check if token expires within given seconds
     */
    public static function expiresWithin(string $token, int $seconds): bool
    {
        $timeLeft = self::getTimeUntilExpiry($token);
        return $timeLeft !== null && $timeLeft <= $seconds;
    }

    /**
     * Validate JWT token and return decoded payload
     */
    public static function validateToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM']));
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Generate new JWT token for user
     */
    public static function generateToken(int $userId, string $email): string
    {
        $payload = [
            'user_id' => $userId,
            'email' => $email,
            'iat' => time(),
            'exp' => time() + (int)$_ENV['JWT_EXPIRY']
        ];

        return JWT::encode($payload, $_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM']);
    }
}
