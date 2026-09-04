<?php

namespace Modules\Settings\Repositories;

use Modules\Settings\Models\Department;

class DepartmentRepository
{
    public function all(): array { return Department::all(); }
    public function find(string $id): ?array { return Department::find($id); }
    public function create(array $data): array { return Department::create($data); }
    public function update(string $id, array $data): ?array { return Department::update($id, $data); }
    public function delete(string $id): bool { return Department::delete($id); }
}
