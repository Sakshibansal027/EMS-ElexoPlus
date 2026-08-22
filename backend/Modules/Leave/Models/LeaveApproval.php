<?php

namespace Modules\Leave\Models;

use Core\Database;
use Modules\Leave\Support\Uuid;

class LeaveApproval
{
    protected const TABLE = 'leave_approvals';

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . ' WHERE approval_id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    /**
     * Full approval trail for one leave request, in the order the
     * stages happen (ASM row before HR row). This is what powers
     * the "approval history / timeline" view on a request's detail
     * screen — every stage, who acted, what they decided.
     */
    public static function allByRequest(string $leaveRequestId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE leave_request_id = ?
             ORDER BY created_at ASC'
        );
        $stmt->execute([$leaveRequestId]);
        return $stmt->fetchAll();
    }

    /**
     * The single row that's currently awaiting action for a given
     * request — i.e. "whose turn is it right now". A request has
     * multiple leave_approvals rows over its lifetime (one per
     * level), but only one should be Pending at a time. The Service
     * layer will use this to find out who the next approver is and
     * to make sure someone can't approve a stage that isn't active
     * yet.
     */
    public static function findPendingForRequest(string $leaveRequestId): ?array
    {
        $stmt = Database::connection()->prepare(
            "SELECT * FROM " . self::TABLE . "
             WHERE leave_request_id = ? AND decision = 'Pending'
             ORDER BY created_at ASC
             LIMIT 1"
        );
        $stmt->execute([$leaveRequestId]);
        return $stmt->fetch() ?: null;
    }

    /**
     * Everything currently sitting in a specific approver's queue —
     * used for an ASM/HR's "requests waiting on me" list. Filters
     * by both the employee and Pending decision, since an approver
     * only cares about rows that need their action right now.
     */
    public static function allPendingForApprover(string $approverEmployeeId): array
    {
        $stmt = Database::connection()->prepare(
            "SELECT a.*, r.start_date, r.end_date, r.day_type, r.reason, r.status AS request_status, r.applied_at,
                    e.full_name AS employee_name, e.employee_code, d.designation_name, p.leave_policy_code
             FROM " . self::TABLE . " a
             INNER JOIN leave_requests r ON r.leave_request_id=a.leave_request_id
             INNER JOIN employees e ON e.employee_id=r.employee_id
             LEFT JOIN designations d ON d.designation_id=e.designation_id
             INNER JOIN leave_policies p ON p.leave_policy_id=r.leave_policy_id
             WHERE a.approver_employee_id = ? AND a.decision = 'Pending'
               AND r.status IN ('Pending', 'Under Review')
             ORDER BY a.created_at ASC"
        );
        $stmt->execute([$approverEmployeeId]);
        return $stmt->fetchAll();
    }

    /**
     * Creates one approval-stage row. Called by the Service layer
     * once per stage — e.g. when a request is first submitted
     * (creates the ASM-level row), and again once the ASM approves
     * (creates the next HR-level row). Decision defaults to
     * 'Pending' since a stage always starts unactioned.
     */
    public static function create(array $data): ?array
    {
        $id = Uuid::generate();

        $stmt = Database::connection()->prepare(
            'INSERT INTO ' . self::TABLE . '
             (approval_id, leave_request_id, approver_employee_id, approval_level, decision)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            $data['leave_request_id'],
            $data['approver_employee_id'],
            $data['approval_level'],
            $data['decision'] ?? 'Pending',
        ]);

        return self::find($id);
    }

    /**
     * Records an approver's decision on a stage — sets decision,
     * remarks, and stamps action_date to now. Separate, purpose-
     * built method (rather than a generic update()) for the same
     * reason as LeaveRequest::setStatus — this is the one action
     * that actually happens here, so it deserves a clear, explicit
     * call site: LeaveApproval::recordDecision($id, 'Approved', $remarks).
     */
    public static function recordDecision(string $id, string $decision, ?string $remarks = null): ?array
    {
        $stmt = Database::connection()->prepare(
            "UPDATE " . self::TABLE . "
             SET decision = ?, remarks = ?, action_date = NOW()
             WHERE approval_id = ?"
        );
        $stmt->execute([$decision, $remarks, $id]);

        return self::find($id);
    }
}
