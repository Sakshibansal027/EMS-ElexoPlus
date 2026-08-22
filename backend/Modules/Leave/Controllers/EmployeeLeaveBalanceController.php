<?php

namespace Modules\Leave\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Leave\Repositories\EmployeeLeaveBalanceRepository;
use Modules\Leave\Repositories\LeavePolicyRepository;
use Modules\Leave\Services\EmployeeLeaveBalanceService;
use Modules\Authentication\Support\Request;

class EmployeeLeaveBalanceController
{
    private EmployeeLeaveBalanceService $balanceService;

    public function __construct()
    {
        $this->balanceService = new EmployeeLeaveBalanceService(
            new EmployeeLeaveBalanceRepository(),
            new LeavePolicyRepository()
        );
    }

    /**
     * GET /leave/balances?year=2026
     * The logged-in employee's own balance dashboard — every policy,
     * one year. Defaults to the current year if none is given.
     */
    public function index(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $employeeId = $auth['user']['employee_id'];
        $year = (int) Request::input('year', date('Y'));

        return $this->balanceService->getForEmployee($employeeId, $year);
    }

    /**
     * GET /leave/balances/{policyId}?year=2026
     * A single policy's balance — e.g. for the "apply leave" form to
     * show "you have X days left" once a policy is selected.
     */
    public function show(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $employeeId = $auth['user']['employee_id'];
        $year = (int) Request::input('year', date('Y'));

        return $this->balanceService->getForEmployeePolicy($employeeId, $params['policyId'], $year);
    }

    /**
          * POST /leave/balances/allocate
     * Admin/HR only, enforced by RoleMiddleware — allocates a year's
     * balance for one employee against one policy.
     */
    public function allocate(array $params): array
    {
        $auth = RoleMiddleware::handle(['Admin', 'HR']);
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $employeeId = (string) Request::input('employee_id', '');
        $leavePolicyId = (string) Request::input('leave_policy_id', '');
        $year = (int) Request::input('year', date('Y'));
        $joiningDate = Request::input('joining_date', null);

        if ($employeeId === '' || $leavePolicyId === '') {
            return ['success' => false, 'message' => 'employee_id and leave_policy_id are required.', 'status' => 422];
        }

        return $this->balanceService->allocate($employeeId, $leavePolicyId, $year, $joiningDate);
    }

    /**
     * POST /leave/balances/carry-forward
     * Admin/HR only, enforced by RoleMiddleware (or a scheduled job
     * calling the service directly) — rolls unused days from
     * fromYear into toYear.
     */
    public function carryForward(array $params): array
    {
        $auth = RoleMiddleware::handle(['Admin', 'HR']);
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $employeeId = (string) Request::input('employee_id', '');
        $leavePolicyId = (string) Request::input('leave_policy_id', '');
        $fromYear = (int) Request::input('from_year', 0);
        $toYear = (int) Request::input('to_year', 0);

        if ($employeeId === '' || $leavePolicyId === '' || $fromYear === 0 || $toYear === 0) {
            return ['success' => false, 'message' => 'employee_id, leave_policy_id, from_year and to_year are required.', 'status' => 422];
        }

        return $this->balanceService->carryForward($employeeId, $leavePolicyId, $fromYear, $toYear);
    }
}
