<?php

namespace Modules\Settings\Services;

use Modules\Settings\Repositories\EmployeeStatusRepository;

class EmployeeStatusService
{
    public function __construct(private EmployeeStatusRepository $repo) {}

    public function list(): array
    {
        return ['success' => true, 'statuses' => $this->repo->all()];
    }

    public function create(array $data): array
    {
        $validated = $this->validate($data);
        if (isset($validated['error'])) return $validated;

        try {
            $status = $this->repo->create([
                'name' => trim($data['name']),
                'color' => $data['color'] ?? '#2ecc71',
            ]);
            return ['success' => true, 'message' => 'Employee status created.', 'status_item' => $status];
        } catch (\PDOException $e) {
            $msg = str_contains(strtolower($e->getMessage()), 'duplicate')
                ? 'An employee status with this name already exists.'
                : 'Unable to create employee status.';
            return ['success' => false, 'message' => $msg, 'status' => 422];
        }
    }

    public function update(string $id, array $data): array
    {
        $existing = $this->repo->find($id);
        if (!$existing) return ['success' => false, 'message' => 'Employee status not found.', 'status' => 404];

        $validated = $this->validate($data, true);
        if (isset($validated['error'])) return $validated;

        $mapped = [];
        if (isset($data['name'])) $mapped['name'] = trim($data['name']);
        if (isset($data['color'])) $mapped['color'] = $data['color'];

        try {
            $status = $this->repo->update($id, $mapped);
            return ['success' => true, 'message' => 'Employee status updated.', 'status_item' => $status];
        } catch (\PDOException $e) {
            $msg = str_contains(strtolower($e->getMessage()), 'duplicate')
                ? 'An employee status with this name already exists.'
                : 'Unable to update employee status.';
            return ['success' => false, 'message' => $msg, 'status' => 422];
        }
    }

    public function delete(string $id): array
    {
        $existing = $this->repo->find($id);
        if (!$existing) return ['success' => false, 'message' => 'Employee status not found.', 'status' => 404];

        try {
            $this->repo->delete($id);
            return ['success' => true, 'message' => 'Employee status deleted.'];
        } catch (\PDOException $e) {
            return ['success' => false, 'message' => 'Cannot delete employee status. It may be in use.', 'status' => 422];
        }
    }

    private function validate(array $data, bool $partial = false): array
    {
        if (!$partial && empty($data['name'])) {
            return ['error' => true, 'success' => false, 'message' => 'Status name is required.', 'status' => 422];
        }
        if (isset($data['name']) && trim((string) $data['name']) === '') {
            return ['error' => true, 'success' => false, 'message' => 'Status name cannot be empty.', 'status' => 422];
        }
        return [];
    }
}
