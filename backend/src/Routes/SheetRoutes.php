<?php

namespace App\Routes;

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\SheetController;

class SheetRoutes
{
    public function register(RouteCollectorProxy $group): void
    {
        $group->get('', [SheetController::class, 'getUserSheets']);
        $group->post('/connect', [SheetController::class, 'connectSheet']);
        $group->post('/connect/picker', [SheetController::class, 'connectSheetFromPicker']);
        $group->delete('/{id}', [SheetController::class, 'disconnectSheet']);
        $group->get('/{id}/preview', [SheetController::class, 'previewSheet']);
    }
}
