<?php

namespace Modules\Settings\Models;

use Core\Database;

class Designation
{
    public static function all(): array
    {
        return Database::connection()->query(
            'SELECT d.designation_id AS id, d.designation_name AS name, d.department_id, d.status,
                    COALESCE(dep.department_name, \'\') AS department
             FROM designations d
             LEFT JOIN departments dep ON dep.department_id = d.department_id
             ORDER BY d.designation_name'
        )->fetchAll();
    }

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT d.designation_id AS id, d.designation_name AS name, d.department_id, d.status,
                    COALESCE(dep.department_name, \'\') AS department
             FROM designations d
             LEFT JOIN departments dep ON dep.department_id = d.department_id
             WHERE d.designation_id = ? LIMIT 1'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): array
    {
        $id = \Modules\Settings\Support\Uuid::generate();
        $stmt = Database::connection()->prepare('INSERT INTO designations (designation_id, designation_name, department_id, status) VALUES (?, ?, ?, ?)');
        $stmt->execute([$id, $data['name'], $data['department_id'] ?? null, $data['status'] ?? 'Active']);
        return self::find($id);
    }

    public static function update(string $id, array $data): ?array
    {
        $sets = [];
        $values = [];
        if (array_key_exists('name', $data)) { $sets[] = 'designation_name = ?'; $values[] = $data['name']; }
        if (array_key_exists('department_id', $data)) { $sets[] = 'department_id = ?'; $values[] = $data['department_id'] ?: null; }
        if (array_key_exists('status', $data)) { $sets[] = 'status = ?'; $values[] = $data['status']; }
        if (!$sets) return self::find($id);
        $values[] = $id;
        Database::connection()->prepare('UPDATE designations SET ' . implode(', ', $sets) . ' WHERE designation_id = ?')->execute($values);
        return self::find($id);
    }

    public static function delete(string $id): bool
    {
        $stmt = Database::connection()->prepare('DELETE FROM designations WHERE designation_id = ?');
        return $stmt->execute([$id]);
    }

    public static function resolveDepartmentId(string $name): ?string
    {
        $stmt = Database::connection()->prepare('SELECT department_id FROM departments WHERE department_name = ? LIMIT 1');
        $stmt->execute([$name]);
        return $stmt->fetchColumn() ?: null;
    }
}
