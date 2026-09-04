<?php

namespace Modules\Settings\Services;

use Modules\Settings\Repositories\DepartmentRepository;

class DepartmentService
{
    public function __construct(private DepartmentRepository $repo) {}

    public function list(): array
    {
        return ['success' => true, 'departments' => $this->repo->all()];
    }

    public function create(array $data): array
    {
        $validated = $this->validate($data);
        if (isset($validated['error'])) return $validated;

        try {
            $dept = $this->repo->create([
                'name' => trim($data['name']),
                'head' => !empty($data['head']) ? trim($data['head']) : null,
                'status' => $data['status'] ?? 'Active',
            ]);
            return ['success' => true, 'message' => 'Department created.', 'department' => $dept];
        } catch (\PDOException $e) {
            $msg = str_contains(strtolower($e->getMessage()), 'duplicate')
                ? 'A department with this name already exists.'
                : 'Unable to create department.';
            return ['success' => false, 'message' => $msg, 'status' => 422];
        }
    }

    public function update(string $id, array $data): array
    {
        $existing = $this->repo->find($id);
        if (!$existing) return ['success' => false, 'message' => 'Department not found.', 'status' => 404];

        $validated = $this->validate($data, true);
        if (isset($validated['error'])) return $validated;

        $mapped = [];
        if (isset($data['name'])) $mapped['name'] = trim($data['name']);
        if (array_key_exists('head', $data)) $mapped['head'] = !empty($data['head']) ? trim($data['head']) : null;
        if (isset($data['status'])) $mapped['status'] = $data['status'];

        try {
            $dept = $this->repo->update($id, $mapped);
            return ['success' => true, 'message' => 'Department updated.', 'department' => $dept];
        } catch (\PDOException $e) {
            $msg = str_contains(strtolower($e->getMessage()), 'duplicate')
                ? 'A department with this name already exists.'
                : 'Unable to update department.';
            return ['success' => false, 'message' => $msg, 'status' => 422];
        }
    }

    public function delete(string $id): array
    {
        $existing = $this->repo->find($id);
        if (!$existing) return ['success' => false, 'message' => 'Department not found.', 'status' => 404];

        try {
            $this->repo->delete($id);
            return ['success' => true, 'message' => 'Department deleted.'];
        } catch (\PDOException $e) {
            return ['success' => false, 'message' => 'Cannot delete department. It may be in use.', 'status' => 422];
        }
    }

    private function validate(array $data, bool $partial = false): array
    {
        if (!$partial && empty($data['name'])) {
            return ['error' => true, 'success' => false, 'message' => 'Department name is required.', 'status' => 422];
        }
        if (isset($data['name']) && trim((string) $data['name']) === '') {
            return ['error' => true, 'success' => false, 'message' => 'Department name cannot be empty.', 'status' => 422];
        }
        return [];
    }
}
