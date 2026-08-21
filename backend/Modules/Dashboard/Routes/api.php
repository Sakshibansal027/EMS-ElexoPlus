<?php

use Core\Router;
use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Dashboard\Controllers\DashboardController;

Router::group('api', function () {

    Router::group('dashboard', function () {

        Router::get(
            '/',
            [DashboardController::class, 'index'],
            [AuthMiddleware::class]
        );

    });

});