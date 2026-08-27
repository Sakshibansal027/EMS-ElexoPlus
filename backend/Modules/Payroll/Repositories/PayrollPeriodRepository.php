<?php

namespace Modules\Payroll\Repositories;

use Modules\Payroll\Models\PayrollPeriod;

class PayrollPeriodRepository
{
    public function all(): array { return PayrollPeriod::all(); }
    public function find(string $id): ?array { return PayrollPeriod::find($id); }
    public function findByMonth(int $month,int $year): ?array { return PayrollPeriod::findByMonth($month,$year); }
    public function create(array $data): array { return PayrollPeriod::create($data); }
    public function update(string $id,array $data): ?array { return PayrollPeriod::update($id,$data); }
    public function setStatus(string $id,string $status,string $userId): ?array { return PayrollPeriod::setStatus($id,$status,$userId); }
    public function delete(string $id): bool { return PayrollPeriod::delete($id); }
}
