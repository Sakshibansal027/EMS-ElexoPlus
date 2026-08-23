<?php

namespace Modules\Attendance\Models;

use Core\Database;

class AttendanceCorrection
{
    protected const TABLE = 'attendance_corrections';

    public static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . ' WHERE id = ?'
        );
        $stmt->execute([$id]);

        return $stmt->fetch() ?: null;
    }

    public static function findAll(): array
    {
        $stmt = Database::connection()->query(
            'SELECT * FROM ' . self::TABLE . '
             ORDER BY submitted_on DESC, id DESC'
        );

        return $stmt->fetchAll();
    }

    public static function findByEmployee(string $employeeId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE employee_id = ?
             ORDER BY submitted_on DESC, id DESC'
        );
        $stmt->execute([$employeeId]);

        return $stmt->fetchAll();
    }

    public static function create(array $data): ?array
    {
        $db = Database::connection();

        $stmt = $db->prepare(
            'INSERT INTO ' . self::TABLE . '
             (employee_id, correction_date, requested_check_in,
              requested_check_out, reason, status, submitted_on)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $data['employee_id'],
            $data['correction_date'],
            $data['requested_check_in'] ?? null,
            $data['requested_check_out'] ?? null,
            $data['reason'],
            $data['status'] ?? 'Pending',
            $data['submitted_on'],
        ]);

        return self::find((int) $db->lastInsertId());
    }

    public static function updateStatus(int $id, string $status): ?array
    {
        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . '
             SET status = ?
             WHERE id = ?'
        );
        $stmt->execute([$status, $id]);

        return self::find($id);
    }
}
