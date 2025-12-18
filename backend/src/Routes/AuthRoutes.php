<?php

namespace App\Routes;

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\AuthController;

class AuthRoutes
{
    public function register(RouteCollectorProxy $group): void
    {
        $group->get('/google', [AuthController::class, 'initiateGoogleAuth']);
        $group->get('/callback', [AuthController::class, 'handleGoogleCallback']);
        $group->post('/refresh', [AuthController::class, 'refreshToken']);
        $group->post('/logout', [AuthController::class, 'logout']);
        $group->get('/status', [AuthController::class, 'checkTokenStatus']);
    }
}
