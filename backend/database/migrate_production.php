<?php

/**
 * Production Database Migration Script
 * Run this on your Hostinger hosting environment to set up the database
 */

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

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

    echo "🚀 Starting SheetTree Database Migration for Production...\n\n";

    // Test database connection
    Capsule::connection()->getPdo();
    echo "✅ Database connection successful\n";

    // Create users table
    if (!Capsule::schema()->hasTable('users')) {
        Capsule::schema()->create('users', function (Blueprint $table) {
            $table->id();
            $table->string('google_id')->unique()->index();
            $table->string('email')->unique()->index();
            $table->string('name');
            $table->string('avatar')->nullable();
            $table->boolean('is_admin')->default(false)->index();
            $table->timestamps();

            // Add indexes for performance
            $table->index(['created_at']);
        });
        echo "✅ Users table created\n";
    } else {
        echo "⚠️  Users table already exists\n";
    }

    // Create oauth_tokens table
    if (!Capsule::schema()->hasTable('oauth_tokens')) {
        Capsule::schema()->create('oauth_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('refresh_token');
            $table->text('access_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->text('scopes')->nullable();
            $table->timestamps();

            // Add indexes
            $table->index(['user_id']);
            $table->index(['token_expires_at']);
        });
        echo "✅ OAuth tokens table created\n";
    } else {
        echo "⚠️  OAuth tokens table already exists\n";
    }

    // Create connected_sheets table
    if (!Capsule::schema()->hasTable('connected_sheets')) {
        Capsule::schema()->create('connected_sheets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('spreadsheet_id')->index();
            $table->string('spreadsheet_name');
            $table->string('sheet_name')->default('Sheet1');
            $table->enum('connection_type', ['manual', 'picker'])->default('manual');
            $table->timestamps();

            // Add indexes
            $table->index(['user_id', 'spreadsheet_id']);
        });
        echo "✅ Connected sheets table created\n";
    } else {
        echo "⚠️  Connected sheets table already exists\n";
    }

    // Create forms table
    if (!Capsule::schema()->hasTable('forms')) {
        Capsule::schema()->create('forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('connected_sheet_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('form_config')->nullable();
            $table->json('validation_rules')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_public')->default(false)->index();
            $table->integer('submissions_count')->default(0);
            $table->timestamps();

            // Add indexes
            $table->index(['user_id', 'is_active']);
            $table->index(['is_public', 'is_active']);
        });
        echo "✅ Forms table created\n";
    } else {
        echo "⚠️  Forms table already exists\n";
    }

    // Create form_submissions table
    if (!Capsule::schema()->hasTable('form_submissions')) {
        Capsule::schema()->create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained()->onDelete('cascade');
            $table->json('submission_data');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            // Add indexes
            $table->index(['form_id', 'created_at']);
            $table->index(['ip_address']);
        });
        echo "✅ Form submissions table created\n";
    } else {
        echo "⚠️  Form submissions table already exists\n";
    }

    // Create form_api_configs table for external API and embed functionality
    if (!Capsule::schema()->hasTable('form_api_configs')) {
        Capsule::schema()->create('form_api_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained()->onDelete('cascade');
            $table->string('api_hash', 32)->unique()->index();
            $table->string('api_key', 64)->unique();
            $table->string('api_name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->json('allowed_origins')->nullable();
            $table->boolean('cors_enabled')->default(true);
            $table->boolean('captcha_enabled')->default(false);
            $table->string('captcha_type')->nullable();
            $table->string('captcha_secret_key')->nullable();
            $table->string('honeypot_field_name')->nullable();
            $table->boolean('validation_enabled')->default(true);
            $table->json('validation_rules')->nullable();
            $table->json('required_fields')->nullable();
            $table->string('response_type')->default('json');
            $table->string('success_message')->nullable();
            $table->string('redirect_url')->nullable();
            $table->json('custom_response_data')->nullable();
            $table->json('field_mapping')->nullable();
            $table->integer('rate_limit_per_minute')->default(60);
            $table->integer('rate_limit_per_hour')->default(1000);
            $table->integer('rate_limit_per_day')->default(10000);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();

            // Add indexes
            $table->index(['form_id', 'is_active']);
            $table->index(['last_used_at']);
        });
        echo "✅ Form API configs table created\n";
    } else {
        echo "⚠️  Form API configs table already exists\n";
    }

    // Create api_submissions table for tracking external API submissions
    if (!Capsule::schema()->hasTable('api_submissions')) {
        Capsule::schema()->create('api_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_api_config_id')->constrained('form_api_configs')->onDelete('cascade');
            $table->json('submission_data');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->integer('response_status')->default(200);
            $table->integer('response_time_ms')->nullable();
            $table->json('validation_errors')->nullable();
            $table->timestamps();

            // Add indexes
            $table->index(['form_api_config_id', 'created_at']);
            $table->index(['response_status']);
            $table->index(['ip_address']);
        });
        echo "✅ API submissions table created\n";
    } else {
        echo "⚠️  API submissions table already exists\n";
    }

    // Create api_usage_logs table for rate limiting and analytics
    if (!Capsule::schema()->hasTable('api_usage_logs')) {
        Capsule::schema()->create('api_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_api_config_id')->constrained('form_api_configs')->onDelete('cascade');
            $table->date('date')->index();
            $table->integer('total_requests')->default(0);
            $table->integer('successful_requests')->default(0);
            $table->integer('failed_requests')->default(0);
            $table->decimal('avg_response_time_ms', 8, 2)->default(0);
            $table->integer('unique_ips')->default(0);
            $table->timestamps();

            // Add indexes
            $table->unique(['form_api_config_id', 'date']);
            $table->index(['date']);
        });
        echo "✅ API usage logs table created\n";
    } else {
        echo "⚠️  API usage logs table already exists\n";

        // Check and add missing indexes if they don't exist
        try {
            $connection = Capsule::connection();
            $schemaBuilder = $connection->getSchemaBuilder();

            // Check if date index exists
            $indexes = $connection->select("SHOW INDEX FROM api_usage_logs WHERE Key_name = 'api_usage_logs_date_index'");
            if (empty($indexes)) {
                $schemaBuilder->table('api_usage_logs', function (Blueprint $table) {
                    $table->index(['date'], 'api_usage_logs_date_index');
                });
                echo "✅ Added missing date index to API usage logs table\n";
            }

            // Check if unique constraint exists
            $uniqueIndexes = $connection->select("SHOW INDEX FROM api_usage_logs WHERE Key_name LIKE '%form_api_config_id_date%' AND Non_unique = 0");
            if (empty($uniqueIndexes)) {
                $schemaBuilder->table('api_usage_logs', function (Blueprint $table) {
                    $table->unique(['form_api_config_id', 'date'], 'api_usage_logs_unique');
                });
                echo "✅ Added missing unique constraint to API usage logs table\n";
            }
        } catch (Exception $indexError) {
            echo "⚠️  Index already exists or couldn't be added: " . $indexError->getMessage() . "\n";
        }
    }

    echo "\n🎉 Database migration completed successfully!\n";
    echo "📊 All tables have been created with proper indexes for optimal performance.\n";
    echo "🔒 Foreign key constraints ensure data integrity.\n\n";

    // Show table summary
    $tables = [
        'users',
        'oauth_tokens',
        'connected_sheets',
        'forms',
        'form_submissions',
        'form_api_configs',
        'api_submissions',
        'api_usage_logs'
    ];

    echo "📋 Created Tables Summary:\n";
    foreach ($tables as $table) {
        if (Capsule::schema()->hasTable($table)) {
            $count = Capsule::table($table)->count();
            echo "   ✅ {$table} (Records: {$count})\n";
        }
    }

    echo "\n🚀 Your SheetTree backend is now ready for production!\n";
    echo "📝 Next steps:\n";
    echo "   1. Update your .env file with production values\n";
    echo "   2. Configure your Google OAuth credentials\n";
    echo "   3. Test the API endpoints\n";
    echo "   4. Deploy your frontend application\n\n";
} catch (Exception $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
    echo "💡 Please check your database configuration and try again.\n";
    exit(1);
}
