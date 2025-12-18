<?php

namespace App\Routes;

use Slim\App;
use App\Controllers\ApiConfigController;
use App\Middleware\AuthMiddleware;

class ApiConfigRoutes
{
    public static function register(App $app): void
    {
        $app->group('/api/user', function ($group) {

            // API Configuration management
            $group->get('/api-configs', [ApiConfigController::class, 'getUserApiConfigs']);
            $group->post('/api-configs', [ApiConfigController::class, 'createApiConfig']);
            $group->put('/api-configs/{id}', [ApiConfigController::class, 'updateApiConfig']);
            $group->delete('/api-configs/{id}', [ApiConfigController::class, 'deleteApiConfig']);

            // API Statistics and monitoring
            $group->get('/api-configs/{id}/stats', [ApiConfigController::class, 'getApiStats']);

            // API Key management
            $group->post('/api-configs/{id}/regenerate-key', [ApiConfigController::class, 'regenerateApiKey']);
        })->add(new AuthMiddleware()); // Require authentication for all API config routes
    }
}
