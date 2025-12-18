<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Google\Client as Google_Client;
use Google\Service\Oauth2 as Google_Service_Oauth2;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;
use App\Models\OauthToken;

class AuthController
{
    private Google_Client $googleClient;

    public function __construct(Google_Client $googleClient)
    {
        $this->googleClient = $googleClient;
    }

    public function initiateGoogleAuth(Request $request, Response $response): Response
    {
        // Generate state for CSRF protection
        $state = bin2hex(random_bytes(16));
        $this->googleClient->setState($state);

        // Store state in session or cache for verification
        // For simplicity, we'll include it in the redirect

        $authUrl = $this->googleClient->createAuthUrl();

        $data = [
            'auth_url' => $authUrl,
            'state' => $state
        ];

        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function handleGoogleCallback(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();

        if (!isset($params['code'])) {
            $response->getBody()->write(json_encode(['error' => 'Authorization code not provided']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        try {
            // Exchange code for token
            $token = $this->googleClient->fetchAccessTokenWithAuthCode($params['code']);

            if (isset($token['error'])) {
                throw new \Exception('Error fetching access token: ' . $token['error']);
            }

            // Get user info
            $oauth2 = new Google_Service_Oauth2($this->googleClient);
            $googleUser = $oauth2->userinfo->get();

            // Find or create user
            /** @var User|null $user */
            $user = User::where('google_id', $googleUser->getId())->first();

            if (!$user) {
                /** @var User $user */
                $user = User::create([
                    'google_id' => $googleUser->getId(),
                    'email' => $googleUser->getEmail(),
                    'name' => $googleUser->getName(),
                    'avatar' => $googleUser->getPicture(),
                    'is_admin' => false
                ]);
            }

            // Save or update OAuth token
            $refreshToken = $token['refresh_token'] ?? null;
            $expiresAt = isset($token['expires_in']) ?
                (new \DateTime())->add(new \DateInterval('PT' . $token['expires_in'] . 'S')) : null;

            if ($refreshToken) {
                OauthToken::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'refresh_token' => $refreshToken,
                        'access_token' => $token['access_token'],
                        'token_expires_at' => $expiresAt,
                        'scopes' => $token['scope'] ?? ''
                    ]
                );
            }

            // Generate JWT token
            $jwtPayload = [
                'user_id' => $user->id,
                'email' => $user->email,
                'iat' => time(),
                'exp' => time() + (int)$_ENV['JWT_EXPIRY']
            ];

            $jwtToken = JWT::encode($jwtPayload, $_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM']);

            // Prepare user data to include in URL
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'is_admin' => $user->is_admin
            ];

            // Redirect to frontend with token and user data
            $frontendUrl = $_ENV['FRONTEND_URL'] . '/auth/callback?token=' . $jwtToken . '&user=' . urlencode(base64_encode(json_encode($userData)));
            return $response->withHeader('Location', $frontendUrl)->withStatus(302);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function refreshToken(Request $request, Response $response): Response
    {
        try {
            $authHeader = $request->getHeaderLine('Authorization');

            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                $response->getBody()->write(json_encode(['error' => 'Authorization token required']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            $token = substr($authHeader, 7);

            // Decode the JWT token to get user info (even if expired)
            try {
                $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM']));
                $userId = $decoded->user_id;
            } catch (\Exception $e) {
                // Try to decode without verification to get user_id from expired token
                $parts = explode('.', $token);
                if (count($parts) !== 3) {
                    $response->getBody()->write(json_encode(['error' => 'Invalid token format']));
                    return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
                }

                $payload = json_decode(base64_decode($parts[1]), true);
                if (!$payload || !isset($payload['user_id'])) {
                    $response->getBody()->write(json_encode(['error' => 'Invalid token payload']));
                    return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
                }

                $userId = $payload['user_id'];
            }

            // Get user from database
            /** @var User|null $user */
            $user = User::find($userId);
            if (!$user) {
                $response->getBody()->write(json_encode(['error' => 'User not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check if user's Google OAuth token is still valid
            /** @var OauthToken|null $oauthToken */
            $oauthToken = OauthToken::where('user_id', $userId)->first();
            if (!$oauthToken) {
                $response->getBody()->write(json_encode(['error' => 'OAuth token not found. Please re-authenticate with Google.']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            // Check if Google OAuth token is expired
            if ($oauthToken->isExpired()) {
                // Try to refresh Google OAuth token
                $this->googleClient->setAccessToken([
                    'access_token' => $oauthToken->access_token,
                    'refresh_token' => $oauthToken->refresh_token,
                    'expires_in' => $oauthToken->token_expires_at ? $oauthToken->token_expires_at->getTimestamp() - time() : 0
                ]);

                if ($this->googleClient->isAccessTokenExpired()) {
                    if ($oauthToken->refresh_token) {
                        try {
                            $newToken = $this->googleClient->fetchAccessTokenWithRefreshToken($oauthToken->refresh_token);

                            if (isset($newToken['error'])) {
                                $response->getBody()->write(json_encode(['error' => 'Failed to refresh Google token. Please re-authenticate.']));
                                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
                            }

                            // Update the stored OAuth token
                            $oauthToken->access_token = $newToken['access_token'];
                            $oauthToken->token_expires_at = isset($newToken['expires_in']) ?
                                (new \DateTime())->add(new \DateInterval('PT' . $newToken['expires_in'] . 'S')) : null;

                            if (isset($newToken['refresh_token'])) {
                                $oauthToken->refresh_token = $newToken['refresh_token'];
                            }

                            $oauthToken->save();
                        } catch (\Exception $e) {
                            $response->getBody()->write(json_encode(['error' => 'Failed to refresh Google token. Please re-authenticate.']));
                            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
                        }
                    } else {
                        $response->getBody()->write(json_encode(['error' => 'No refresh token available. Please re-authenticate with Google.']));
                        return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
                    }
                }
            }

            // Generate new JWT token
            $jwtPayload = [
                'user_id' => $user->id,
                'email' => $user->email,
                'iat' => time(),
                'exp' => time() + (int)$_ENV['JWT_EXPIRY']
            ];

            $newJwtToken = JWT::encode($jwtPayload, $_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM']);

            $responseData = [
                'message' => 'Token refreshed successfully',
                'token' => $newJwtToken,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin
                ],
                'expires_in' => (int)$_ENV['JWT_EXPIRY']
            ];

            $response->getBody()->write(json_encode($responseData));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Token refresh failed: ' . $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function logout(Request $request, Response $response): Response
    {
        // In JWT, logout is typically handled client-side by removing the token
        // Optionally, you could maintain a blacklist of tokens

        $response->getBody()->write(json_encode(['message' => 'Logged out successfully']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * Check token status and expiry
     */
    public function checkTokenStatus(Request $request, Response $response): Response
    {
        try {
            $authHeader = $request->getHeaderLine('Authorization');

            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                $response->getBody()->write(json_encode(['error' => 'Authorization token required']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            $token = substr($authHeader, 7);

            // Get token info without strict validation
            $payload = \App\Utils\JwtHelper::decodeWithoutVerification($token);

            if (!$payload) {
                $response->getBody()->write(json_encode(['error' => 'Invalid token format']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $currentTime = time();
            $expiryTime = $payload['exp'] ?? null;
            $isExpired = $expiryTime ? $currentTime >= $expiryTime : true;
            $timeUntilExpiry = $expiryTime ? max(0, $expiryTime - $currentTime) : 0;

            $responseData = [
                'valid' => !$isExpired,
                'expired' => $isExpired,
                'expires_at' => $expiryTime,
                'time_until_expiry' => $timeUntilExpiry,
                'expires_in_minutes' => round($timeUntilExpiry / 60, 2),
                'user_id' => $payload['user_id'] ?? null,
                'email' => $payload['email'] ?? null
            ];

            $response->getBody()->write(json_encode($responseData));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => 'Failed to check token status: ' . $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
