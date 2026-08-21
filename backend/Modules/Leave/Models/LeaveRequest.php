<?php

namespace Modules\Leave\Models;

use Core\Database;
use Modules\Leave\Support\Uuid;

class LeaveRequest
{
    protected const TABLE = 'leave_requests';

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . ' WHERE leave_request_id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    /**
     * All leave requests submitted by one employee — this is what
     * powers "my leave history" on the employee's own dashboard.
     * Newest first, since that's what people want to see on open.
     */
    public static function allByEmployee(string $employeeId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE employee_id = ?
             ORDER BY applied_at DESC'
        );
        $stmt->execute([$employeeId]);
        return $stmt->fetchAll();
    }

    /**
     * All requests sitting at a given status — this is what an
     * ASM/HR approver's "pending approvals" queue will query with
     * status = 'Pending' (or 'Under Review'). Kept generic (any
     * status) rather than a dedicated pendingOnly() method, since
     * admin screens will also want to list Approved/Rejected ones.
     */
    public static function allByStatus(string $status): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE status = ?
             ORDER BY applied_at ASC'
        );
        $stmt->execute([$status]);
        return $stmt->fetchAll();
    }

    /**
     * Creates a new leave request. Like LeavePolicy::create, we
     * generate the UUID in PHP before inserting.
     *
     * Deliberately NOT included here: any check on whether the
     * employee has enough balance, whether dates overlap an
     * existing request, etc. Those are business rules — they
     * belong in LeaveRequestService, not here. This method just
     * writes whatever row it's given.
     */
    public static function create(array $data): ?array
    {
        $id = Uuid::generate();

        $stmt = Database::connection()->prepare(
            'INSERT INTO ' . self::TABLE . '
             (leave_request_id, employee_id, leave_policy_id, start_date, end_date,
              day_type, reason, emergency_contact, status, applied_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())'
        );
        $stmt->execute([
            $id,
            $data['employee_id'],
            $data['leave_policy_id'],
            $data['start_date'],
            $data['end_date'],
            $data['day_type'] ?? 'Full Day',
            $data['reason'],
            $data['emergency_contact'] ?? null,
            $data['status'] ?? 'Pending',
        ]);

        return self::find($id);
    }

    /**
     * Generic partial update for editable fields (e.g. an employee
     * amending their reason/dates while still Pending). PK and
     * employee_id are stripped so a caller can't reassign a request
     * to someone else by accident.
     */
    public static function update(string $id, array $data): ?array
    {
        unset($data['leave_request_id'], $data['employee_id']);

        if (empty($data)) {
            return self::find($id);
        }

        $fields = [];
        $values = [];
        foreach ($data as $column => $value) {
            $fields[] = "$column = ?";
            $values[] = $value;
        }
        $values[] = $id;

        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . ' SET ' . implode(', ', $fields) . ' WHERE leave_request_id = ?'
        );
        $stmt->execute($values);

        return self::find($id);
    }

    /**
     * Narrow, purpose-built helper just for changing status
     * (Pending -> Under Review -> Approved/Rejected/Cancelled).
     * Kept separate from the generic update() above because status
     * transitions are the one field the Service layer will touch
     * constantly (on every approval-chain step), so a dedicated
     * method makes those call sites read clearly — e.g.
     * LeaveRequest::setStatus($id, 'Approved') instead of building
     * an array just to change one field.
     */
    /**
     * All requests whose date range overlaps [startDate, endDate] —
     * powers the team calendar. A request overlaps the range if it
     * starts before the range ends AND ends after the range starts
     * (standard interval-overlap check).
     *
     * NOTE: no role-based scoping here (everyone sees every request
     * in range) — the frontend's original role rules (ASM sees own
     * team, Sales Exec sees only their team) need employee-hierarchy
     * data this module doesn't own. Flagging as a simplification
     * rather than guessing at scoping logic that could hide/leak the
     * wrong people's leave.
     */
    public static function allBetween(string $startDate, string $endDate): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE start_date <= ? AND end_date >= ?
             ORDER BY start_date ASC'
        );
        $stmt->execute([$endDate, $startDate]);
        return $stmt->fetchAll();
    }

    public static function setStatus(string $id, string $status): ?array
    {
        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . ' SET status = ? WHERE leave_request_id = ?'
        );
        $stmt->execute([$status, $id]);
        return self::find($id);
    }
}