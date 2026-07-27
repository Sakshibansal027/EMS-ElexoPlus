<?php

use Core\Router;

Router::get('/', function () {
    return ['success' => true, 'message' => 'EMS ElexoPlus API', 'endpoints' => ['GET /api/health', 'GET /api/routes']];
});

Router::group('api', function () {
    Router::get('/health', function () {
        return ['success' => true, 'data' => ['status' => 'healthy', 'time' => date('Y-m-d H:i:s')]];
    });
});
