<?php

namespace Modules\Payroll\Repositories;

use Modules\Payroll\Models\Payslip;

class PayslipRepository
{
    public function find(string $id): ?array { return Payslip::find($id); }
    public function findByPayroll(string $payrollId): ?array { return Payslip::findByPayroll($payrollId); }
    public function forEmployee(string $employeeId): array { return Payslip::forEmployee($employeeId); }
    public function create(string $payrollId,string $employeeId,string $number): array { return Payslip::create($payrollId,$employeeId,$number); }
}
