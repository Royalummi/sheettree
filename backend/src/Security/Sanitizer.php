<?php

namespace App\Security;

/**
 * Advanced Input Sanitization
 * Comprehensive XSS and injection prevention
 */
class Sanitizer
{
    /**
     * Sanitize string for output
     */
    public static function sanitizeString(string $input, bool $allowHtml = false): string
    {
        if ($allowHtml) {
            // Allow only safe HTML tags
            $allowed = '<p><br><strong><em><u><a><ul><ol><li><h1><h2><h3><h4><h5><h6>';
            return strip_tags($input, $allowed);
        }

        return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Sanitize email address
     */
    public static function sanitizeEmail(string $email): string
    {
        return filter_var($email, FILTER_SANITIZE_EMAIL);
    }

    /**
     * Sanitize URL
     */
    public static function sanitizeUrl(string $url): string
    {
        return filter_var($url, FILTER_SANITIZE_URL);
    }

    /**
     * Sanitize array of strings
     */
    public static function sanitizeArray(array $array, bool $allowHtml = false): array
    {
        return array_map(function ($value) use ($allowHtml) {
            if (is_string($value)) {
                return self::sanitizeString($value, $allowHtml);
            }
            if (is_array($value)) {
                return self::sanitizeArray($value, $allowHtml);
            }
            return $value;
        }, $array);
    }

    /**
     * Remove all HTML tags
     */
    public static function stripAllTags(string $input): string
    {
        return strip_tags($input);
    }

    /**
     * Sanitize filename
     */
    public static function sanitizeFilename(string $filename): string
    {
        // Remove path separators
        $filename = str_replace(['/', '\\', '..'], '', $filename);

        // Remove special characters
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);

        return $filename;
    }

    /**
     * Detect and remove SQL injection patterns
     */
    public static function detectSqlInjection(string $input): bool
    {
        $patterns = [
            '/(\bunion\b.*\bselect\b)/i',
            '/(\bselect\b.*\bfrom\b)/i',
            '/(\binsert\b.*\binto\b)/i',
            '/(\bupdate\b.*\bset\b)/i',
            '/(\bdelete\b.*\bfrom\b)/i',
            '/(\bdrop\b.*\btable\b)/i',
            '/(\bexec\b.*\()/i',
            '/(\bscript\b.*\>)/i',
            '/(--[^\n]*)/i',
            '/(;.*\b(select|insert|update|delete|drop)\b)/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Detect XSS patterns
     */
    public static function detectXss(string $input): bool
    {
        $patterns = [
            '/<script[\s\S]*?<\/script>/i',
            '/javascript:/i',
            '/on\w+\s*=/i', // Event handlers like onclick=
            '/<iframe/i',
            '/<embed/i',
            '/<object/i',
            '/eval\s*\(/i',
            '/expression\s*\(/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Comprehensive input sanitization
     */
    public static function sanitizeInput(mixed $input, string $type = 'string'): mixed
    {
        if ($input === null) {
            return null;
        }

        return match ($type) {
            'string' => self::sanitizeString((string)$input),
            'email' => self::sanitizeEmail((string)$input),
            'url' => self::sanitizeUrl((string)$input),
            'int' => filter_var($input, FILTER_SANITIZE_NUMBER_INT),
            'float' => filter_var($input, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION),
            'boolean' => filter_var($input, FILTER_VALIDATE_BOOLEAN),
            'array' => is_array($input) ? self::sanitizeArray($input) : [],
            default => $input,
        };
    }

    /**
     * Sanitize JSON input
     */
    public static function sanitizeJson(string $json): ?array
    {
        $decoded = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        return self::sanitizeArray($decoded);
    }

    /**
     * Create safe HTML attributes
     */
    public static function sanitizeAttributes(array $attributes): array
    {
        $safe = [];

        foreach ($attributes as $key => $value) {
            // Only allow alphanumeric keys
            if (!preg_match('/^[a-zA-Z0-9-_]+$/', $key)) {
                continue;
            }

            // Skip dangerous attributes
            if (in_array(strtolower($key), ['onclick', 'onerror', 'onload', 'onmouseover'])) {
                continue;
            }

            $safe[$key] = htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        return $safe;
    }
}
