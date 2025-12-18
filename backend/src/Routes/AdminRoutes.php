<?php

namespace App\Routes;

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\AdminController;

class AdminRoutes
{
    public function register(RouteCollectorProxy $group): void
    {
        $group->get('/users', [AdminController::class, 'getAllUsers']);
        $group->get('/users/{id}', [AdminController::class, 'getUser']);
        $group->put('/users/{id}', [AdminController::class, 'updateUser']);
        $group->delete('/users/{id}', [AdminController::class, 'deleteUser']);
        $group->get('/sheets', [AdminController::class, 'getAllSheets']);
        $group->get('/forms', [AdminController::class, 'getAllForms']);
        $group->get('/analytics', [AdminController::class, 'getAnalytics']);
    }
}
