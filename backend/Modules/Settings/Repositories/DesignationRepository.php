<?php

namespace Modules\Settings\Repositories;

use Modules\Settings\Models\Designation;

class DesignationRepository
{
    public function all(): array { return Designation::all(); }
    public function find(string $id): ?array { return Designation::find($id); }
    public function create(array $data): array { return Designation::create($data); }
    public function update(string $id, array $data): ?array { return Designation::update($id, $data); }
    public function delete(string $id): bool { return Designation::delete($id); }
    public function resolveDepartmentId(string $name): ?string { return Designation::resolveDepartmentId($name); }
}
