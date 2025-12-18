<?php

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;

/**
 * Security Headers Middleware
 * Adds security headers to all responses
 */
class SecurityHeadersMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $response = $handler->handle($request);

        // Prevent clickjacking
        $response = $response->withHeader('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response = $response->withHeader('X-Content-Type-Options', 'nosniff');

        // Enable XSS protection
        $response = $response->withHeader('X-XSS-Protection', '1; mode=block');

        // Referrer policy
        $response = $response->withHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy (adjust as needed)
        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://sheets.googleapis.com https://www.googleapis.com",
            "frame-ancestors 'self'",
        ]);
        $response = $response->withHeader('Content-Security-Policy', $csp);

        // Strict Transport Security (HTTPS only - enable in production)
        if ($_ENV['APP_ENV'] === 'production') {
            $response = $response->withHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Permissions Policy (formerly Feature Policy)
        $response = $response->withHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        return $response;
    }
}
