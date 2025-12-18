<?php

namespace App\Routes;

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\UserController;

class UserRoutes
{
    public function register(RouteCollectorProxy $group): void
    {
        // Profile management
        $group->get('/profile', [UserController::class, 'getProfile']);
        $group->put('/profile', [UserController::class, 'updateProfile']);

        // Dashboard
        $group->get('/dashboard', [UserController::class, 'getDashboard']);

        // Account management
        $group->delete('/account', [UserController::class, 'deleteAccount']);

        // OAuth management
        $group->get('/oauth/status', [UserController::class, 'getOAuthStatus']);
        $group->delete('/oauth/revoke', [UserController::class, 'revokeOAuth']);

        // Notification preferences
        $group->get('/notification-preferences', [UserController::class, 'getNotificationPreferences']);
        $group->put('/notification-preferences', [UserController::class, 'updateNotificationPreferences']);
        $group->post('/test-email', [UserController::class, 'sendTestEmail']);
    }
}
