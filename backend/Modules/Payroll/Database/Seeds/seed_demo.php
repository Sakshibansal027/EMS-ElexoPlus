<?php

/**
 * Idempotent development/demo seed for the Payroll module.
 *
 * It deliberately never deletes or overwrites an existing employee's payroll
 * data.  Run after the Employee demo-user seed and Payroll migrate script:
 *
 *   php backend/Modules/Payroll/Database/Seeds/seed_demo.php
 */

$composerAutoload = __DIR__ . '/../../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../../bootstrap/autoload.php';

use Core\Database;
use Modules\Payroll\Support\Uuid;

$db = Database::connection();

/** @return mixed */
function payrollSeedValue(PDO $db, string $sql, array $values = [])
{
    $statement = $db->prepare($sql);
    $statement->execute($values);
    return $statement->fetchColumn();
}

/** @return array<string, mixed>|null */
function payrollSeedRow(PDO $db, string $sql, array $values = []): ?array
{
    $statement = $db->prepare($sql);
    $statement->execute($values);
    $row = $statement->fetch();
    return $row ?: null;
}

/**
 * Inserts one adjustment only once.  Re-running this seed must not make a
 * payslip amount grow repeatedly.
 */
function payrollSeedAdjustment(PDO $db, string $table, string $key, string $nameColumn, string $payrollId, string $employeeId, string $name, float $amount, string $reason): float
{
    $exists = payrollSeedValue(
        $db,
        "SELECT 1 FROM {$table} WHERE payroll_id=? AND {$nameColumn}=? LIMIT 1",
        [$payrollId, $name]
    );
    if (!$exists) {
        $statement = $db->prepare(
            "INSERT INTO {$table} ({$key}, employee_id, payroll_id, {$nameColumn}, amount, reason, approved_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW())"
        );
        $statement->execute([Uuid::generate(), $employeeId, $payrollId, $name, $amount, $reason]);
    }

    return (float) payrollSeedValue($db, "SELECT COALESCE(SUM(amount), 0) FROM {$table} WHERE payroll_id=?", [$payrollId]);
}

$people = [
    ['email' => 'admin@elexoplus.com', 'salary' => 75000.00, 'account' => '110000000001'],
    ['email' => 'sakshi@elexoplus.com', 'salary' => 65000.00, 'account' => '110000000002'],
    ['email' => 'gaurav@elexoplus.com', 'salary' => 60000.00, 'account' => '110000000003'],
    ['email' => 'nisha@elexoplus.com', 'salary' => 45000.00, 'account' => '110000000004'],
];

$summary = [
    'employees_seeded' => 0,
    'paid_payrolls' => 0,
    'ready_transfers' => 0,
    'skipped_profiles' => 0,
];

$db->beginTransaction();
try {
    $structure = payrollSeedRow($db, 'SELECT * FROM salary_structures WHERE structure_code=? LIMIT 1', ['PAY-DEMO-STANDARD']);
    if (!$structure) {
        $structureId = Uuid::generate();
        $db->prepare(
            'INSERT INTO salary_structures
             (salary_structure_id, structure_name, structure_code, basic_percentage, hra_percentage,
              special_allowance, medical_allowance, conveyance_allowance, bonus_type, bonus_value,
              bonus_frequency, status)
             VALUES (?, ?, ?, 50, 20, 5000, 1250, 1600, ?, 0, ?, ?)'
        )->execute([$structureId, 'Payroll Demo Standard', 'PAY-DEMO-STANDARD', 'Fixed', 'Monthly', 'Active']);
        $structure = payrollSeedRow($db, 'SELECT * FROM salary_structures WHERE salary_structure_id=?', [$structureId]);
    }
    $defaultStructureId = (string) $structure['salary_structure_id'];

    // August is a completed historical period and gives every role a real
    // personal payslip without affecting the currently-active run.
    $historicalPeriod = payrollSeedRow(
        $db,
        'SELECT * FROM payroll_periods WHERE payroll_month=8 AND payroll_year=2026 LIMIT 1'
    );
    if (!$historicalPeriod) {
        $historicalPeriodId = Uuid::generate();
        $db->prepare(
            'INSERT INTO payroll_periods
             (payroll_period_id, payroll_month, payroll_year, period_start, period_end, status)
             VALUES (?, 8, 2026, ?, ?, ?)'
        )->execute([$historicalPeriodId, '2026-08-01', '2026-08-31', 'Completed']);
        $historicalPeriod = payrollSeedRow($db, 'SELECT * FROM payroll_periods WHERE payroll_period_id=?', [$historicalPeriodId]);
    }

    foreach ($people as $index => $person) {
        $employee = payrollSeedRow(
            $db,
            'SELECT employee_id, employee_code, full_name FROM employees WHERE email=? LIMIT 1',
            [$person['email']]
        );
        if (!$employee) {
            $summary['skipped_profiles']++;
            continue;
        }

        $employeeId = (string) $employee['employee_id'];
        $actorId = (string) (payrollSeedValue($db, 'SELECT id FROM users WHERE email=? LIMIT 1', [$person['email']]) ?? 'system-demo');

        $compensation = payrollSeedRow(
            $db,
            'SELECT * FROM employee_compensations WHERE employee_id=? LIMIT 1',
            [$employeeId]
        );
        if (!$compensation) {
            $gross = (float) $person['salary'];
            $db->prepare(
                'INSERT INTO employee_compensations
                 (employee_compensation_id, employee_id, basic_salary, hra, allowance, bonus, gross_salary, net_salary)
                 VALUES (?, ?, ?, ?, ?, 0, ?, ?)'
            )->execute([
                Uuid::generate(),
                $employeeId,
                round($gross * 0.50, 2),
                round($gross * 0.20, 2),
                round($gross * 0.30, 2),
                $gross,
                $gross,
            ]);
            $compensation = payrollSeedRow($db, 'SELECT * FROM employee_compensations WHERE employee_id=? LIMIT 1', [$employeeId]);
        }
        $gross = (float) $compensation['gross_salary'];

        $assignment = payrollSeedRow(
            $db,
            "SELECT salary_structure_id FROM employee_salary_structures
             WHERE employee_id=? AND status='Active' AND effective_from<=?
               AND (effective_to IS NULL OR effective_to>=?)
             ORDER BY effective_from DESC LIMIT 1",
            [$employeeId, '2026-08-31', '2026-08-31']
        );
        if (!$assignment) {
            $db->prepare(
                "INSERT INTO employee_salary_structures
                 (employee_salary_structure_id, employee_id, salary_structure_id, effective_from, status)
                 VALUES (?, ?, ?, '2026-01-01', 'Active')"
            )->execute([Uuid::generate(), $employeeId, $defaultStructureId]);
            $assignment = ['salary_structure_id' => $defaultStructureId];
        }
        $structureId = (string) $assignment['salary_structure_id'];

        $primaryBank = payrollSeedRow(
            $db,
            'SELECT bank_name, account_number, ifsc_code FROM employee_bank_accounts WHERE employee_id=? AND is_primary=1 LIMIT 1',
            [$employeeId]
        );
        if (!$primaryBank) {
            $db->prepare(
                'INSERT INTO employee_bank_accounts
                 (bank_account_id, employee_id, bank_name, account_number, ifsc_code, is_primary)
                 VALUES (?, ?, ?, ?, ?, 1)'
            )->execute([Uuid::generate(), $employeeId, 'Demo National Bank', $person['account'], 'DNBK0000123']);
            $primaryBank = payrollSeedRow(
                $db,
                'SELECT bank_name, account_number, ifsc_code FROM employee_bank_accounts WHERE employee_id=? AND is_primary=1 LIMIT 1',
                [$employeeId]
            );
        }

        $payroll = payrollSeedRow(
            $db,
            'SELECT * FROM payrolls WHERE payroll_period_id=? AND employee_id=? LIMIT 1',
            [(string) $historicalPeriod['payroll_period_id'], $employeeId]
        );
        if (!$payroll) {
            $payrollId = Uuid::generate();
            $db->prepare(
                "INSERT INTO payrolls
                 (payroll_id, payroll_period_id, employee_id, salary_structure_id, attendance_days, payable_days,
                  lop_days, overtime_hours, gross_salary, total_incentives, total_deductions, net_salary,
                  verification_status, verified_by, verified_at, payroll_status, processed_by, processed_at,
                  approved_by, approved_at)
                 VALUES (?, ?, ?, ?, 22, 22, 0, 0, ?, 0, 0, ?, 'Verified', ?, NOW(), 'Paid', ?, NOW(), ?, NOW())"
            )->execute([
                $payrollId,
                (string) $historicalPeriod['payroll_period_id'],
                $employeeId,
                $structureId,
                $gross,
                $gross,
                $actorId,
                $actorId,
                $actorId,
            ]);
            $payroll = payrollSeedRow($db, 'SELECT * FROM payrolls WHERE payroll_id=?', [$payrollId]);
            $summary['paid_payrolls']++;
        }

        $payrollId = (string) $payroll['payroll_id'];
        $incentives = payrollSeedAdjustment($db, 'incentives', 'incentive_id', 'incentive_name', $payrollId, $employeeId, 'Demo performance incentive', round($gross * 0.04, 2), 'Demo payroll seed');
        $deductions = payrollSeedAdjustment($db, 'deductions', 'deduction_id', 'deduction_name', $payrollId, $employeeId, 'Professional tax', 200.00, 'Demo payroll seed');
        $db->prepare('UPDATE payrolls SET total_incentives=?, total_deductions=?, net_salary=? WHERE payroll_id=?')
            ->execute([$incentives, $deductions, round((float) $payroll['gross_salary'] + $incentives - $deductions, 2), $payrollId]);

        if (!payrollSeedValue($db, 'SELECT 1 FROM payslips WHERE payroll_id=? LIMIT 1', [$payrollId])) {
            $payslipId = Uuid::generate();
            $db->prepare(
                'INSERT INTO payslips (payslip_id, payroll_id, employee_id, payslip_number, pdf_url)
                 VALUES (?, ?, ?, ?, ?)'
            )->execute([
                $payslipId,
                $payrollId,
                $employeeId,
                sprintf('PS-202608-%s', strtoupper(substr(str_replace('-', '', $employeeId), 0, 6))),
                '/api/payroll/payslips/' . $payslipId . '/download',
            ]);
        }

        if (!payrollSeedValue($db, 'SELECT 1 FROM payroll_bank_transfers WHERE payroll_id=? LIMIT 1', [$payrollId])) {
            $bankName = $primaryBank['bank_name'] ?? null;
            $accountNumber = (string) ($primaryBank['account_number'] ?? '');
            $db->prepare(
                "INSERT INTO payroll_bank_transfers
                 (payroll_bank_transfer_id, payroll_id, employee_id, bank_name, account_last_four, ifsc_code,
                  amount, status, transaction_reference, dispatched_by, dispatched_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'Dispatched', ?, ?, NOW())"
            )->execute([
                Uuid::generate(),
                $payrollId,
                $employeeId,
                $bankName,
                $accountNumber === '' ? null : substr($accountNumber, -4),
                $primaryBank['ifsc_code'] ?? null,
                (float) payrollSeedValue($db, 'SELECT net_salary FROM payrolls WHERE payroll_id=?', [$payrollId]),
                'DEMO-AUG-2026-' . ($index + 1),
                $actorId,
            ]);
        }

        $summary['employees_seeded']++;
    }

    $nisha = payrollSeedRow($db, 'SELECT employee_id FROM employees WHERE email=? LIMIT 1', ['nisha@elexoplus.com']);
    $gaurav = payrollSeedRow($db, 'SELECT employee_id FROM employees WHERE email=? LIMIT 1', ['gaurav@elexoplus.com']);
    $adminId = (string) (payrollSeedValue($db, 'SELECT id FROM users WHERE email=? LIMIT 1', ['admin@elexoplus.com']) ?? 'system-demo');

    if ($nisha) {
        $nishaId = (string) $nisha['employee_id'];
        $nishaGross = (float) (payrollSeedValue($db, 'SELECT gross_salary FROM employee_compensations WHERE employee_id=?', [$nishaId]) ?: 45000);
        if (!payrollSeedValue($db, 'SELECT 1 FROM salary_revisions WHERE employee_id=? AND reason=? LIMIT 1', [$nishaId, 'Demo annual salary revision'])) {
            $db->prepare(
                "INSERT INTO salary_revisions
                 (salary_revision_id, employee_id, current_salary, requested_salary, effective_from, reason, requested_by)
                 VALUES (?, ?, ?, ?, '2026-10-01', ?, ?)"
            )->execute([Uuid::generate(), $nishaId, $nishaGross, round($nishaGross * 1.10, 2), 'Demo annual salary revision', $adminId]);
        }
        if (!payrollSeedValue($db, 'SELECT 1 FROM expense_reimbursements WHERE employee_id=? AND notes=? LIMIT 1', [$nishaId, 'Demo client travel reimbursement'])) {
            $db->prepare(
                "INSERT INTO expense_reimbursements
                 (reimbursement_id, employee_id, expense_type, amount, expense_date, notes, submitted_by)
                 VALUES (?, ?, 'Client travel', 1250, '2026-08-18', ?, ?)"
            )->execute([Uuid::generate(), $nishaId, 'Demo client travel reimbursement', $adminId]);
        }
    }

    if ($gaurav) {
        $gauravId = (string) $gaurav['employee_id'];
        if (!payrollSeedValue($db, 'SELECT 1 FROM lop_cases WHERE employee_id=? AND reason=? LIMIT 1', [$gauravId, 'Demo attendance LOP review'])) {
            $db->prepare(
                'INSERT INTO lop_cases
                 (lop_case_id, employee_id, payroll_period_id, days_missed, deduction_amount, reason)
                 VALUES (?, ?, ?, 1, 1000, ?)'
            )->execute([Uuid::generate(), $gauravId, (string) $historicalPeriod['payroll_period_id'], 'Demo attendance LOP review']);
        }
        if (!payrollSeedValue($db, 'SELECT 1 FROM payroll_holds WHERE employee_id=? AND reason=? LIMIT 1', [$gauravId, 'Demo released verification hold'])) {
            $db->prepare(
                "INSERT INTO payroll_holds
                 (payroll_hold_id, employee_id, reason, notes, status, created_by, released_by, released_at)
                 VALUES (?, ?, ?, ?, 'Released', ?, ?, NOW())"
            )->execute([Uuid::generate(), $gauravId, 'Demo released verification hold', 'Historical demo audit record', $adminId, $adminId]);
        }
    }

    // A genuinely ready item lets an Administrator test the real bank-dispatch
    // endpoint without changing a historical paid payroll.
    $readyPeriod = payrollSeedRow($db, 'SELECT * FROM payroll_periods WHERE payroll_month=11 AND payroll_year=2026 LIMIT 1');
    if (!$readyPeriod) {
        $readyPeriodId = Uuid::generate();
        $db->prepare(
            "INSERT INTO payroll_periods
             (payroll_period_id, payroll_month, payroll_year, period_start, period_end, status)
             VALUES (?, 11, 2026, '2026-11-01', '2026-11-30', 'Verification')"
        )->execute([$readyPeriodId]);
        $readyPeriod = payrollSeedRow($db, 'SELECT * FROM payroll_periods WHERE payroll_period_id=?', [$readyPeriodId]);
    }

    $readyEmployee = $nisha ?: $gaurav;
    if ($readyEmployee) {
        $readyEmployeeId = (string) $readyEmployee['employee_id'];
        $readyPayroll = payrollSeedRow($db, 'SELECT * FROM payrolls WHERE payroll_period_id=? AND employee_id=? LIMIT 1', [(string) $readyPeriod['payroll_period_id'], $readyEmployeeId]);
        if (!$readyPayroll) {
            $readyStructure = payrollSeedRow(
                $db,
                "SELECT salary_structure_id FROM employee_salary_structures
                 WHERE employee_id=? AND status='Active' ORDER BY effective_from DESC LIMIT 1",
                [$readyEmployeeId]
            );
            $readyGross = (float) (payrollSeedValue($db, 'SELECT gross_salary FROM employee_compensations WHERE employee_id=?', [$readyEmployeeId]) ?: 0);
            if ($readyStructure && $readyGross > 0) {
                $readyPayrollId = Uuid::generate();
                $db->prepare(
                    "INSERT INTO payrolls
                     (payroll_id, payroll_period_id, employee_id, salary_structure_id, attendance_days, payable_days,
                      lop_days, overtime_hours, gross_salary, total_incentives, total_deductions, net_salary,
                      verification_status, verified_by, verified_at, payroll_status, processed_by, processed_at,
                      approved_by, approved_at)
                     VALUES (?, ?, ?, ?, 22, 22, 0, 0, ?, 0, 0, ?, 'Verified', ?, NOW(), 'Approved', ?, NOW(), ?, NOW())"
                )->execute([
                    $readyPayrollId,
                    (string) $readyPeriod['payroll_period_id'],
                    $readyEmployeeId,
                    (string) $readyStructure['salary_structure_id'],
                    $readyGross,
                    $readyGross,
                    $adminId,
                    $adminId,
                    $adminId,
                ]);
                $summary['ready_transfers']++;
            }
        }
    }

    $db->commit();
    echo 'Payroll demo data is ready: ' . json_encode($summary, JSON_UNESCAPED_SLASHES) . PHP_EOL;
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    throw $exception;
}
