<?php

use Core\Router;
use Modules\Attendance\Controllers\AttendanceController;

Router::group('api', function () {
    Router::group('attendance', function () {
        Router::get('/', [AttendanceController::class, 'findAll']);
        Router::get('/{id}', [AttendanceController::class, 'find']);
        Router::get('/employee/{employee_id}', [AttendanceController::class, 'findByEmployee']);
        Router::get('/date/{attendance_date}', [AttendanceController::class, 'findByDate']);
        Router::get(
            '/employee/{employee_id}/date/{attendance_date}',
            [AttendanceController::class, 'findByEmployeeAndDate']
        );
        Router::post('/', [AttendanceController::class, 'create']);
    });
});