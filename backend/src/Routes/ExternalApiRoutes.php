<?php

namespace App\Routes;

use Slim\App;
use App\Controllers\ExternalApiController;
use App\Controllers\ApiDocumentationController;
use App\Middleware\CorsMiddleware;

class ExternalApiRoutes
{
    public static function register(App $app): void
    {
        $app->group('/api/external', function ($group) {

            // Handle CORS preflight requests
            $group->options('/{routes:.+}', function ($request, $response, $args) {
                return $response;
            });

            // External form submission endpoint
            $group->post('/submit/{apiHash}', [ExternalApiController::class, 'submitForm']);

            // API configuration endpoint (for documentation)
            $group->get('/config/{apiHash}', [ExternalApiController::class, 'getApiConfig']);
        })->add(new CorsMiddleware()); // Add CORS middleware to all external API routes

        // Documentation endpoint (no CORS needed for HTML page)
        $app->get('/api/docs/{apiHash}', [ApiDocumentationController::class, 'generateDocumentation']);
    }
}
