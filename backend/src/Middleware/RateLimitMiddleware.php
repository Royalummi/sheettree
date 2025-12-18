<?php

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;

/**
 * Rate Limiting Middleware
 * Prevents API abuse by limiting requests per IP/user
 */
class RateLimitMiddleware
{
    private const CACHE_FILE = __DIR__ . '/../../storage/rate_limits.json';
    private int $maxRequests;
    private int $windowSeconds;

    public function __construct(int $maxRequests = 100, int $windowSeconds = 60)
    {
        $this->maxRequests = $maxRequests;
        $this->windowSeconds = $windowSeconds;
        $this->ensureStorageExists();
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $identifier = $this->getIdentifier($request);
        $currentTime = time();

        // Load rate limit data
        $rateLimits = $this->loadRateLimits();

        // Clean old entries
        $rateLimits = $this->cleanOldEntries($rateLimits, $currentTime);

        // Check if rate limit exceeded
        if ($this->isRateLimitExceeded($rateLimits, $identifier, $currentTime)) {
            $response = new Response();
            $response->getBody()->write(json_encode([
                'error' => 'Rate limit exceeded',
                'message' => "Too many requests. Maximum {$this->maxRequests} requests per {$this->windowSeconds} seconds.",
                'retry_after' => $this->getRetryAfter($rateLimits, $identifier, $currentTime),
            ]));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withHeader('X-RateLimit-Limit', (string)$this->maxRequests)
                ->withHeader('X-RateLimit-Remaining', '0')
                ->withHeader('X-RateLimit-Reset', (string)$this->getResetTime($rateLimits, $identifier, $currentTime))
                ->withStatus(429);
        }

        // Record this request
        $rateLimits = $this->recordRequest($rateLimits, $identifier, $currentTime);
        $this->saveRateLimits($rateLimits);

        // Add rate limit headers to response
        $response = $handler->handle($request);
        $remaining = $this->getRemainingRequests($rateLimits, $identifier, $currentTime);

        return $response
            ->withHeader('X-RateLimit-Limit', (string)$this->maxRequests)
            ->withHeader('X-RateLimit-Remaining', (string)$remaining)
            ->withHeader('X-RateLimit-Reset', (string)$this->getResetTime($rateLimits, $identifier, $currentTime));
    }

    private function getIdentifier(Request $request): string
    {
        // Try to get user ID from JWT token first
        $authHeader = $request->getHeaderLine('Authorization');
        if (!empty($authHeader)) {
            try {
                $token = str_replace('Bearer ', '', $authHeader);
                $decoded = \Firebase\JWT\JWT::decode(
                    $token,
                    new \Firebase\JWT\Key($_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM'] ?? 'HS256')
                );
                return 'user_' . $decoded->user_id;
            } catch (\Exception $e) {
                // Fall back to IP-based rate limiting
            }
        }

        // Use IP address as identifier
        $serverParams = $request->getServerParams();
        return 'ip_' . ($serverParams['REMOTE_ADDR'] ?? 'unknown');
    }

    private function ensureStorageExists(): void
    {
        $dir = dirname(self::CACHE_FILE);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        if (!file_exists(self::CACHE_FILE)) {
            file_put_contents(self::CACHE_FILE, json_encode([]));
        }
    }

    private function loadRateLimits(): array
    {
        $content = file_get_contents(self::CACHE_FILE);
        return json_decode($content, true) ?? [];
    }

    private function saveRateLimits(array $rateLimits): void
    {
        file_put_contents(self::CACHE_FILE, json_encode($rateLimits));
    }

    private function cleanOldEntries(array $rateLimits, int $currentTime): array
    {
        foreach ($rateLimits as $identifier => $data) {
            $rateLimits[$identifier]['requests'] = array_filter(
                $data['requests'] ?? [],
                fn($timestamp) => ($currentTime - $timestamp) < $this->windowSeconds
            );

            // Remove empty entries
            if (empty($rateLimits[$identifier]['requests'])) {
                unset($rateLimits[$identifier]);
            }
        }

        return $rateLimits;
    }

    private function isRateLimitExceeded(array $rateLimits, string $identifier, int $currentTime): bool
    {
        if (!isset($rateLimits[$identifier])) {
            return false;
        }

        $requests = $rateLimits[$identifier]['requests'] ?? [];
        $recentRequests = array_filter(
            $requests,
            fn($timestamp) => ($currentTime - $timestamp) < $this->windowSeconds
        );

        return count($recentRequests) >= $this->maxRequests;
    }

    private function recordRequest(array $rateLimits, string $identifier, int $currentTime): array
    {
        if (!isset($rateLimits[$identifier])) {
            $rateLimits[$identifier] = ['requests' => []];
        }

        $rateLimits[$identifier]['requests'][] = $currentTime;

        return $rateLimits;
    }

    private function getRemainingRequests(array $rateLimits, string $identifier, int $currentTime): int
    {
        if (!isset($rateLimits[$identifier])) {
            return $this->maxRequests;
        }

        $requests = $rateLimits[$identifier]['requests'] ?? [];
        $recentRequests = array_filter(
            $requests,
            fn($timestamp) => ($currentTime - $timestamp) < $this->windowSeconds
        );

        return max(0, $this->maxRequests - count($recentRequests));
    }

    private function getResetTime(array $rateLimits, string $identifier, int $currentTime): int
    {
        if (!isset($rateLimits[$identifier]['requests']) || empty($rateLimits[$identifier]['requests'])) {
            return $currentTime + $this->windowSeconds;
        }

        $oldestRequest = min($rateLimits[$identifier]['requests']);
        return $oldestRequest + $this->windowSeconds;
    }

    private function getRetryAfter(array $rateLimits, string $identifier, int $currentTime): int
    {
        return $this->getResetTime($rateLimits, $identifier, $currentTime) - $currentTime;
    }
}
