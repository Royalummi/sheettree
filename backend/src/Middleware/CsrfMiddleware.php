<?php

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;

/**
 * CSRF Protection Middleware
 * Prevents Cross-Site Request Forgery attacks
 */
class CsrfMiddleware
{
    private const SESSION_TOKEN_KEY = 'csrf_token';
    private const HEADER_NAME = 'X-CSRF-Token';
    private const FORM_FIELD_NAME = '_csrf_token';

    /**
     * Safe methods that don't require CSRF validation
     */
    private array $safeMethods = ['GET', 'HEAD', 'OPTIONS'];

    /**
     * Paths to exclude from CSRF validation
     */
    private array $excludePaths = [
        '/auth/callback',
        '/api/external',
    ];

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $method = $request->getMethod();
        $path = $request->getUri()->getPath();

        // Skip CSRF validation for safe methods
        if (in_array($method, $this->safeMethods)) {
            return $handler->handle($request);
        }

        // Skip CSRF validation for excluded paths
        foreach ($this->excludePaths as $excludePath) {
            if (strpos($path, $excludePath) === 0) {
                return $handler->handle($request);
            }
        }

        // Validate CSRF token
        if (!$this->validateCsrfToken($request)) {
            $response = new Response();
            $response->getBody()->write(json_encode([
                'error' => 'CSRF validation failed',
                'message' => 'Invalid or missing CSRF token. Please refresh and try again.',
            ]));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(403);
        }

        return $handler->handle($request);
    }

    /**
     * Validate CSRF token from request
     */
    private function validateCsrfToken(Request $request): bool
    {
        // Get token from session
        $sessionToken = $this->getSessionToken();

        if (!$sessionToken) {
            return false;
        }

        // Try to get token from header first
        $requestToken = $request->getHeaderLine(self::HEADER_NAME);

        // If not in header, try to get from body
        if (empty($requestToken)) {
            $parsedBody = $request->getParsedBody();
            if (is_array($parsedBody) && isset($parsedBody[self::FORM_FIELD_NAME])) {
                $requestToken = $parsedBody[self::FORM_FIELD_NAME];
            }
        }

        if (empty($requestToken)) {
            return false;
        }

        // Use hash_equals to prevent timing attacks
        return hash_equals($sessionToken, $requestToken);
    }

    /**
     * Get CSRF token from session
     */
    private function getSessionToken(): ?string
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        return $_SESSION[self::SESSION_TOKEN_KEY] ?? null;
    }

    /**
     * Generate a new CSRF token
     */
    public static function generateToken(): string
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $token = bin2hex(random_bytes(32));
        $_SESSION[self::SESSION_TOKEN_KEY] = $token;

        return $token;
    }

    /**
     * Get the current CSRF token (generate if doesn't exist)
     */
    public static function getToken(): string
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION[self::SESSION_TOKEN_KEY])) {
            return self::generateToken();
        }

        return $_SESSION[self::SESSION_TOKEN_KEY];
    }
}
