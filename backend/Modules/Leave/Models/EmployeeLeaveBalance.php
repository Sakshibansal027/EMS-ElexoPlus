<?php

namespace Modules\Leave\Models;

use Core\Database;
use Modules\Leave\Support\Uuid;

class EmployeeLeaveBalance
{
    protected const TABLE = 'employee_leave_balances';

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . ' WHERE leave_balance_id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    /**
     * The one row that matters most in this whole module: "how much
     * of this leave type does this employee have left, this year".
     * Matches the table's unique key exactly (employee + policy +
     * year), so this always returns at most one row.
     */
    public static function findForEmployeeYear(string $employeeId, string $leavePolicyId, int $year): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE employee_id = ? AND leave_policy_id = ? AND leave_year = ?'
        );
        $stmt->execute([$employeeId, $leavePolicyId, $year]);
        return $stmt->fetch() ?: null;
    }

    /**
     * All of an employee's balances (every leave type) for one year
     * — this is what the "leave balance" dashboard card reads: Sick
     * Leave 5/12, Casual Leave 3/8, etc., all at once.
     */
    public static function allForEmployee(string $employeeId, int $year): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE employee_id = ? AND leave_year = ?'
        );
        $stmt->execute([$employeeId, $year]);
        return $stmt->fetchAll();
    }

    /**
     * Creates the starting balance row for an employee/policy/year
     * — e.g. run once when a new year begins or a new leave policy
     * is assigned. remaining_days starts equal to allocated_days
     * since nothing's been used yet.
     */
    public static function create(array $data): ?array
    {
        $id = Uuid::generate();
        $allocated = $data['allocated_days'] ?? 0;

        $stmt = Database::connection()->prepare(
            'INSERT INTO ' . self::TABLE . '
             (leave_balance_id, employee_id, leave_policy_id, leave_year,
              allocated_days, used_days, remaining_days)
             VALUES (?, ?, ?, ?, ?, 0, ?)'
        );
        $stmt->execute([
            $id,
            $data['employee_id'],
            $data['leave_policy_id'],
            $data['leave_year'],
            $allocated,
            $allocated, // remaining = allocated - 0 used, at creation
        ]);

        return array_merge($data, [
            'leave_balance_id' => $id,
            'used_days' => 0,
            'remaining_days' => $allocated,
        ]);
    }

    /**
     * Moves $days from "remaining" to "used" — call this once a
     * leave request finishes the full approval chain and becomes
     * Approved. Deliberately does the increment/decrement in one
     * SQL statement (rather than read-modify-write in PHP) so two
     * simultaneous approvals can't race and silently overwrite each
     * other's balance change.
     */
    public static function deductDays(string $id, float $days): ?array
    {
        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . '
             SET used_days = used_days + ?, remaining_days = remaining_days - ?
             WHERE leave_balance_id = ?'
        );
        $stmt->execute([$days, $days, $id]);

        return ['leave_balance_id' => $id];
    }

    /**
     * The reverse of deductDays — call this if an already-Approved
     * request later gets Cancelled, to give the days back.
     */
    public static function restoreDays(string $id, float $days): ?array
    {
        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . '
             SET used_days = used_days - ?, remaining_days = remaining_days + ?
             WHERE leave_balance_id = ?'
        );
        $stmt->execute([$days, $days, $id]);

        return ['leave_balance_id' => $id];
    }
}
