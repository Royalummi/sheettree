<?php

/**
 * PHPUnit Bootstrap File
 * Sets up the testing environment
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;

// Load test environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

// Override with test environment settings
$_ENV['APP_ENV'] = 'testing';
$_ENV['DB_NAME'] = $_ENV['DB_NAME'] ?? 'sheettree_test';

// Set up database connection for tests
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => $_ENV['DB_HOST'] ?? 'localhost',
    'database' => $_ENV['DB_NAME'],
    'username' => $_ENV['DB_USERNAME'] ?? 'root',
    'password' => $_ENV['DB_PASSWORD'] ?? '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

// Create a test helper class
class TestCase extends \PHPUnit\Framework\TestCase
{
    /**
     * Set up before each test
     */
    protected function setUp(): void
    {
        parent::setUp();
        // Begin database transaction
        Capsule::connection()->beginTransaction();
    }

    /**
     * Tear down after each test
     */
    protected function tearDown(): void
    {
        // Rollback database transaction
        Capsule::connection()->rollBack();
        parent::tearDown();
    }

    /**
     * Create a test user
     */
    protected function createTestUser(array $attributes = []): \App\Models\User
    {
        return \App\Models\User::create(array_merge([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'google_id' => 'test_google_id_' . uniqid(),
            'avatar' => 'https://example.com/avatar.jpg',
        ], $attributes));
    }

    /**
     * Create a test JWT token
     */
    protected function createTestToken(\App\Models\User $user): string
    {
        $payload = [
            'user_id' => $user->id,
            'email' => $user->email,
            'iat' => time(),
            'exp' => time() + 3600,
        ];

        return \Firebase\JWT\JWT::encode(
            $payload,
            $_ENV['JWT_SECRET'],
            $_ENV['JWT_ALGORITHM'] ?? 'HS256'
        );
    }

    /**
     * Make authenticated request headers
     */
    protected function withAuth(\App\Models\User $user): array
    {
        $token = $this->createTestToken($user);
        return [
            'HTTP_AUTHORIZATION' => "Bearer {$token}",
            'CONTENT_TYPE' => 'application/json',
        ];
    }
}
