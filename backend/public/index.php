<?php

use DI\Container;
use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;
use App\Middleware\CorsMiddleware;
use App\Middleware\AuthMiddleware;
use App\Routes\AuthRoutes;
use App\Routes\UserRoutes;
use App\Routes\SheetRoutes;
use App\Routes\AdminRoutes;
use App\Routes\FormRoutes;
use App\Routes\FormTemplateRoutes;
use App\Routes\ExternalApiRoutes;
use App\Routes\EmbedRoutes;
use App\Routes\ApiConfigRoutes;
use App\Controllers\AuthController;
use App\Controllers\AdminController;
use App\Controllers\FormController;
use App\Controllers\UserController;
use App\Controllers\SheetController;
use App\Controllers\ExternalApiController;
use App\Controllers\EmbedController;
use App\Controllers\ApiConfigController;
use App\Controllers\NotificationController;
use App\Controllers\FormTemplateController;
use Google\Client as Google_Client;
use Google\Service\Sheets as Google_Service_Sheets;
use Illuminate\Database\Capsule\Manager as Capsule;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Create Container
$container = new Container();

// Database configuration
$container->set('db', function () {
    $capsule = new Illuminate\Database\Capsule\Manager;
    $capsule->addConnection([
        'driver' => 'mysql',
        'host' => $_ENV['DB_HOST'],
        'database' => $_ENV['DB_NAME'],
        'username' => $_ENV['DB_USERNAME'],
        'password' => $_ENV['DB_PASSWORD'],
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
    ]);
    $capsule->setAsGlobal();
    $capsule->bootEloquent();
    return $capsule;
});

// Google Client configuration
$container->set('google_client', function () {
    $client = new Google_Client();
    $client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
    $client->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);
    $client->setRedirectUri($_ENV['GOOGLE_REDIRECT_URI']);
    $client->addScope([
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
    ]);
    $client->setAccessType('offline');
    $client->setIncludeGrantedScopes(true);
    $client->setPrompt('consent');
    return $client;
});

// Register Controllers
$container->set(\App\Controllers\AuthController::class, function ($container) {
    return new \App\Controllers\AuthController($container->get('google_client'));
});

$container->set(\App\Controllers\AdminController::class, function ($container) {
    return new \App\Controllers\AdminController();
});

$container->set(\App\Controllers\FormController::class, function ($container) {
    return new \App\Controllers\FormController();
});

$container->set(\App\Controllers\UserController::class, function ($container) {
    return new \App\Controllers\UserController();
});

$container->set(\App\Controllers\SheetController::class, function ($container) {
    return new \App\Controllers\SheetController();
});

$container->set(\App\Controllers\ExternalApiController::class, function ($container) {
    return new \App\Controllers\ExternalApiController();
});

$container->set(\App\Controllers\ApiConfigController::class, function ($container) {
    return new \App\Controllers\ApiConfigController();
});

$container->set(\App\Controllers\NotificationController::class, function ($container) {
    return new \App\Controllers\NotificationController();
});

$container->set(\App\Controllers\FormTemplateController::class, function ($container) {
    return new \App\Controllers\FormTemplateController();
});

// Set container to create App with on AppFactory
AppFactory::setContainer($container);
$app = AppFactory::create();

// Initialize database
$container->get('db');

// Add Error Middleware with environment-specific settings
$displayErrorDetails = $_ENV['APP_ENV'] === 'development';
$logErrors = true;
$logErrorDetails = $_ENV['APP_ENV'] === 'development';

$errorMiddleware = $app->addErrorMiddleware($displayErrorDetails, $logErrors, $logErrorDetails);

// Set error handler to return JSON responses
$errorHandler = $errorMiddleware->getDefaultErrorHandler();
$errorHandler->forceContentType('application/json');

// Add CORS Middleware
$app->add(new CorsMiddleware());

// Add Body Parsing Middleware
$app->addBodyParsingMiddleware();

// Routes
$app->group('/auth', function ($group) {
    (new AuthRoutes())->register($group);
});

$app->group('/user', function ($group) {
    (new UserRoutes())->register($group);
})->add(new AuthMiddleware());

$app->group('/sheets', function ($group) {
    (new SheetRoutes())->register($group);
})->add(new AuthMiddleware());

// Public form routes (no auth required) - using singular "form" to match frontend
$app->group('/form', function ($group) {
    $group->get('/{id}', [FormController::class, 'getForm']);
    $group->post('/{id}/submit', [FormController::class, 'submitForm']);
});

// Protected form routes (auth required) - using plural "forms" for admin
$app->group('/forms', function ($group) {
    $group->get('', [FormController::class, 'getUserForms']);
    $group->get('/{id}', [FormController::class, 'getForm']);
    $group->post('', [FormController::class, 'createForm']);
    $group->put('/{id}', [FormController::class, 'updateForm']);
    $group->delete('/{id}', [FormController::class, 'deleteForm']);
    $group->get('/{id}/submissions', [FormController::class, 'getFormSubmissions']);
})->add(new AuthMiddleware());

$app->group('/notifications', function ($group) {
    $group->get('', [NotificationController::class, 'getNotifications']);
    $group->put('/read-all', [NotificationController::class, 'markAllAsRead']);
    $group->put('/{id}/read', [NotificationController::class, 'markAsRead']);
    $group->delete('/{id}', [NotificationController::class, 'deleteNotification']);
    $group->delete('', [NotificationController::class, 'deleteAll']);
})->add(new AuthMiddleware());

// Form templates routes (public - no auth required)
$app->group('/templates', function ($group) {
    (new FormTemplateRoutes())->register($group);
});

$app->group('/admin', function ($group) {
    (new AdminRoutes())->register($group);
})->add(new AuthMiddleware());

// External API routes for public form submissions
ExternalApiRoutes::register($app);

// Embed routes for iframe forms (no auth required)
EmbedRoutes::register($app);

// API Configuration routes for authenticated users
ApiConfigRoutes::register($app);

// Health check route
$app->get('/', function ($request, $response, $args) {
    $response->getBody()->write('SheetTree API is running!');
    return $response->withHeader('Content-Type', 'application/json');
});

$app->run();
