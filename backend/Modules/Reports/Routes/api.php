<?php

use Core\Router;
use Modules\Reports\Controllers\ReportController;

Router::group('api', function () {
    Router::group('reports', function () {
        Router::get('/attendance', [ReportController::class, 'attendance']);
        Router::get('/sales', [ReportController::class, 'sales']);
        Router::get('/employees', [ReportController::class, 'employees']);
        Router::get('/asm', [ReportController::class, 'asm']);
        Router::get('/metrics', [ReportController::class, 'metrics']);
        Router::get('/charts', [ReportController::class, 'charts']);
    });
});