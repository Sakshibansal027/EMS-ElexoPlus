<?php

use Core\Router;
use Modules\Attendance\Controllers\AttendanceController;

Router::group('api', function () {
    Router::group('attendance', function () {
        Router::get('/overview', [AttendanceController::class, 'overview']);
        Router::get('/me/today', [AttendanceController::class, 'myToday']);
        Router::get('/notifications', [AttendanceController::class, 'notifications']);
        Router::post('/me/check-in', [AttendanceController::class, 'checkIn']);
        Router::post('/me/check-out', [AttendanceController::class, 'checkOut']);
        Router::post('/me/break/start', [AttendanceController::class, 'startBreak']);
        Router::post('/me/break/end', [AttendanceController::class, 'endBreak']);
        Router::patch('/records/{id}', [AttendanceController::class, 'updateRecord']);
        Router::get('/corrections', [AttendanceController::class, 'corrections']);
        Router::post('/corrections', [AttendanceController::class, 'createCorrection']);
        Router::post('/corrections/{id}/decision', [AttendanceController::class, 'decideCorrection']);
    });
});
