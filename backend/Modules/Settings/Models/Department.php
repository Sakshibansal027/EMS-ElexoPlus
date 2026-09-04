<?php

namespace Modules\Settings\Models;

use Core\Database;

class Department
{
    public static function all(): array
    {
        return Database::connection()->query(
            'SELECT department_id AS id, department_name AS name, head, status
             FROM departments ORDER BY department_name'
        )->fetchAll();
    }

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT department_id AS id, department_name AS name, head, status FROM departments WHERE department_id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): array
    {
        $id = \Modules\Settings\Support\Uuid::generate();
        $stmt = Database::connection()->prepare('INSERT INTO departments (department_id, department_name, head, status) VALUES (?, ?, ?, ?)');
        $stmt->execute([$id, $data['name'], $data['head'] ?? null, $data['status'] ?? 'Active']);
        return self::find($id);
    }

    public static function update(string $id, array $data): ?array
    {
        $sets = [];
        $values = [];
        if (array_key_exists('name', $data)) { $sets[] = 'department_name = ?'; $values[] = $data['name']; }
        if (array_key_exists('head', $data)) { $sets[] = 'head = ?'; $values[] = $data['head'] ?: null; }
        if (array_key_exists('status', $data)) { $sets[] = 'status = ?'; $values[] = $data['status']; }
        if (!$sets) return self::find($id);
        $values[] = $id;
        Database::connection()->prepare('UPDATE departments SET ' . implode(', ', $sets) . ' WHERE department_id = ?')->execute($values);
        return self::find($id);
    }

    public static function delete(string $id): bool
    {
        $stmt = Database::connection()->prepare('DELETE FROM departments WHERE department_id = ?');
        return $stmt->execute([$id]);
    }
}
