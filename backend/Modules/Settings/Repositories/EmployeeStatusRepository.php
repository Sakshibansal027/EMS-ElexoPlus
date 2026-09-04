<?php

namespace Modules\Settings\Repositories;

use Modules\Settings\Models\EmployeeStatus;

class EmployeeStatusRepository
{
    public function all(): array { return EmployeeStatus::all(); }
    public function find(string $id): ?array { return EmployeeStatus::find($id); }
    public function create(array $data): array { return EmployeeStatus::create($data); }
    public function update(string $id, array $data): ?array { return EmployeeStatus::update($id, $data); }
    public function delete(string $id): bool { return EmployeeStatus::delete($id); }
}
