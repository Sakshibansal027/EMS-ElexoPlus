<?php

use Core\Router;
use Modules\Leave\Controllers\LeavePolicyController;
use Modules\Leave\Controllers\LeaveRequestController;
use Modules\Leave\Controllers\EmployeeLeaveBalanceController;
use Modules\Leave\Controllers\CompanyHolidayController;
use Modules\Leave\Controllers\LeaveRequestDocumentController;

Router::group('api', function () {
    Router::group('leave', function () {

        // --- Leave Policies (LeavePolicyController) ---
        Router::get('/policies', [LeavePolicyController::class, 'index']);
        Router::get('/policies/{id}', [LeavePolicyController::class, 'show']);
        Router::post('/policies', [LeavePolicyController::class, 'store']);
        Router::put('/policies/{id}', [LeavePolicyController::class, 'update']);
        Router::delete('/policies/{id}', [LeavePolicyController::class, 'destroy']);

        // --- Leave Requests (LeaveRequestController) ---
        // NOTE: '/requests/pending-approvals' is registered BEFORE
        // '/requests/{id}' on purpose. The Router matches routes in
        // registration order (see Router::dispatch's foreach), and
        // '{id}' would otherwise greedily match the literal string
        // "pending-approvals" as if it were an id.
        Router::get('/requests/pending-approvals', [LeaveRequestController::class, 'pendingApprovals']);
        Router::get('/requests/calendar', [LeaveRequestController::class, 'calendar']);
        Router::get('/requests', [LeaveRequestController::class, 'index']);
        Router::get('/requests/{id}', [LeaveRequestController::class, 'show']);
        Router::post('/requests', [LeaveRequestController::class, 'store']);
        Router::post('/requests/{id}/decision', [LeaveRequestController::class, 'decide']);
        Router::post('/requests/{id}/cancel', [LeaveRequestController::class, 'cancel']);

        // --- Leave Request Documents (LeaveRequestDocumentController) ---
        Router::get('/requests/{requestId}/documents', [LeaveRequestDocumentController::class, 'index']);
        Router::post('/requests/{requestId}/documents', [LeaveRequestDocumentController::class, 'store']);
        Router::get('/documents/{id}/download', [LeaveRequestDocumentController::class, 'download']);
        Router::delete('/documents/{id}', [LeaveRequestDocumentController::class, 'destroy']);

        // --- Employee Leave Balances (EmployeeLeaveBalanceController) ---
        Router::get('/balances', [EmployeeLeaveBalanceController::class, 'index']);
        Router::get('/balances/{policyId}', [EmployeeLeaveBalanceController::class, 'show']);
        Router::post('/balances/allocate', [EmployeeLeaveBalanceController::class, 'allocate']);
        Router::post('/balances/carry-forward', [EmployeeLeaveBalanceController::class, 'carryForward']);

        // --- Company Holidays (CompanyHolidayController) ---
        Router::get('/holidays', [CompanyHolidayController::class, 'index']);
        Router::get('/holidays/{id}', [CompanyHolidayController::class, 'show']);
        Router::post('/holidays', [CompanyHolidayController::class, 'store']);
        Router::put('/holidays/{id}', [CompanyHolidayController::class, 'update']);
        Router::delete('/holidays/{id}', [CompanyHolidayController::class, 'destroy']);
    });
});
