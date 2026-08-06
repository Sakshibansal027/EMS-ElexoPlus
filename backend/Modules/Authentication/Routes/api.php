<?php

use Core\Router;
use Modules\Authentication\Controllers\AuthController;

Router::get('/', function () {
    return ['success' => true, 'message' => 'EMS ElexoPlus API', 'endpoints' => ['GET /api/health', 'GET /api/routes']];
});

Router::group('api', function () {
    Router::get('/health', function () {
        return ['success' => true, 'data' => ['status' => 'healthy', 'time' => date('Y-m-d H:i:s')]];
    });

    Router::group('auth', function () {
        Router::post('/login', [AuthController::class, 'login']);
        Router::get('/me', [AuthController::class, 'me']);
        Router::post('/logout', [AuthController::class, 'logout']);
        Router::post('/refresh', [AuthController::class, 'refresh']);
        Router::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Router::post('/reset-password', [AuthController::class, 'resetPassword']);
    });
});
