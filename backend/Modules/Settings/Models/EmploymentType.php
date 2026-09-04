<?php

namespace Modules\Settings\Models;

use Core\Database;

class EmploymentType
{
    public static function all(): array
    {
        return Database::connection()->query('SELECT employment_type_id AS id, employment_type_name AS name, status FROM employment_types ORDER BY employment_type_name')->fetchAll();
    }

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT employment_type_id AS id, employment_type_name AS name, status FROM employment_types WHERE employment_type_id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): array
    {
        $id = \Modules\Settings\Support\Uuid::generate();
        $stmt = Database::connection()->prepare('INSERT INTO employment_types (employment_type_id, employment_type_name, status) VALUES (?, ?, ?)');
        $stmt->execute([$id, $data['name'], $data['status'] ?? 'Active']);
        return self::find($id);
    }

    public static function update(string $id, array $data): ?array
    {
        $sets = [];
        $values = [];
        if (array_key_exists('name', $data)) { $sets[] = 'employment_type_name = ?'; $values[] = $data['name']; }
        if (array_key_exists('status', $data)) { $sets[] = 'status = ?'; $values[] = $data['status']; }
        if (!$sets) return self::find($id);
        $values[] = $id;
        Database::connection()->prepare('UPDATE employment_types SET ' . implode(', ', $sets) . ' WHERE employment_type_id = ?')->execute($values);
        return self::find($id);
    }

    public static function delete(string $id): bool
    {
        $stmt = Database::connection()->prepare('DELETE FROM employment_types WHERE employment_type_id = ?');
        return $stmt->execute([$id]);
    }
}
