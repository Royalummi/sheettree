<?php

namespace App\Routes;

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\FormController;

class FormRoutes
{
    public function register(RouteCollectorProxy $group): void
    {
        $group->get('', [FormController::class, 'getUserForms']);
        $group->post('', [FormController::class, 'createForm']);
        $group->get('/{id}', [FormController::class, 'getForm']);
        $group->put('/{id}', [FormController::class, 'updateForm']);
        $group->delete('/{id}', [FormController::class, 'deleteForm']);
        $group->post('/{id}/submit', [FormController::class, 'submitForm']);
        $group->get('/{id}/submissions', [FormController::class, 'getFormSubmissions']);
    }
}
