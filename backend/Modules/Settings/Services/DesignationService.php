<?php

namespace Modules\Settings\Services;

use Modules\Settings\Repositories\DesignationRepository;

class DesignationService
{
    public function __construct(private DesignationRepository $repo) {}

    public function list(): array
    {
        return ['success' => true, 'designations' => $this->repo->all()];
    }

    public function create(array $data): array
    {
        $validated = $this->validate($data);
        if (isset($validated['error'])) return $validated;

        $departmentId = null;
        if (!empty($data['department'])) {
            $departmentId = $this->repo->resolveDepartmentId($data['department']);
        }
        if (!empty($data['department_id'])) {
            $departmentId = $data['department_id'];
        }

        try {
            $desig = $this->repo->create([
                'name' => trim($data['name']),
                'department_id' => $departmentId,
            ]);
            return ['success' => true, 'message' => 'Designation created.', 'designation' => $desig];
        } catch (\PDOException $e) {
            $msg = str_contains(strtolower($e->getMessage()), 'duplicate')
                ? 'A designation with this name already exists.'
                : 'Unable to create designation.';
            return ['success' => false, 'message' => $msg, 'status' => 422];
        }
    }

    public function update(string $id, array $data): array
    {
        $existing = $this->repo->find($id);
        if (!$existing) return ['success' => false, 'message' => 'Designation not found.', 'status' => 404];

        $validated = $this->validate($data, true);
        if (isset($validated['error'])) return $validated;

        $mapped = [];
        if (isset($data['name'])) $mapped['name'] = trim($data['name']);
        if (isset($data['department'])) {
            $mapped['department_id'] = $this->repo->resolveDepartmentId($data['department']);
        }
        if (isset($data['department_id'])) {
            $mapped['department_id'] = $data['department_id'];
        }

        try {
            $desig = $this->repo->update($id, $mapped);
            return ['success' => true, 'message' => 'Designation updated.', 'designation' => $desig];
        } catch (\PDOException $e) {
            $msg = str_contains(strtolower($e->getMessage()), 'duplicate')
                ? 'A designation with this name already exists.'
                : 'Unable to update designation.';
            return ['success' => false, 'message' => $msg, 'status' => 422];
        }
    }

    public function delete(string $id): array
    {
        $existing = $this->repo->find($id);
        if (!$existing) return ['success' => false, 'message' => 'Designation not found.', 'status' => 404];

        try {
            $this->repo->delete($id);
            return ['success' => true, 'message' => 'Designation deleted.'];
        } catch (\PDOException $e) {
            return ['success' => false, 'message' => 'Cannot delete designation. It may be in use.', 'status' => 422];
        }
    }

    private function validate(array $data, bool $partial = false): array
    {
        if (!$partial && empty($data['name'])) {
            return ['error' => true, 'success' => false, 'message' => 'Designation name is required.', 'status' => 422];
        }
        if (isset($data['name']) && trim((string) $data['name']) === '') {
            return ['error' => true, 'success' => false, 'message' => 'Designation name cannot be empty.', 'status' => 422];
        }
        return [];
    }
}
