<?php

namespace Modules\Leave\Repositories;

use Modules\Leave\Models\LeavePolicy;

class LeavePolicyRepository
{
    public function findById(string $id): ?array
    {
        return LeavePolicy::find($id);
    }

    public function findByCode(string $code): ?array
    {
        return LeavePolicy::findByCode($code);
    }

    public function all(bool $activeOnly = false): array
    {
        return LeavePolicy::all($activeOnly);
    }

    public function create(array $data): ?array
    {
        return LeavePolicy::create($data);
    }

    public function update(string $id, array $data): ?array
    {
        return LeavePolicy::update($id, $data);
    }

    public function delete(string $id): bool
    {
        return LeavePolicy::delete($id);
    }
}