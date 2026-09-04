<?php

namespace Modules\Settings\Models;

use Core\Database;

class EmployeeStatus
{
    public static function all(): array
    {
        return Database::connection()->query('SELECT employee_status_id AS id, status_name AS name, color, status FROM employee_statuses ORDER BY status_name')->fetchAll();
    }

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT employee_status_id AS id, status_name AS name, color, status FROM employee_statuses WHERE employee_status_id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): array
    {
        $id = \Modules\Settings\Support\Uuid::generate();
        $stmt = Database::connection()->prepare('INSERT INTO employee_statuses (employee_status_id, status_name, color, status) VALUES (?, ?, ?, ?)');
        $stmt->execute([$id, $data['name'], $data['color'] ?? '#2ecc71', $data['status'] ?? 'Active']);
        return self::find($id);
    }

    public static function update(string $id, array $data): ?array
    {
        $sets = [];
        $values = [];
        if (array_key_exists('name', $data)) { $sets[] = 'status_name = ?'; $values[] = $data['name']; }
        if (array_key_exists('color', $data)) { $sets[] = 'color = ?'; $values[] = $data['color']; }
        if (array_key_exists('status', $data)) { $sets[] = 'status = ?'; $values[] = $data['status']; }
        if (!$sets) return self::find($id);
        $values[] = $id;
        Database::connection()->prepare('UPDATE employee_statuses SET ' . implode(', ', $sets) . ' WHERE employee_status_id = ?')->execute($values);
        return self::find($id);
    }

    public static function delete(string $id): bool
    {
        $stmt = Database::connection()->prepare('DELETE FROM employee_statuses WHERE employee_status_id = ?');
        return $stmt->execute([$id]);
    }
}
