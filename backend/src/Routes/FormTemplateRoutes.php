<?php

namespace App\Routes;

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\FormTemplateController;

class FormTemplateRoutes
{
    public function register(RouteCollectorProxy $group): void
    {
        // Get all templates
        $group->get('', [FormTemplateController::class, 'getTemplates']);

        // Get template categories
        $group->get('/categories', [FormTemplateController::class, 'getCategories']);

        // Get single template
        $group->get('/{id}', [FormTemplateController::class, 'getTemplate']);

        // Record template usage (requires auth)
        $group->post('/{id}/use', [FormTemplateController::class, 'useTemplate']);
    }
}
