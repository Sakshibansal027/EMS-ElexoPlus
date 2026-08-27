<?php

use Core\Router;
use Modules\Payroll\Controllers\PayrollController;
use Modules\Payroll\Controllers\PayrollPeriodController;
use Modules\Payroll\Controllers\SalaryStructureController;

Router::group('api', function () {
    Router::group('payroll', function () {
        Router::get('/salary-structures', [SalaryStructureController::class, 'index']);
        Router::post('/salary-structures', [SalaryStructureController::class, 'store']);
        Router::get('/salary-structures/{id}', [SalaryStructureController::class, 'show']);
        Router::put('/salary-structures/{id}', [SalaryStructureController::class, 'update']);
        Router::delete('/salary-structures/{id}', [SalaryStructureController::class, 'delete']);
        Router::post('/salary-structures/{id}/assignments', [SalaryStructureController::class, 'assign']);

        Router::get('/periods', [PayrollPeriodController::class, 'index']);
        Router::post('/periods', [PayrollPeriodController::class, 'store']);
        Router::get('/periods/{id}', [PayrollPeriodController::class, 'show']);
        Router::put('/periods/{id}', [PayrollPeriodController::class, 'update']);
        Router::delete('/periods/{id}', [PayrollPeriodController::class, 'delete']);
        Router::post('/periods/{id}/start', [PayrollPeriodController::class, 'start']);
        Router::post('/periods/{id}/submit', [PayrollPeriodController::class, 'submit']);
        Router::post('/periods/{id}/lock', [PayrollPeriodController::class, 'lock']);

        Router::get('/my-payslips', [PayrollController::class, 'myPayslips']);
        Router::get('/payslips/{id}/download', [PayrollController::class, 'downloadPayslip']);
        Router::get('/dashboard', [PayrollController::class, 'dashboard']);
        Router::get('/reports', [PayrollController::class, 'report']);
        Router::get('/', [PayrollController::class, 'index']);
        Router::post('/', [PayrollController::class, 'generate']);
        Router::get('/{id}', [PayrollController::class, 'show']);
        Router::post('/{id}/process', [PayrollController::class, 'process']);
        Router::post('/{id}/verify', [PayrollController::class, 'verify']);
        Router::post('/{id}/reject', [PayrollController::class, 'reject']);
        Router::post('/{id}/approve', [PayrollController::class, 'approve']);
        Router::post('/{id}/pay', [PayrollController::class, 'pay']);
        Router::post('/{id}/incentives', [PayrollController::class, 'addIncentive']);
        Router::post('/{id}/deductions', [PayrollController::class, 'addDeduction']);
        Router::put('/{id}/incentives/{adjustmentId}', [PayrollController::class, 'updateIncentive']);
        Router::put('/{id}/deductions/{adjustmentId}', [PayrollController::class, 'updateDeduction']);
        Router::delete('/{id}/incentives/{adjustmentId}', [PayrollController::class, 'deleteIncentive']);
        Router::delete('/{id}/deductions/{adjustmentId}', [PayrollController::class, 'deleteDeduction']);
    });
});
