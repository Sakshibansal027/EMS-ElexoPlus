<?php

namespace Modules\Settings\Repositories;

use Modules\Settings\Models\EmploymentType;

class EmploymentTypeRepository
{
    public function all(): array { return EmploymentType::all(); }
    public function find(string $id): ?array { return EmploymentType::find($id); }
    public function create(array $data): array { return EmploymentType::create($data); }
    public function update(string $id, array $data): ?array { return EmploymentType::update($id, $data); }
    public function delete(string $id): bool { return EmploymentType::delete($id); }
}
