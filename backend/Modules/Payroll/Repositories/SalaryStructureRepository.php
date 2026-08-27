<?php

namespace Modules\Payroll\Repositories;

use Modules\Payroll\Models\SalaryStructure;

class SalaryStructureRepository
{
    public function all(bool $activeOnly=false): array { return SalaryStructure::all($activeOnly); }
    public function find(string $id): ?array { return SalaryStructure::find($id); }
    public function findByCode(string $code): ?array { return SalaryStructure::findByCode($code); }
    public function create(array $data): array { return SalaryStructure::create($data); }
    public function update(string $id,array $data): ?array { return SalaryStructure::update($id,$data); }
    public function delete(string $id): bool { return SalaryStructure::delete($id); }
    public function usage(string $id): array { return SalaryStructure::usage($id); }
    public function assignments(string $id): array { return SalaryStructure::assignments($id); }
    public function assign(string $structureId,string $employeeId,string $effectiveFrom): array { return SalaryStructure::assign($structureId,$employeeId,$effectiveFrom); }
    public function activeForEmployee(string $employeeId,string $date): ?array { return SalaryStructure::activeForEmployee($employeeId,$date); }
}
