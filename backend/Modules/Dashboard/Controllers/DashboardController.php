<?php

namespace Modules\Dashboard\Controllers;

use Modules\Dashboard\Services\DashboardService;
use Modules\Authentication\Middleware\AuthMiddleware;

class DashboardController
{
    private DashboardService $dashboardService;

    public function __construct()
    {
        $this->dashboardService = new DashboardService();
    }

    public function index(array $params): array
    {
        $auth = AuthMiddleware::handle();

        if (isset($auth['error'])) {
            return [
                'success' => false,
                'message' => $auth['error'],
                'status' => $auth['status']
            ];
        }

        return $this->dashboardService->getDashboard(
            $auth['user']
        );
    }
}
