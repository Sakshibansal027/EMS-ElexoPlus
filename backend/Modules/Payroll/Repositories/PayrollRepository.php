<?php

namespace Modules\Payroll\Repositories;

use Modules\Payroll\Models\Payroll;

class PayrollRepository
{
    public function all(?string $periodId=null,?string $employeeId=null): array { return Payroll::all($periodId,$employeeId); }
    public function find(string $id): ?array { return Payroll::find($id); }
    public function findForPeriodEmployee(string $periodId,string $employeeId): ?array { return Payroll::findForPeriodEmployee($periodId,$employeeId); }
    public function create(array $data): array { return Payroll::create($data); }
    public function setStatus(string $id,string $status,string $userId): ?array { return Payroll::setStatus($id,$status,$userId); }
    public function adjustments(string $payrollId,string $type): array { return Payroll::adjustments($payrollId,$type); }
    public function addAdjustment(string $payrollId,string $employeeId,string $type,array $data): array { return Payroll::addAdjustment($payrollId,$employeeId,$type,$data); }
    public function deleteAdjustment(string $id,string $type): bool { return Payroll::deleteAdjustment($id,$type); }
    public function updateAdjustment(string $id,string $type,array $data): ?array { return Payroll::updateAdjustment($id,$type,$data); }
    public function findAdjustment(string $id,string $type): ?array { return Payroll::findAdjustment($id,$type); }
    public function summary(?string $periodId=null): array { return Payroll::summary($periodId); }
    public function countUnapprovedForPeriod(string $periodId): int { return Payroll::countUnapprovedForPeriod($periodId); }
    public function statusCounts(string $periodId): array { return Payroll::statusCounts($periodId); }
    public function report(?string $periodId=null,?string $employeeId=null): array { return Payroll::report($periodId,$employeeId); }
}
