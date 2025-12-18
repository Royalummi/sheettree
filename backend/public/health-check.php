<?php

/**
 * Production Health Check Script
 * Place this in your public directory to verify deployment
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Check PHP version
$phpVersion = phpversion();
$phpOk = version_compare($phpVersion, '8.0.0', '>=');

// Check required extensions
$requiredExtensions = ['curl', 'json', 'mbstring', 'pdo', 'pdo_mysql', 'openssl'];
$extensionsOk = true;
$missingExtensions = [];

foreach ($requiredExtensions as $ext) {
    if (!extension_loaded($ext)) {
        $extensionsOk = false;
        $missingExtensions[] = $ext;
    }
}

// Check if .env exists
$envExists = file_exists(__DIR__ . '/../.env');

// Check if vendor directory exists
$vendorExists = is_dir(__DIR__ . '/../vendor');

// Check database connection (if .env exists)
$dbOk = false;
$dbError = null;

if ($envExists && $vendorExists) {
    try {
        require_once __DIR__ . '/../vendor/autoload.php';

        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->load();

        $dsn = "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4";
        $pdo = new PDO($dsn, $_ENV['DB_USERNAME'], $_ENV['DB_PASSWORD']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbOk = true;
    } catch (Exception $e) {
        $dbError = $e->getMessage();
    }
}

// Overall status
$allOk = $phpOk && $extensionsOk && $envExists && $vendorExists && $dbOk;

$response = [
    'status' => $allOk ? 'success' : 'error',
    'message' => $allOk ? 'SheetTree backend is ready for production!' : 'Some issues need to be resolved',
    'checks' => [
        'php_version' => [
            'status' => $phpOk ? 'ok' : 'error',
            'value' => $phpVersion,
            'required' => '8.0.0+',
            'message' => $phpOk ? 'PHP version is compatible' : 'PHP 8.0+ required'
        ],
        'extensions' => [
            'status' => $extensionsOk ? 'ok' : 'error',
            'missing' => $missingExtensions,
            'message' => $extensionsOk ? 'All required extensions loaded' : 'Missing extensions: ' . implode(', ', $missingExtensions)
        ],
        'environment' => [
            'status' => $envExists ? 'ok' : 'error',
            'message' => $envExists ? '.env file exists' : '.env file not found'
        ],
        'dependencies' => [
            'status' => $vendorExists ? 'ok' : 'error',
            'message' => $vendorExists ? 'Composer dependencies installed' : 'Run composer install'
        ],
        'database' => [
            'status' => $dbOk ? 'ok' : 'error',
            'message' => $dbOk ? 'Database connection successful' : 'Database connection failed: ' . $dbError
        ]
    ],
    'next_steps' => $allOk ? [
        'Your backend is ready!',
        'Test API endpoints',
        'Configure your frontend',
        'Monitor error logs'
    ] : [
        'Fix the issues listed above',
        'Re-run this health check',
        'Check server error logs',
        'Verify environment configuration'
    ],
    'timestamp' => date('Y-m-d H:i:s T')
];

http_response_code($allOk ? 200 : 500);
echo json_encode($response, JSON_PRETTY_PRINT);
