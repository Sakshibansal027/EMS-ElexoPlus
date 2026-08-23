<?php

use Core\Router;
use Modules\Attendance\Controllers\AttendanceController;

Router::group('api', function () {
    Router::group('attendance', function () {
        Router::get('/', [AttendanceController::class, 'findAll']);

        Router::get(
            '/employee/{employee_id}/date/{attendance_date}',
            [AttendanceController::class, 'findByEmployeeAndDate']
        );

        Router::get(
            '/employee/{employee_id}',
            [AttendanceController::class, 'findByEmployee']
        );

        Router::get(
            '/date/{attendance_date}',
            [AttendanceController::class, 'findByDate']
        );

        Router::group('corrections', function () {
            Router::get('/', [AttendanceController::class, 'findAllCorrections']);

            Router::get(
                '/employee/{employee_id}',
                [AttendanceController::class, 'findEmployeeCorrections']
            );

            Router::post('/', [AttendanceController::class, 'createCorrection']);

            Router::patch(
                '/{id}/approve',
                [AttendanceController::class, 'approveCorrection']
            );

            Router::patch(
                '/{id}/reject',
                [AttendanceController::class, 'rejectCorrection']
            );

            Router::get(
                '/{id}',
                [AttendanceController::class, 'findCorrection']
            );
        });

        Router::get('/{id}', [AttendanceController::class, 'find']);
        Router::post('/', [AttendanceController::class, 'create']);
    });
});
