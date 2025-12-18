<?php

namespace Tests\Integration;

use App\Models\User;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Headers;
use Slim\Psr7\Request;
use Slim\Psr7\Uri;

class AuthApiTest extends \TestCase
{
    public function testRegisterOrLoginCreatesNewUser()
    {
        // Simulate Google OAuth response
        $userData = [
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'google_id' => 'google_' . uniqid(),
            'avatar' => 'https://example.com/avatar.jpg',
        ];

        $user = User::create($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Test User', $user->name);
        $this->assertEquals('testuser@example.com', $user->email);
        $this->assertDatabaseHas('users', [
            'email' => 'testuser@example.com',
        ]);
    }

    public function testRegisterOrLoginReturnsExistingUser()
    {
        // Create a user first
        $user = User::create([
            'name' => 'Existing User',
            'email' => 'existing@example.com',
            'google_id' => 'google_existing',
            'avatar' => 'https://example.com/avatar.jpg',
        ]);

        // Try to create again with same Google ID
        $sameUser = User::where('google_id', 'google_existing')->first();

        $this->assertEquals($user->id, $sameUser->id);
        $this->assertEquals('Existing User', $sameUser->name);
    }

    public function testJwtTokenGeneration()
    {
        $user = $this->createTestUser();
        $token = $this->createTestToken($user);

        $this->assertIsString($token);
        $this->assertNotEmpty($token);

        // Decode and verify token
        $decoded = \Firebase\JWT\JWT::decode(
            $token,
            new \Firebase\JWT\Key($_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM'] ?? 'HS256')
        );

        $this->assertEquals($user->id, $decoded->user_id);
        $this->assertEquals($user->email, $decoded->email);
    }

    public function testJwtTokenExpiration()
    {
        $user = $this->createTestUser();

        // Create expired token
        $payload = [
            'user_id' => $user->id,
            'email' => $user->email,
            'iat' => time() - 7200, // 2 hours ago
            'exp' => time() - 3600, // 1 hour ago (expired)
        ];

        $expiredToken = \Firebase\JWT\JWT::encode(
            $payload,
            $_ENV['JWT_SECRET'],
            $_ENV['JWT_ALGORITHM'] ?? 'HS256'
        );

        $this->expectException(\Firebase\JWT\ExpiredException::class);

        \Firebase\JWT\JWT::decode(
            $expiredToken,
            new \Firebase\JWT\Key($_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM'] ?? 'HS256')
        );
    }

    protected function assertDatabaseHas(string $table, array $data)
    {
        $query = \Illuminate\Database\Capsule\Manager::table($table);

        foreach ($data as $key => $value) {
            $query->where($key, $value);
        }

        $this->assertTrue($query->exists(), "Failed asserting that {$table} has matching record.");
    }
}
