<?php

namespace Modules\Attendance\Models;

use Core\Database;

class Attendance
{
    protected const TABLE = 'attendance';

    public static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . ' WHERE id = ?'
        );
        $stmt->execute([$id]);

        return $stmt->fetch() ?: null;
    }

    public static function findByEmployeeAndDate(
        string $employeeId,
        string $attendanceDate
    ): ?array {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE employee_id = ? AND attendance_date = ?'
        );
        $stmt->execute([$employeeId, $attendanceDate]);

        return $stmt->fetch() ?: null;
    }

    public static function findAll(): array
    {
        $stmt = Database::connection()->query(
            'SELECT * FROM ' . self::TABLE . '
             ORDER BY attendance_date DESC, id DESC'
        );

        return $stmt->fetchAll();
    }

    public static function findByEmployee(string $employeeId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE employee_id = ?
             ORDER BY attendance_date DESC, id DESC'
        );
        $stmt->execute([$employeeId]);

        return $stmt->fetchAll();
    }

    public static function findByEmployees(array $employeeIds): array
    {
        if ($employeeIds === []) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($employeeIds), '?'));

        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE employee_id IN (' . $placeholders . ')
             ORDER BY attendance_date DESC, id DESC'
        );
        $stmt->execute(array_values($employeeIds));

        return $stmt->fetchAll();
    }

    public static function findByDate(string $attendanceDate): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE attendance_date = ?
             ORDER BY employee_id ASC'
        );
        $stmt->execute([$attendanceDate]);

        return $stmt->fetchAll();
    }

    public static function create(array $data): ?array
    {
        $db = Database::connection();

        $stmt = $db->prepare(
            'INSERT INTO ' . self::TABLE . '
             (employee_id, attendance_date, check_in, check_out,
              break_minutes, working_hours, overtime, status, shift, remarks)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $data['employee_id'],
            $data['attendance_date'],
            $data['check_in'] ?? null,
            $data['check_out'] ?? null,
            $data['break_minutes'] ?? 0,
            $data['working_hours'] ?? 0.00,
            $data['overtime'] ?? 0.00,
            $data['status'] ?? 'Present',
            $data['shift'] ?? null,
            $data['remarks'] ?? null,
        ]);

        return self::find((int) $db->lastInsertId());
    }
}