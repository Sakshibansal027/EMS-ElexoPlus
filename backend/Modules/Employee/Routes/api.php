<?php

use Core\Router;
use Modules\Employee\Controllers\EmployeeController;

Router::group('api', function () {
    Router::group('employees', function () {
        Router::get('/options', [EmployeeController::class, 'options']);
        Router::get('/', [EmployeeController::class, 'index']);
        Router::post('/', [EmployeeController::class, 'store']);
        Router::get('/{id}', [EmployeeController::class, 'show']);
        Router::put('/{id}', [EmployeeController::class, 'update']);
        Router::delete('/{id}', [EmployeeController::class, 'destroy']);
    });
});
