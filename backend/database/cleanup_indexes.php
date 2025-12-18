<?php

/**
 * Database Index Cleanup Script
 * Fixes duplicate index issues for clean migration
 */

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use Illuminate\Database\Capsule\Manager as Capsule;

try {
    // Database configuration
    $capsule = new Capsule;
    $capsule->addConnection([
        'driver' => 'mysql',
        'host' => $_ENV['DB_HOST'],
        'database' => $_ENV['DB_NAME'],
        'username' => $_ENV['DB_USERNAME'],
        'password' => $_ENV['DB_PASSWORD'],
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    ]);
    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    echo "🔧 Starting Database Index Cleanup...\n\n";

    // Test database connection
    Capsule::connection()->getPdo();
    echo "✅ Database connection successful\n";

    $connection = Capsule::connection();

    // Check if api_usage_logs table exists
    if (Capsule::schema()->hasTable('api_usage_logs')) {
        echo "📋 Checking api_usage_logs table indexes...\n";

        // Get all indexes for api_usage_logs table
        $indexes = $connection->select("SHOW INDEX FROM api_usage_logs");

        $indexNames = [];
        foreach ($indexes as $index) {
            $indexNames[] = $index->Key_name;
        }

        echo "🔍 Found indexes: " . implode(', ', array_unique($indexNames)) . "\n";

        // Remove duplicate date index if it exists
        if (in_array('api_usage_logs_date_index', $indexNames)) {
            try {
                $connection->statement("DROP INDEX api_usage_logs_date_index ON api_usage_logs");
                echo "🗑️  Removed duplicate date index\n";
            } catch (Exception $e) {
                echo "⚠️  Could not remove date index: " . $e->getMessage() . "\n";
            }
        }

        // Check for duplicate unique constraints
        $uniqueConstraints = array_filter($indexNames, function ($name) {
            return strpos($name, 'form_api_config_id') !== false && strpos($name, 'date') !== false;
        });

        if (count($uniqueConstraints) > 1) {
            // Remove the extra ones, keep the first
            $toRemove = array_slice($uniqueConstraints, 1);
            foreach ($toRemove as $constraintName) {
                try {
                    $connection->statement("DROP INDEX {$constraintName} ON api_usage_logs");
                    echo "🗑️  Removed duplicate unique constraint: {$constraintName}\n";
                } catch (Exception $e) {
                    echo "⚠️  Could not remove constraint {$constraintName}: " . $e->getMessage() . "\n";
                }
            }
        }

        echo "✅ api_usage_logs table cleanup completed\n";
    } else {
        echo "ℹ️  api_usage_logs table doesn't exist yet\n";
    }

    echo "\n🎉 Database cleanup completed!\n";
    echo "💡 You can now run the migration script again.\n\n";
} catch (Exception $e) {
    echo "❌ Cleanup failed: " . $e->getMessage() . "\n";
    echo "💡 Please check your database configuration.\n";
    exit(1);
}
