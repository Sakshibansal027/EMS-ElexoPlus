<?php

use Core\Router;
use Modules\Sales\Controllers\SalesController;

Router::group('api', function () {
    Router::group('sales', function () {
        Router::get('/leads', [SalesController::class, 'leads']);
        Router::post('/leads', [SalesController::class, 'storeLead']);
        Router::put('/leads/{id}', [SalesController::class, 'updateLead']);
        Router::post('/leads/{id}/activities', [SalesController::class, 'activities']);
        Router::get('/dashboard', [SalesController::class, 'dashboard']);
        Router::get('/orders', [SalesController::class, 'orders']);
        Router::put('/orders/{id}/status', [SalesController::class, 'updateOrderStatus']);
        Router::get('/territories', [SalesController::class, 'territories']);
        Router::get('/targets', [SalesController::class, 'targets']);
        Router::post('/targets', [SalesController::class, 'storeTarget']);
        Router::put('/targets/{id}', [SalesController::class, 'updateTarget']);
        Router::get('/visits', [SalesController::class, 'visits']);
        Router::get('/expenses', [SalesController::class, 'expenses']);
        Router::get('/daily-reports', [SalesController::class, 'reports']);
        Router::put('/daily-reports/{id}/feedback', [SalesController::class, 'updateReportFeedback']);
        Router::put('/orders/{id}/territory', [SalesController::class, 'assignOrderTerritory']);
    });
});
