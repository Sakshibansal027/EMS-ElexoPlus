<?php

use Core\Router;
use Modules\Settings\Controllers\SettingsController;

Router::group('api', function () {
    Router::group('settings', function () {
        // Company Settings
        Router::get('/company', [SettingsController::class, 'getCompanySettings']);
        Router::put('/company', [SettingsController::class, 'updateCompanySettings']);

        // Departments
        Router::get('/departments', [SettingsController::class, 'listDepartments']);
        Router::post('/departments', [SettingsController::class, 'createDepartment']);
        Router::put('/departments/{id}', [SettingsController::class, 'updateDepartment']);
        Router::delete('/departments/{id}', [SettingsController::class, 'deleteDepartment']);

        // Designations
        Router::get('/designations', [SettingsController::class, 'listDesignations']);
        Router::post('/designations', [SettingsController::class, 'createDesignation']);
        Router::put('/designations/{id}', [SettingsController::class, 'updateDesignation']);
        Router::delete('/designations/{id}', [SettingsController::class, 'deleteDesignation']);

        // Employment Types
        Router::get('/employment-types', [SettingsController::class, 'listEmploymentTypes']);
        Router::post('/employment-types', [SettingsController::class, 'createEmploymentType']);
        Router::put('/employment-types/{id}', [SettingsController::class, 'updateEmploymentType']);
        Router::delete('/employment-types/{id}', [SettingsController::class, 'deleteEmploymentType']);

        // Employee Statuses
        Router::get('/employee-statuses', [SettingsController::class, 'listEmployeeStatuses']);
        Router::post('/employee-statuses', [SettingsController::class, 'createEmployeeStatus']);
        Router::put('/employee-statuses/{id}', [SettingsController::class, 'updateEmployeeStatus']);
        Router::delete('/employee-statuses/{id}', [SettingsController::class, 'deleteEmployeeStatus']);

        // User Preferences
        Router::get('/preferences', [SettingsController::class, 'getPreferences']);
        Router::put('/preferences', [SettingsController::class, 'updatePreferences']);
    });
});
