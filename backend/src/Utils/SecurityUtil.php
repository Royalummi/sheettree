<?php

namespace App\Utils;

/**
 * Security Utilities
 * Helper functions for security operations
 */
class SecurityUtil
{
    /**
     * Generate a cryptographically secure random token
     */
    public static function generateSecureToken(int $length = 32): string
    {
        return bin2hex(random_bytes($length));
    }

    /**
     * Hash a password securely
     */
    public static function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_ARGON2ID);
    }

    /**
     * Verify a password against a hash
     */
    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    /**
     * Sanitize user input to prevent XSS
     */
    public static function sanitizeInput(string $input): string
    {
        return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Validate and sanitize email
     */
    public static function sanitizeEmail(string $email): ?string
    {
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
    }

    /**
     * Validate and sanitize URL
     */
    public static function sanitizeUrl(string $url): ?string
    {
        $url = filter_var($url, FILTER_SANITIZE_URL);
        return filter_var($url, FILTER_VALIDATE_URL) ? $url : null;
    }

    /**
     * Check if request is from a trusted origin
     */
    public static function isTrustedOrigin(string $origin): bool
    {
        $trustedOrigins = explode(',', $_ENV['CORS_ORIGINS'] ?? '');
        $trustedOrigins = array_map('trim', $trustedOrigins);

        return in_array($origin, $trustedOrigins);
    }

    /**
     * Generate CSRF token
     */
    public static function generateCsrfToken(): string
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $token = self::generateSecureToken(32);
        $_SESSION['csrf_token'] = $token;

        return $token;
    }

    /**
     * Verify CSRF token
     */
    public static function verifyCsrfToken(string $token): bool
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }

    /**
     * Prevent timing attacks with constant-time string comparison
     */
    public static function constantTimeCompare(string $known, string $user): bool
    {
        return hash_equals($known, $user);
    }

    /**
     * Get client IP address (even behind proxies)
     */
    public static function getClientIp(): string
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            // Handle comma-separated IPs (take first one)
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        }

        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }

    /**
     * Mask sensitive data for logging
     */
    public static function maskSensitiveData(string $data, int $visibleChars = 4): string
    {
        $length = strlen($data);
        if ($length <= $visibleChars) {
            return str_repeat('*', $length);
        }

        return substr($data, 0, $visibleChars) . str_repeat('*', $length - $visibleChars);
    }

    /**
     * Validate JWT token structure (basic check)
     */
    public static function isValidJwtStructure(string $token): bool
    {
        $parts = explode('.', $token);
        return count($parts) === 3;
    }

    /**
     * Check if string contains SQL injection patterns
     */
    public static function containsSqlInjectionPatterns(string $input): bool
    {
        $patterns = [
            '/(\bunion\b.*\bselect\b)/i',
            '/(\bselect\b.*\bfrom\b)/i',
            '/(\binsert\b.*\binto\b)/i',
            '/(\bdelete\b.*\bfrom\b)/i',
            '/(\bdrop\b.*\btable\b)/i',
            '/(\bupdate\b.*\bset\b)/i',
            '/(\'|\"|;|--|\*|\/\*|\*\/)/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Rate limit check (simple in-memory implementation)
     */
    private static array $rateLimitCache = [];

    public static function checkRateLimit(string $identifier, int $maxAttempts = 5, int $decayMinutes = 1): bool
    {
        $key = "rate_limit:{$identifier}";
        $now = time();
        $decaySeconds = $decayMinutes * 60;

        if (!isset(self::$rateLimitCache[$key])) {
            self::$rateLimitCache[$key] = ['attempts' => 0, 'reset_at' => $now + $decaySeconds];
            return true;
        }

        $data = self::$rateLimitCache[$key];

        // Reset if decay period passed
        if ($now >= $data['reset_at']) {
            self::$rateLimitCache[$key] = ['attempts' => 1, 'reset_at' => $now + $decaySeconds];
            return true;
        }

        // Check if limit exceeded
        if ($data['attempts'] >= $maxAttempts) {
            return false;
        }

        // Increment attempts
        self::$rateLimitCache[$key]['attempts']++;
        return true;
    }
}
