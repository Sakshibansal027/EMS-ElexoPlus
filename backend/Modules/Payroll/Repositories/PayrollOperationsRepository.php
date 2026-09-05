<?php

namespace Modules\Payroll\Repositories;

use Core\Database;
use Modules\Payroll\Models\Payroll;
use Modules\Payroll\Support\Uuid;

/**
 * Persistence for payroll operations that sit around a payroll run rather
 * than inside its core state machine: revision requests, LOP reviews, holds,
 * reimbursement claims, bank-dispatch audit records and sales-team metrics.
 */
class PayrollOperationsRepository
{
    private function db(): \PDO
    {
        return Database::connection();
    }

    public function employee(string $employeeId): ?array
    {
        $statement = $this->db()->prepare(
            'SELECT e.employee_id, e.employee_code, e.full_name, e.email,
                    d.department_name, ds.designation_name,
                    ec.employee_compensation_id, ec.basic_salary, ec.hra,
                    ec.allowance, ec.bonus, ec.gross_salary, ec.net_salary
             FROM employees e
             LEFT JOIN departments d ON d.department_id = e.department_id
             LEFT JOIN designations ds ON ds.designation_id = e.designation_id
             LEFT JOIN employee_compensations ec ON ec.employee_id = e.employee_id
             WHERE e.employee_id = ? LIMIT 1'
        );
        $statement->execute([$employeeId]);
        return $statement->fetch() ?: null;
    }

    public function revisions(?string $employeeId = null, ?string $status = null): array
    {
        $sql = 'SELECT sr.*, e.employee_code, e.full_name AS employee_name,
                       d.department_name
                FROM salary_revisions sr
                JOIN employees e ON e.employee_id = sr.employee_id
                LEFT JOIN departments d ON d.department_id = e.department_id
                WHERE 1 = 1';
        $values = [];
        if ($employeeId) {
            $sql .= ' AND sr.employee_id = ?';
            $values[] = $employeeId;
        }
        if ($status) {
            $sql .= ' AND sr.status = ?';
            $values[] = $status;
        }
        $sql .= ' ORDER BY sr.created_at DESC';
        $statement = $this->db()->prepare($sql);
        $statement->execute($values);
        return $statement->fetchAll();
    }

    public function revision(string $id): ?array
    {
        foreach ($this->revisions() as $revision) {
            if ($revision['salary_revision_id'] === $id) {
                return $revision;
            }
        }
        return null;
    }

    public function createRevision(array $data): array
    {
        $id = Uuid::generate();
        $statement = $this->db()->prepare(
            'INSERT INTO salary_revisions
                (salary_revision_id, employee_id, current_salary, requested_salary,
                 effective_from, reason, requested_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $statement->execute([
            $id,
            $data['employee_id'],
            $data['current_salary'],
            $data['requested_salary'],
            $data['effective_from'],
            $data['reason'],
            $data['requested_by'] ?? null,
        ]);
        return $this->revision($id) ?? throw new \RuntimeException('Unable to load salary revision.');
    }

    public function reviewRevision(string $id, string $status, string $reviewerId, ?string $notes): ?array
    {
        $statement = $this->db()->prepare(
            'UPDATE salary_revisions
             SET status = ?, reviewed_by = ?, review_notes = ?, reviewed_at = NOW()
             WHERE salary_revision_id = ? AND status = \'Pending\''
        );
        $statement->execute([$status, $reviewerId, $notes, $id]);
        return $statement->rowCount() === 1 ? $this->revision($id) : null;
    }

    public function updateCompensation(string $employeeId, array $components): void
    {
        $existing = $this->employee($employeeId);
        if (!$existing) {
            throw new \RuntimeException('Employee not found.');
        }

        $values = [
            $components['basic_salary'],
            $components['hra'],
            $components['allowance'],
            $components['bonus'],
            $components['gross_salary'],
            $components['net_salary'],
        ];

        if (!empty($existing['employee_compensation_id'])) {
            $values[] = $employeeId;
            $this->db()->prepare(
                'UPDATE employee_compensations
                 SET basic_salary=?, hra=?, allowance=?, bonus=?, gross_salary=?, net_salary=?
                 WHERE employee_id=?'
            )->execute($values);
            return;
        }

        $this->db()->prepare(
            'INSERT INTO employee_compensations
                (employee_compensation_id, employee_id, basic_salary, hra, allowance,
                 bonus, gross_salary, net_salary)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([Uuid::generate(), $employeeId, ...$values]);
    }

    public function lopCases(?string $employeeId = null, ?string $status = 'Pending'): array
    {
        $sql = 'SELECT lc.*, e.employee_code, e.full_name AS employee_name,
                       d.department_name, pp.payroll_month, pp.payroll_year
                FROM lop_cases lc
                JOIN employees e ON e.employee_id = lc.employee_id
                LEFT JOIN departments d ON d.department_id = e.department_id
                LEFT JOIN payroll_periods pp ON pp.payroll_period_id = lc.payroll_period_id
                WHERE 1 = 1';
        $values = [];
        if ($employeeId) {
            $sql .= ' AND lc.employee_id = ?';
            $values[] = $employeeId;
        }
        if ($status) {
            $sql .= ' AND lc.status = ?';
            $values[] = $status;
        }
        $sql .= ' ORDER BY lc.created_at DESC';
        $statement = $this->db()->prepare($sql);
        $statement->execute($values);
        return $statement->fetchAll();
    }

    public function lopCase(string $id): ?array
    {
        foreach ($this->lopCases(null, null) as $case) {
            if ($case['lop_case_id'] === $id) {
                return $case;
            }
        }
        return null;
    }

    public function createLopCase(array $data): array
    {
        $id = Uuid::generate();
        $this->db()->prepare(
            'INSERT INTO lop_cases
                (lop_case_id, employee_id, payroll_period_id, payroll_id, days_missed,
                 deduction_amount, reason)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $id,
            $data['employee_id'],
            $data['payroll_period_id'] ?? null,
            $data['payroll_id'] ?? null,
            $data['days_missed'],
            $data['deduction_amount'],
            $data['reason'],
        ]);
        return $this->lopCase($id) ?? throw new \RuntimeException('Unable to load LOP case.');
    }

    public function resolveLopCase(string $id, string $status, string $reviewerId, ?string $notes, ?string $deductionId = null): ?array
    {
        $statement = $this->db()->prepare(
            'UPDATE lop_cases
             SET status=?, resolution_notes=?, resolved_by=?, resolved_at=NOW(),
                 applied_deduction_id=COALESCE(?, applied_deduction_id)
             WHERE lop_case_id=? AND status=\'Pending\''
        );
        $statement->execute([$status, $notes, $reviewerId, $deductionId, $id]);
        return $statement->rowCount() === 1 ? $this->lopCase($id) : null;
    }

    public function activeHold(string $employeeId): ?array
    {
        $statement = $this->db()->prepare(
            'SELECT * FROM payroll_holds
             WHERE employee_id=? AND status=\'Active\'
             ORDER BY created_at DESC LIMIT 1'
        );
        $statement->execute([$employeeId]);
        return $statement->fetch() ?: null;
    }

    public function holds(?string $employeeId = null, ?string $status = 'Active'): array
    {
        $sql = 'SELECT ph.*, e.employee_code, e.full_name AS employee_name,
                       d.department_name
                FROM payroll_holds ph
                JOIN employees e ON e.employee_id=ph.employee_id
                LEFT JOIN departments d ON d.department_id=e.department_id
                WHERE 1=1';
        $values = [];
        if ($employeeId) {
            $sql .= ' AND ph.employee_id=?';
            $values[] = $employeeId;
        }
        if ($status) {
            $sql .= ' AND ph.status=?';
            $values[] = $status;
        }
        $sql .= ' ORDER BY ph.created_at DESC';
        $statement = $this->db()->prepare($sql);
        $statement->execute($values);
        return $statement->fetchAll();
    }

    public function createHold(string $employeeId, string $reason, ?string $notes, string $userId): array
    {
        $id = Uuid::generate();
        $this->db()->prepare(
            'INSERT INTO payroll_holds
                (payroll_hold_id, employee_id, reason, notes, created_by)
             VALUES (?, ?, ?, ?, ?)'
        )->execute([$id, $employeeId, $reason, $notes, $userId]);
        return $this->activeHold($employeeId) ?? throw new \RuntimeException('Unable to load payroll hold.');
    }

    public function releaseHold(string $employeeId, string $userId, ?string $notes): ?array
    {
        $active = $this->activeHold($employeeId);
        if (!$active) {
            return null;
        }
        $this->db()->prepare(
            'UPDATE payroll_holds
             SET status=\'Released\', released_by=?, released_at=NOW(),
                 notes=CASE WHEN ? IS NULL OR ? = \'\' THEN notes ELSE ? END
             WHERE payroll_hold_id=? AND status=\'Active\''
        )->execute([$userId, $notes, $notes, $notes, $active['payroll_hold_id']]);
        return $this->holdById($active['payroll_hold_id']);
    }

    private function holdById(string $id): ?array
    {
        foreach ($this->holds(null, null) as $hold) {
            if ($hold['payroll_hold_id'] === $id) {
                return $hold;
            }
        }
        return null;
    }

    public function reimbursements(?string $employeeId = null, ?string $status = null): array
    {
        $sql = 'SELECT er.*, e.employee_code, e.full_name AS employee_name,
                       d.department_name, pp.payroll_month, pp.payroll_year
                FROM expense_reimbursements er
                JOIN employees e ON e.employee_id = er.employee_id
                LEFT JOIN departments d ON d.department_id = e.department_id
                LEFT JOIN payroll_periods pp ON pp.payroll_period_id = er.payroll_period_id
                WHERE 1 = 1';
        $values = [];
        if ($employeeId) {
            $sql .= ' AND er.employee_id = ?';
            $values[] = $employeeId;
        }
        if ($status) {
            $sql .= ' AND er.status = ?';
            $values[] = $status;
        }
        $sql .= ' ORDER BY er.expense_date DESC, er.created_at DESC';
        $statement = $this->db()->prepare($sql);
        $statement->execute($values);
        return $statement->fetchAll();
    }

    public function reimbursement(string $id): ?array
    {
        foreach ($this->reimbursements() as $reimbursement) {
            if ($reimbursement['reimbursement_id'] === $id) {
                return $reimbursement;
            }
        }
        return null;
    }

    public function createReimbursement(array $data): array
    {
        $id = Uuid::generate();
        $this->db()->prepare(
            'INSERT INTO expense_reimbursements
                (reimbursement_id, employee_id, payroll_period_id, expense_type,
                 amount, expense_date, notes, submitted_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $id,
            $data['employee_id'],
            $data['payroll_period_id'] ?? null,
            $data['expense_type'],
            $data['amount'],
            $data['expense_date'],
            $data['notes'] ?? null,
            $data['submitted_by'] ?? null,
        ]);
        return $this->reimbursement($id) ?? throw new \RuntimeException('Unable to load reimbursement.');
    }

    public function reviewReimbursement(string $id, string $status, string $reviewerId, ?string $notes): ?array
    {
        $statement = $this->db()->prepare(
            'UPDATE expense_reimbursements
             SET status=?, reviewed_by=?, review_notes=?, reviewed_at=NOW()
             WHERE reimbursement_id=? AND status=\'Pending\''
        );
        $statement->execute([$status, $reviewerId, $notes, $id]);
        return $statement->rowCount() === 1 ? $this->reimbursement($id) : null;
    }

    public function applyReimbursement(string $id, string $payrollId, string $incentiveId): ?array
    {
        $this->db()->prepare(
            'UPDATE expense_reimbursements
             SET payroll_id=?, applied_incentive_id=?
             WHERE reimbursement_id=? AND status=\'Approved\''
        )->execute([$payrollId, $incentiveId, $id]);
        return $this->reimbursement($id);
    }

    public function draftPayrollForEmployee(string $employeeId, ?string $periodId = null, ?string $payrollId = null): ?array
    {
        $sql = 'SELECT p.* FROM payrolls p WHERE p.employee_id=? AND p.payroll_status=\'Draft\'';
        $values = [$employeeId];
        if ($periodId) {
            $sql .= ' AND p.payroll_period_id=?';
            $values[] = $periodId;
        }
        if ($payrollId) {
            $sql .= ' AND p.payroll_id=?';
            $values[] = $payrollId;
        }
        $sql .= ' ORDER BY p.created_at DESC LIMIT 1';
        $statement = $this->db()->prepare($sql);
        $statement->execute($values);
        return $statement->fetch() ?: null;
    }

    public function addPayrollAdjustment(string $payrollId, string $employeeId, string $type, string $name, float $amount, ?string $reason): array
    {
        return Payroll::addAdjustment($payrollId, $employeeId, $type, [
            'name' => $name,
            'amount' => $amount,
            'reason' => $reason,
        ]);
    }

    public function recalculatePayroll(string $payrollId): ?array
    {
        $payroll = Payroll::find($payrollId);
        if (!$payroll) {
            return null;
        }
        $statement = $this->db()->prepare('SELECT COALESCE(SUM(amount), 0) FROM incentives WHERE payroll_id=?');
        $statement->execute([$payrollId]);
        $incentives = (float) $statement->fetchColumn();
        $statement = $this->db()->prepare('SELECT COALESCE(SUM(amount), 0) FROM deductions WHERE payroll_id=?');
        $statement->execute([$payrollId]);
        $deductions = (float) $statement->fetchColumn();
        $net = round((float) $payroll['gross_salary'] + $incentives - $deductions, 2);
        if ($net < 0) {
            throw new \DomainException('Total deductions cannot exceed gross salary plus incentives.');
        }
        $this->db()->prepare(
            'UPDATE payrolls SET total_incentives=?, total_deductions=?, net_salary=? WHERE payroll_id=?'
        )->execute([$incentives, $deductions, $net, $payrollId]);
        return Payroll::find($payrollId);
    }

    public function transfers(?string $status = null): array
    {
        $sql = 'SELECT p.payroll_id, p.employee_id, p.net_salary, p.payroll_status,
                       e.employee_code, e.full_name AS employee_name,
                       ba.bank_name, ba.account_number, ba.ifsc_code,
                       bt.payroll_bank_transfer_id, bt.status AS transfer_status,
                       bt.transaction_reference, bt.dispatched_at, bt.failure_reason,
                       EXISTS(
                           SELECT 1 FROM payroll_holds ph
                           WHERE ph.employee_id=p.employee_id AND ph.status=\'Active\'
                       ) AS is_on_hold
                FROM payrolls p
                JOIN employees e ON e.employee_id=p.employee_id
                LEFT JOIN employee_bank_accounts ba
                       ON ba.employee_id=e.employee_id AND ba.is_primary=1
                LEFT JOIN payroll_bank_transfers bt ON bt.payroll_id=p.payroll_id
                WHERE (p.payroll_status=\'Approved\' OR bt.payroll_bank_transfer_id IS NOT NULL)';
        $values = [];
        if ($status) {
            if ($status === 'Ready') {
                $sql .= ' AND bt.payroll_bank_transfer_id IS NULL';
            } else {
                $sql .= ' AND bt.status=?';
                $values[] = $status;
            }
        }
        $sql .= ' ORDER BY CASE WHEN bt.dispatched_at IS NULL THEN 0 ELSE 1 END, p.created_at DESC';
        $statement = $this->db()->prepare($sql);
        $statement->execute($values);
        return $statement->fetchAll();
    }

    public function transferForPayroll(string $payrollId): ?array
    {
        foreach ($this->transfers() as $transfer) {
            if ($transfer['payroll_id'] === $payrollId) {
                return $transfer;
            }
        }
        return null;
    }

    public function createDispatchedTransfer(array $data): array
    {
        $id = Uuid::generate();
        $this->db()->prepare(
            'INSERT INTO payroll_bank_transfers
                (payroll_bank_transfer_id, payroll_id, employee_id, bank_name,
                 account_last_four, ifsc_code, amount, status, transaction_reference,
                 dispatched_by, dispatched_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, \'Dispatched\', ?, ?, NOW())'
        )->execute([
            $id,
            $data['payroll_id'],
            $data['employee_id'],
            $data['bank_name'],
            $data['account_last_four'],
            $data['ifsc_code'],
            $data['amount'],
            $data['transaction_reference'],
            $data['dispatched_by'],
        ]);
        return $this->transferForPayroll($data['payroll_id']) ?? throw new \RuntimeException('Unable to load bank transfer.');
    }

    public function latestPeriod(): ?array
    {
        $statement = $this->db()->query(
            'SELECT * FROM payroll_periods ORDER BY payroll_year DESC, payroll_month DESC LIMIT 1'
        );
        return $statement->fetch() ?: null;
    }

    public function findPeriod(string $id): ?array
    {
        $statement = $this->db()->prepare('SELECT * FROM payroll_periods WHERE payroll_period_id=? LIMIT 1');
        $statement->execute([$id]);
        return $statement->fetch() ?: null;
    }

    public function salesTablesInstalled(): bool
    {
        foreach (['targets', 'orders', 'territory_assignments', 'territories'] as $table) {
            $statement = $this->db()->prepare('SHOW TABLES LIKE ?');
            $statement->execute([$table]);
            if (!$statement->fetchColumn()) {
                return false;
            }
        }
        return true;
    }

    public function teamIncentives(string $managerEmployeeId, string $periodStart, string $periodEnd): array
    {
        $sql = 'SELECT e.employee_id, e.employee_code, e.full_name,
                    COALESCE((
                        SELECT tr.territory_name
                        FROM territory_assignments ta
                        JOIN territories tr ON tr.territory_id=ta.territory_id
                        WHERE ta.assigned_to_employee_id=e.employee_id
                          AND ta.status=\'Active\'
                          AND ta.effective_from<=?
                        ORDER BY ta.effective_from DESC LIMIT 1
                    ), \'Unassigned\') AS zone,
                    COALESCE((
                        SELECT SUM(t.target_value) FROM targets t
                        WHERE t.assigned_to_employee_id=e.employee_id
                          AND t.status=\'Active\'
                          AND t.period_start<=? AND t.period_end>=?
                    ), 0) AS assigned_target,
                    COALESCE((
                        SELECT SUM(o.order_value) FROM orders o
                        WHERE o.employee_id=e.employee_id
                          AND o.order_status<>\'Cancelled\'
                          AND o.order_date BETWEEN ? AND ?
                    ), 0) AS achieved,
                    COALESCE((
                        SELECT SUM(i.amount)
                        FROM incentives i
                        JOIN payrolls p ON p.payroll_id=i.payroll_id
                        JOIN payroll_periods pp ON pp.payroll_period_id=p.payroll_period_id
                        WHERE i.employee_id=e.employee_id
                          AND pp.period_start<=? AND pp.period_end>=?
                    ), 0) AS earned_incentive
                FROM employees e
                WHERE e.reporting_manager_id=?
                ORDER BY e.full_name';
        $statement = $this->db()->prepare($sql);
        $statement->execute([
            $periodEnd,
            $periodEnd,
            $periodStart,
            $periodStart,
            $periodEnd,
            $periodEnd,
            $periodStart,
            $managerEmployeeId,
        ]);
        return $statement->fetchAll();
    }
}
