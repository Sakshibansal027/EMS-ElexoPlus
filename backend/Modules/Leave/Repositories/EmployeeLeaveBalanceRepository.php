<?php

namespace Modules\Leave\Repositories;

use Modules\Leave\Models\EmployeeLeaveBalance;

class EmployeeLeaveBalanceRepository
{
    public function findById(string $id): ?array
    {
        return EmployeeLeaveBalance::find($id);
    }

    public function findForEmployeeYear(string $employeeId, string $leavePolicyId, int $year): ?array
    {
        return EmployeeLeaveBalance::findForEmployeeYear($employeeId, $leavePolicyId, $year);
    }

    public function findAllForEmployee(string $employeeId, int $year): array
    {
        return EmployeeLeaveBalance::allForEmployee($employeeId, $year);
    }

    public function create(array $data): ?array
    {
        return EmployeeLeaveBalance::create($data);
    }

    public function deductDays(string $id, float $days): ?array
    {
        return EmployeeLeaveBalance::deductDays($id, $days);
    }

    public function restoreDays(string $id, float $days): ?array
    {
        return EmployeeLeaveBalance::restoreDays($id, $days);
    }
}