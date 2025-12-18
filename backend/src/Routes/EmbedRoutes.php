<?php

namespace App\Routes;

use Slim\App;
use App\Controllers\EmbedController;

class EmbedRoutes
{
    public static function register(App $app): void
    {
        $app->group('/embed', function ($group) {
            // Handle CORS preflight requests for all embed routes
            $group->options('/{routes:.+}', function ($request, $response, $args) {
                return $response;
            });

            // Display embeddable form
            $group->get('/form/{formId}', [EmbedController::class, 'showForm']);

            // Handle form submission from embedded form
            $group->post('/form/{formId}/submit', [EmbedController::class, 'submitForm']);
        });
    }
}
