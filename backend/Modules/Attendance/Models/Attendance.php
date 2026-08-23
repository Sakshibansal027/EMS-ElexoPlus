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