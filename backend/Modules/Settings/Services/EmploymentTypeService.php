<?php

namespace Modules\Settings\Services;

use Modules\Settings\Repositories\EmploymentTypeRepository;

class EmploymentTypeService
{
    public function __construct(private EmploymentTypeRepository $repo) {}

    public function list(): array
    {
        return ['success' => true, 'employmentTypes' => $this->repo->all()];
    }

    public function create(array $data): array
    {
        $validated = $this->validate($data);
        if (isset($validated['error'])) return $validated;

        try {
            $type = $this->repo->create([
                'name' => trim($data['name']),
                'status' => $data['status'] ?? 'Active',
            ]);
            return ['success' => true, 'message' => 'Employment type created.', 'employmentType' => $type];
        } catch (\PDOException $e) {
            $msg = str_contains(strtolower($e->getMessage()), 'duplicate')
                ? 'An employment type with this name already exists.'
                : 'Unable to create employment type.';
            return ['success' => false, 'message' => $msg, 'status' => 422];
        }
    }

    public function update(string $id, array $data): array
    {
        $existing = $this->repo->find($id);
        if (!$existing) return ['success' => false, 'message' => 'Employment type not found.', 'status' => 404];

        $validated = $this->validate($data, true);
        if (isset($validated['error'])) return $validated;

        $mapped = [];
        if (isset($data['name'])) $mapped['name'] = trim($data['name']);
        if (isset($data['status'])) $mapped['status'] = $data['status'];

        try {
            $type = $this->repo->update($id, $mapped);
            return ['success' => true, 'message' => 'Employment type updated.', 'employmentType' => $type];
        } catch (\PDOException $e) {
            $msg = str_contains(strtolower($e->getMessage()), 'duplicate')
                ? 'An employment type with this name already exists.'
                : 'Unable to update employment type.';
            return ['success' => false, 'message' => $msg, 'status' => 422];
        }
    }

    public function delete(string $id): array
    {
        $existing = $this->repo->find($id);
        if (!$existing) return ['success' => false, 'message' => 'Employment type not found.', 'status' => 404];

        try {
            $this->repo->delete($id);
            return ['success' => true, 'message' => 'Employment type deleted.'];
        } catch (\PDOException $e) {
            return ['success' => false, 'message' => 'Cannot delete employment type. It may be in use.', 'status' => 422];
        }
    }

    private function validate(array $data, bool $partial = false): array
    {
        if (!$partial && empty($data['name'])) {
            return ['error' => true, 'success' => false, 'message' => 'Employment type name is required.', 'status' => 422];
        }
        if (isset($data['name']) && trim((string) $data['name']) === '') {
            return ['error' => true, 'success' => false, 'message' => 'Employment type name cannot be empty.', 'status' => 422];
        }
        return [];
    }
}
