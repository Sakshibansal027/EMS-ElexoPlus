<?php

namespace Modules\Payroll\Controllers;

use Core\Database;
use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Authentication\Models\User;
use Modules\Authentication\Support\Request;
use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Payroll\Repositories\PayrollOperationsRepository;
use Modules\Payroll\Repositories\PayrollPeriodRepository;
use Modules\Payroll\Repositories\PayrollRepository;
use Modules\Payroll\Repositories\PayslipRepository;
use Modules\Payroll\Repositories\SalaryStructureRepository;
use Modules\Payroll\Services\PayrollService;

/**
 * Role-safe operations around a payroll run: salary revisions, loss of pay,
 * holds, reimbursements, bank-dispatch audit records and team incentives.
 */
class PayrollOperationsController
{
    private PayrollOperationsRepository $repo;
    private PayrollService $payrolls;

    public function __construct()
    {
        $this->repo = new PayrollOperationsRepository();
        $this->payrolls = new PayrollService(
            new PayrollRepository(),
            new PayrollPeriodRepository(),
            new SalaryStructureRepository(),
            new PayslipRepository(),
        );
    }

    public function revisions(array $params): array
    {
        $auth = $this->auth();
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $employeeId = $this->manager($auth['user'])
            ? $this->nullableInput('employee_id')
            : ($auth['user']['employee_id'] ?? '');

        return [
            'success' => true,
            'revisions' => $this->repo->revisions($employeeId ?: null, $this->filterValue('status')),
        ];
    }

    public function createRevision(array $params): array
    {
        $auth = $this->auth();
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $employeeId = $this->manager($auth['user'])
            ? $this->nullableInput('employee_id')
            : ($auth['user']['employee_id'] ?? '');
        if (!$employeeId) {
            return $this->unprocessable('Employee profile is required.');
        }

        $employee = $this->repo->employee($employeeId);
        if (!$employee) {
            return $this->notFound('Employee not found.');
        }

        $currentSalary = (float) ($employee['gross_salary'] ?? 0);
        if ($currentSalary <= 0) {
            return $this->unprocessable('Configure the employee compensation before requesting a salary revision.');
        }

        $requested = Request::input('requested_salary');
        $effectiveFrom = trim((string) Request::input('effective_from', ''));
        $reason = trim((string) Request::input('reason', ''));
        if (!is_numeric($requested) || (float) $requested <= 0 || !$this->validDate($effectiveFrom) || $reason === '') {
            return $this->unprocessable('requested_salary, a valid effective_from date and reason are required.');
        }
        if ($effectiveFrom < date('Y-m-d')) {
            return $this->unprocessable('effective_from cannot be in the past.');
        }
        if (mb_strlen($reason) > 500) {
            return $this->unprocessable('reason cannot exceed 500 characters.');
        }
        if (abs((float) $requested - $currentSalary) < 0.01) {
            return $this->unprocessable('The requested salary must differ from the current salary.');
        }
        if ($this->repo->hasPendingRevision($employeeId)) {
            return $this->conflict('This employee already has a pending salary revision.');
        }

        return [
            'success' => true,
            'message' => 'Salary revision submitted for review.',
            'revision' => $this->repo->createRevision([
                'employee_id' => $employeeId,
                // Never trust a browser-supplied current salary.
                'current_salary' => $currentSalary,
                'requested_salary' => round((float) $requested, 2),
                'effective_from' => $effectiveFrom,
                'reason' => $reason,
                'requested_by' => User::idOf($auth['user']),
            ]),
        ];
    }

    public function reviewRevision(array $params): array
    {
        $auth = $this->role(['ADMIN', 'HR']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $status = (string) Request::input('status', '');
        if (!in_array($status, ['Approved', 'Rejected'], true)) {
            return $this->unprocessable('status must be Approved or Rejected.');
        }

        $existing = $this->repo->revision($params['id']);
        if (!$existing) {
            return $this->notFound('Salary revision not found.');
        }
        if ($existing['status'] !== 'Pending') {
            return $this->conflict('Salary revision has already been reviewed.');
        }

        $notes = $this->nullableInput('notes');
        if ($notes !== null && mb_strlen($notes) > 2000) {
            return $this->unprocessable('notes cannot exceed 2000 characters.');
        }

        $db = Database::connection();
        $ownsTransaction = !$db->inTransaction();
        if ($ownsTransaction) {
            $db->beginTransaction();
        }

        try {
            $revision = $this->repo->reviewRevision($params['id'], $status, User::idOf($auth['user']), $notes);
            if (!$revision) {
                if ($ownsTransaction && $db->inTransaction()) {
                    $db->rollBack();
                }
                return $this->conflict('Salary revision has already been reviewed.');
            }

            // A future-dated revision is approved now but becomes effective
            // during payroll generation for the effective period. A revision
            // effective today updates the source compensation atomically.
            $appliedToCompensation = false;
            if ($status === 'Approved' && $revision['effective_from'] <= date('Y-m-d')) {
                $this->repo->updateCompensation(
                    $revision['employee_id'],
                    $this->repo->revisedCompensation($revision['employee_id'], (float) $revision['requested_salary']),
                );
                $appliedToCompensation = true;
            }

            if ($ownsTransaction) {
                $db->commit();
            }

            return [
                'success' => true,
                'message' => $status === 'Approved' ? 'Salary revision approved.' : 'Salary revision rejected.',
                'revision' => $revision,
                'compensation_applied' => $appliedToCompensation,
            ];
        } catch (\Throwable $exception) {
            if ($ownsTransaction && $db->inTransaction()) {
                $db->rollBack();
            }
            throw $exception;
        }
    }

    public function lopCases(array $params): array
    {
        $auth = $this->role(['ADMIN', 'HR']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        return [
            'success' => true,
            'cases' => $this->repo->lopCases($this->nullableInput('employee_id'), $this->filterValue('status', 'Pending')),
        ];
    }

    public function createLopCase(array $params): array
    {
        $auth = $this->role(['ADMIN', 'HR']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $employeeId = $this->nullableInput('employee_id');
        $days = Request::input('days_missed');
        $amount = Request::input('deduction_amount');
        $reason = trim((string) Request::input('reason', ''));
        if (!$employeeId || !is_numeric($days) || (float) $days <= 0 || !is_numeric($amount) || (float) $amount < 0 || $reason === '') {
            return $this->unprocessable('employee_id, positive days_missed, non-negative deduction_amount and reason are required.');
        }
        if (!$this->repo->employee($employeeId)) {
            return $this->notFound('Employee not found.');
        }
        if (mb_strlen($reason) > 500) {
            return $this->unprocessable('reason cannot exceed 500 characters.');
        }

        $periodId = $this->nullableInput('payroll_period_id');
        if ($periodId && !$this->repo->findPeriod($periodId)) {
            return $this->notFound('Payroll period not found.');
        }

        return [
            'success' => true,
            'message' => 'LOP case created.',
            'case' => $this->repo->createLopCase([
                'employee_id' => $employeeId,
                'payroll_period_id' => $periodId,
                'payroll_id' => $this->nullableInput('payroll_id'),
                'days_missed' => round((float) $days, 2),
                'deduction_amount' => round((float) $amount, 2),
                'reason' => $reason,
            ]),
        ];
    }

    public function resolveLopCase(array $params): array
    {
        $auth = $this->role(['ADMIN', 'HR']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $status = (string) Request::input('status', 'Resolved');
        if (!in_array($status, ['Resolved', 'Waived'], true)) {
            return $this->unprocessable('status must be Resolved or Waived.');
        }

        $case = $this->repo->lopCase($params['id']);
        if (!$case) {
            return $this->notFound('LOP case not found.');
        }
        if ($case['status'] !== 'Pending') {
            return $this->conflict('LOP case has already been resolved.');
        }

        $notes = $this->nullableInput('notes');
        if ($notes !== null && mb_strlen($notes) > 2000) {
            return $this->unprocessable('notes cannot exceed 2000 characters.');
        }

        if ($status === 'Waived') {
            $resolved = $this->repo->resolveLopCase($case['lop_case_id'], 'Waived', User::idOf($auth['user']), $notes);
            return ['success' => true, 'message' => 'LOP case waived.', 'case' => $resolved];
        }

        $requestedPayrollId = $this->nullableInput('payroll_id') ?: ($case['payroll_id'] ?: null);
        $payroll = $this->repo->draftPayrollForEmployee(
            $case['employee_id'],
            $case['payroll_period_id'] ?: null,
            $requestedPayrollId,
        );
        if (!$payroll) {
            return $this->conflict('A Draft payroll for this employee is required before an LOP deduction can be applied.');
        }

        $db = Database::connection();
        $ownsTransaction = !$db->inTransaction();
        if ($ownsTransaction) {
            $db->beginTransaction();
        }

        try {
            $deduction = $this->repo->addPayrollAdjustment(
                $payroll['payroll_id'],
                $case['employee_id'],
                'deduction',
                'Loss of Pay',
                (float) $case['deduction_amount'],
                $case['reason'],
            );
            $updatedPayroll = $this->repo->recalculatePayroll($payroll['payroll_id']);
            $resolved = $this->repo->resolveLopCase(
                $case['lop_case_id'],
                'Resolved',
                User::idOf($auth['user']),
                $notes,
                $deduction['deduction_id'],
            );
            if (!$resolved || !$updatedPayroll) {
                throw new \RuntimeException('Unable to apply the LOP deduction.');
            }
            if ($ownsTransaction) {
                $db->commit();
            }

            return [
                'success' => true,
                'message' => 'LOP deduction applied to the draft payroll.',
                'case' => $resolved,
                'deduction' => $deduction,
                'payroll' => $updatedPayroll,
            ];
        } catch (\Throwable $exception) {
            if ($ownsTransaction && $db->inTransaction()) {
                $db->rollBack();
            }
            throw $exception;
        }
    }

    public function holds(array $params): array
    {
        $auth = $this->role(['ADMIN', 'HR']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        return [
            'success' => true,
            'holds' => $this->repo->holds($this->nullableInput('employee_id'), $this->filterValue('status', 'Active')),
        ];
    }

    public function setHold(array $params): array
    {
        $auth = $this->role(['ADMIN', 'HR']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $employeeId = $this->nullableInput('employee_id');
        $hold = filter_var(Request::input('is_hold'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if (!$employeeId || $hold === null) {
            return $this->unprocessable('employee_id and boolean is_hold are required.');
        }
        if (!$this->repo->employee($employeeId)) {
            return $this->notFound('Employee not found.');
        }

        $notes = $this->nullableInput('notes');
        if ($notes !== null && mb_strlen($notes) > 2000) {
            return $this->unprocessable('notes cannot exceed 2000 characters.');
        }

        if ($hold) {
            $reason = trim((string) Request::input('reason', ''));
            if ($reason === '') {
                return $this->unprocessable('reason is required when holding salary.');
            }
            if (mb_strlen($reason) > 255) {
                return $this->unprocessable('reason cannot exceed 255 characters.');
            }
            if ($existing = $this->repo->activeHold($employeeId)) {
                return ['success' => false, 'message' => 'This employee already has an active payroll hold.', 'status' => 409, 'hold' => $existing];
            }

            return [
                'success' => true,
                'message' => 'Payroll hold placed.',
                'hold' => $this->repo->createHold($employeeId, $reason, $notes, User::idOf($auth['user'])),
            ];
        }

        $released = $this->repo->releaseHold($employeeId, User::idOf($auth['user']), $notes);
        return $released
            ? ['success' => true, 'message' => 'Payroll hold released.', 'hold' => $released]
            : $this->notFound('No active payroll hold was found.');
    }

    public function reimbursements(array $params): array
    {
        $auth = $this->auth();
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $employeeId = $this->manager($auth['user'])
            ? $this->nullableInput('employee_id')
            : ($auth['user']['employee_id'] ?? '');

        return [
            'success' => true,
            'reimbursements' => $this->repo->reimbursements($employeeId ?: null, $this->filterValue('status')),
        ];
    }

    public function createReimbursement(array $params): array
    {
        $auth = $this->auth();
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $employeeId = $this->manager($auth['user'])
            ? $this->nullableInput('employee_id')
            : ($auth['user']['employee_id'] ?? '');
        $type = trim((string) Request::input('expense_type', ''));
        $amount = Request::input('amount');
        $expenseDate = trim((string) Request::input('expense_date', ''));
        $notes = $this->nullableInput('notes');
        if (!$employeeId || $type === '' || !is_numeric($amount) || (float) $amount <= 0 || !$this->validDate($expenseDate)) {
            return $this->unprocessable('employee_id, expense_type, positive amount and a valid expense_date are required.');
        }
        if (!$this->repo->employee($employeeId)) {
            return $this->notFound('Employee not found.');
        }
        if (mb_strlen($type) > 150 || ($notes !== null && mb_strlen($notes) > 1000)) {
            return $this->unprocessable('expense_type cannot exceed 150 characters and notes cannot exceed 1000 characters.');
        }

        $periodId = $this->nullableInput('payroll_period_id');
        if ($periodId && !$this->repo->findPeriod($periodId)) {
            return $this->notFound('Payroll period not found.');
        }

        return [
            'success' => true,
            'message' => 'Reimbursement submitted for review.',
            'reimbursement' => $this->repo->createReimbursement([
                'employee_id' => $employeeId,
                'payroll_period_id' => $periodId,
                'expense_type' => $type,
                'amount' => round((float) $amount, 2),
                'expense_date' => $expenseDate,
                'notes' => $notes,
                'submitted_by' => User::idOf($auth['user']),
            ]),
        ];
    }

    public function reviewReimbursement(array $params): array
    {
        $auth = $this->role(['ADMIN', 'HR']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $status = (string) Request::input('status', '');
        if (!in_array($status, ['Approved', 'Rejected'], true)) {
            return $this->unprocessable('status must be Approved or Rejected.');
        }
        $existing = $this->repo->reimbursement($params['id']);
        if (!$existing) {
            return $this->notFound('Reimbursement not found.');
        }
        if ($existing['status'] !== 'Pending') {
            return $this->conflict('Reimbursement has already been reviewed.');
        }

        $notes = $this->nullableInput('notes');
        if ($notes !== null && mb_strlen($notes) > 2000) {
            return $this->unprocessable('notes cannot exceed 2000 characters.');
        }
        $reimbursement = $this->repo->reviewReimbursement($params['id'], $status, User::idOf($auth['user']), $notes);
        return [
            'success' => true,
            'message' => $status === 'Approved' ? 'Reimbursement approved.' : 'Reimbursement rejected.',
            'reimbursement' => $reimbursement,
        ];
    }

    /** Add an approved expense claim to the employee's draft payroll exactly once. */
    public function applyReimbursement(array $params): array
    {
        $auth = $this->role(['ADMIN', 'HR']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $reimbursement = $this->repo->reimbursement($params['id']);
        if (!$reimbursement) {
            return $this->notFound('Reimbursement not found.');
        }
        if ($reimbursement['status'] !== 'Approved') {
            return $this->conflict('Only an approved reimbursement can be applied to payroll.');
        }

        $payroll = $this->repo->draftPayrollForEmployee(
            $reimbursement['employee_id'],
            $reimbursement['payroll_period_id'] ?: null,
            $this->nullableInput('payroll_id'),
        );
        if (!$payroll) {
            return $this->conflict('A Draft payroll for this employee is required before reimbursement can be applied.');
        }

        $db = Database::connection();
        $ownsTransaction = !$db->inTransaction();
        if ($ownsTransaction) {
            $db->beginTransaction();
        }

        try {
            $incentive = $this->repo->addPayrollAdjustment(
                $payroll['payroll_id'],
                $reimbursement['employee_id'],
                'incentive',
                'Reimbursement: ' . $reimbursement['expense_type'],
                (float) $reimbursement['amount'],
                $reimbursement['notes'],
            );
            $updatedPayroll = $this->repo->recalculatePayroll($payroll['payroll_id']);
            $applied = $this->repo->applyReimbursement(
                $reimbursement['reimbursement_id'],
                $payroll['payroll_id'],
                $incentive['incentive_id'],
            );
            if (!$applied || !$updatedPayroll) {
                throw new \RuntimeException('Unable to apply reimbursement to payroll.');
            }
            if ($ownsTransaction) {
                $db->commit();
            }

            return [
                'success' => true,
                'message' => 'Reimbursement added to draft payroll.',
                'reimbursement' => $applied,
                'incentive' => $incentive,
                'payroll' => $updatedPayroll,
            ];
        } catch (\Throwable $exception) {
            if ($ownsTransaction && $db->inTransaction()) {
                $db->rollBack();
            }
            throw $exception;
        }
    }

    public function transfers(array $params): array
    {
        $auth = $this->role(['ADMIN']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        return ['success' => true, 'transfers' => $this->repo->transfers($this->filterValue('status'))];
    }

    /**
     * Records a bank-transfer dispatch and marks an approved payroll paid in
     * the same database transaction. This is an audit action, not a payment
     * gateway integration.
     */
    public function dispatchTransfer(array $params): array
    {
        $auth = $this->role(['ADMIN']);
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $payroll = $this->repo->payroll($params['payrollId']);
        if (!$payroll) {
            return $this->notFound('Payroll not found.');
        }
        if ($payroll['payroll_status'] !== 'Approved') {
            return $this->conflict('Only an approved payroll can be dispatched to a bank.');
        }
        if ($this->repo->activeHold($payroll['employee_id'])) {
            return $this->conflict('Salary payment is blocked because this employee has an active payroll hold.');
        }
        $existingTransfer = $this->repo->transferForPayroll($payroll['payroll_id']);
        if (!empty($existingTransfer['payroll_bank_transfer_id'])) {
            return $this->conflict('A bank transfer has already been recorded for this payroll.');
        }

        $reference = trim((string) Request::input('transaction_reference', ''));
        if ($reference === '' || mb_strlen($reference) > 100) {
            return $this->unprocessable('transaction_reference is required and cannot exceed 100 characters.');
        }
        $bank = $this->repo->primaryBankAccount($payroll['employee_id']);
        if (!$bank || trim((string) $bank['bank_name']) === '' || trim((string) $bank['account_number']) === '' || trim((string) $bank['ifsc_code']) === '') {
            return $this->conflict('The employee needs a verified primary bank account before payment can be dispatched.');
        }
        $accountNumber = preg_replace('/\s+/', '', (string) $bank['account_number']);
        if (strlen($accountNumber) < 4) {
            return $this->conflict('The employee primary bank account is invalid.');
        }

        $db = Database::connection();
        $ownsTransaction = !$db->inTransaction();
        if ($ownsTransaction) {
            $db->beginTransaction();
        }

        try {
            $transfer = $this->repo->createDispatchedTransfer([
                'payroll_id' => $payroll['payroll_id'],
                'employee_id' => $payroll['employee_id'],
                'bank_name' => trim((string) $bank['bank_name']),
                'account_last_four' => substr($accountNumber, -4),
                'ifsc_code' => strtoupper(trim((string) $bank['ifsc_code'])),
                'amount' => (float) $payroll['net_salary'],
                'transaction_reference' => $reference,
                'dispatched_by' => User::idOf($auth['user']),
            ]);
            $payment = $this->payrolls->transition($payroll['payroll_id'], 'pay', User::idOf($auth['user']));
            if (!$payment['success']) {
                if ($ownsTransaction && $db->inTransaction()) {
                    $db->rollBack();
                }
                return $payment;
            }
            if ($ownsTransaction) {
                $db->commit();
            }

            return [
                'success' => true,
                'message' => 'Bank-transfer dispatch recorded and payroll marked paid.',
                'transfer' => $transfer,
                'payroll' => $payment['payroll'],
            ];
        } catch (\Throwable $exception) {
            if ($ownsTransaction && $db->inTransaction()) {
                $db->rollBack();
            }
            throw $exception;
        }
    }

    public function teamIncentives(array $params): array
    {
        $auth = $this->auth();
        if (isset($auth['error'])) {
            return $this->error($auth);
        }

        $role = strtoupper((string) ($auth['user']['role'] ?? ''));
        if (!in_array($role, ['ADMIN', 'HR', 'ASM'], true)) {
            return ['success' => false, 'message' => 'You do not have permission to view team incentives.', 'status' => 403];
        }

        $managerEmployeeId = $role === 'ASM'
            ? ($auth['user']['employee_id'] ?? '')
            : $this->nullableInput('manager_employee_id');
        if (!$managerEmployeeId) {
            return $this->unprocessable('manager_employee_id is required.');
        }

        $periodId = $this->nullableInput('period_id');
        $period = $periodId ? $this->repo->findPeriod($periodId) : $this->repo->latestPeriod();
        if (!$period) {
            return ['success' => true, 'incentives' => []];
        }

        return [
            'success' => true,
            'incentives' => $this->repo->teamIncentives($managerEmployeeId, $period['period_start'], $period['period_end']),
        ];
    }

    private function auth(): array
    {
        return AuthMiddleware::handle();
    }

    private function role(array $roles): array
    {
        return RoleMiddleware::handle($roles);
    }

    private function manager(array $user): bool
    {
        return in_array(strtoupper((string) ($user['role'] ?? '')), ['ADMIN', 'HR'], true);
    }

    private function nullableInput(string $key): ?string
    {
        $value = trim((string) Request::input($key, ''));
        return $value === '' ? null : $value;
    }

    private function filterValue(string $key, ?string $default = null): ?string
    {
        $value = $this->nullableInput($key);
        return $value === null || strtolower($value) === 'all' ? $default : $value;
    }

    private function validDate(string $value): bool
    {
        $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $value);
        return $date !== false && $date->format('Y-m-d') === $value;
    }

    private function error(array $auth): array
    {
        return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
    }

    private function unprocessable(string $message): array
    {
        return ['success' => false, 'message' => $message, 'status' => 422];
    }

    private function conflict(string $message): array
    {
        return ['success' => false, 'message' => $message, 'status' => 409];
    }

    private function notFound(string $message): array
    {
        return ['success' => false, 'message' => $message, 'status' => 404];
    }
}
