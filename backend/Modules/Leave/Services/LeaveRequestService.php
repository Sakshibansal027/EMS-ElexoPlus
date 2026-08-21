<?php

namespace Modules\Leave\Services;

use Modules\Leave\Repositories\LeaveRequestRepository;
use Modules\Leave\Repositories\LeaveApprovalRepository;
use Modules\Leave\Repositories\LeavePolicyRepository;
use Modules\Leave\Repositories\EmployeeLeaveBalanceRepository;
use Modules\Leave\Repositories\CompanyHolidayRepository;

class LeaveRequestService
{
    public function __construct(
        private LeaveRequestRepository $requests,
        private LeaveApprovalRepository $approvals,
        private LeavePolicyRepository $policies,
        private EmployeeLeaveBalanceRepository $balances,
        private CompanyHolidayRepository $holidays
    ) {
    }

    /**
     * Submits a new leave request and kicks off the approval chain.
     *
     * $firstApproverEmployeeId is passed in by the caller (Controller)
     * rather than looked up in here, on purpose: knowing "who is this
     * employee's ASM" means reading employees.reporting_manager_id,
     * which belongs to the Employee module, not Leave. Leave module
     * shouldn't reach into another module's table directly — so
     * whoever wires the modules together (the Controller, using the
     * Employee module) resolves the manager and hands us the id.
     */
    /**
     * $workingDays comes from Settings module's company_settings.working_days
     * (a JSON array of day names, e.g. ["Monday",...,"Friday"]) — resolved by
     * the Controller and passed in here, same reasoning as
     * $firstApproverEmployeeId: that table belongs to Settings, not Leave,
     * so Leave doesn't query it directly. Whatever the admin sets it to,
     * this Service just uses it — no weekend logic hardcoded anywhere here.
     */
    public function apply(array $data, string $firstApproverEmployeeId, array $workingDays): array
    {
        foreach (['employee_id', 'leave_policy_id', 'start_date', 'end_date', 'reason'] as $field) {
            if (empty($data[$field])) {
                return ['success' => false, 'message' => "Field '$field' is required.", 'status' => 422];
            }
        }

        if ($data['end_date'] < $data['start_date']) {
            return ['success' => false, 'message' => 'end_date cannot be before start_date.', 'status' => 422];
        }

        $policy = $this->policies->findById($data['leave_policy_id']);
        if (!$policy || $policy['status'] !== 'Active') {
            return ['success' => false, 'message' => 'This leave policy is not available.', 'status' => 422];
        }

        $dayType = $data['day_type'] ?? 'Full Day';
        if ($dayType !== 'Full Day' && !$policy['allow_half_day']) {
            return ['success' => false, 'message' => 'This leave policy does not allow half-day requests.', 'status' => 422];
        }

        if ($policy['requires_document'] && empty($data['has_document'])) {
            return ['success' => false, 'message' => 'This leave policy requires a supporting document.', 'status' => 422];
        }

        $requestedDays = $this->calculateRequestedDays($data['start_date'], $data['end_date'], $dayType, $workingDays);
        if ($requestedDays <= 0) {
            return ['success' => false, 'message' => 'The selected dates contain no working days.', 'status' => 422];
        }

        $year = (int) substr($data['start_date'], 0, 4);
        $balance = $this->balances->findForEmployeeYear($data['employee_id'], $data['leave_policy_id'], $year);

        if (!$balance) {
            return ['success' => false, 'message' => 'No leave balance allocated for this policy/year.', 'status' => 422];
        }

        if ($balance['remaining_days'] < $requestedDays) {
            return [
                'success' => false,
                'message' => "Insufficient balance. Requested {$requestedDays}, remaining {$balance['remaining_days']}.",
                'status' => 422,
            ];
        }

        $request = $this->requests->create([
            'employee_id' => $data['employee_id'],
            'leave_policy_id' => $data['leave_policy_id'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'day_type' => $dayType,
            'reason' => $data['reason'],
            'emergency_contact' => $data['emergency_contact'] ?? null,
            'status' => 'Pending',
        ]);

        // First stage of the approval chain always starts at ASM level.
        $this->approvals->create([
            'leave_request_id' => $request['leave_request_id'],
            'approver_employee_id' => $firstApproverEmployeeId,
            'approval_level' => 'ASM',
            'decision' => 'Pending',
        ]);

        return ['success' => true, 'message' => 'Leave request submitted.', 'request' => $request, 'requested_days' => $requestedDays];
    }

    /**
     * Processes one approver's decision on whichever stage is
     * currently pending for a request. This is the heart of the
     * approval chain:
     *  - Reject at any stage -> the whole request is Rejected, chain
     *    stops there.
     *  - Approve at ASM level -> request moves to 'Under Review' and
     *    a new HR-level stage is created (needs $nextApproverEmployeeId).
     *  - Approve at HR level (the last stage) -> request becomes
     *    'Approved' and the balance is actually deducted — this is
     *    the ONE place days get taken out of the balance, so an
     *    employee's balance never drops just because a request is
     *    sitting Pending, only once it's fully approved.
     */
    public function processDecision(
        string $leaveRequestId,
        string $approvingEmployeeId,
        string $decision,
        array $workingDays,
        ?string $remarks = null,
        ?string $nextApproverEmployeeId = null
    ): array {
        if (!in_array($decision, ['Approved', 'Rejected'], true)) {
            return ['success' => false, 'message' => 'Decision must be Approved or Rejected.', 'status' => 422];
        }

        $request = $this->requests->findById($leaveRequestId);
        if (!$request) {
            return ['success' => false, 'message' => 'Leave request not found.', 'status' => 404];
        }

        $pendingStage = $this->approvals->findPendingForRequest($leaveRequestId);
        if (!$pendingStage) {
            return ['success' => false, 'message' => 'This request has no pending approval stage.', 'status' => 409];
        }

        if ($pendingStage['approver_employee_id'] !== $approvingEmployeeId) {
            return ['success' => false, 'message' => 'You are not the assigned approver for this stage.', 'status' => 403];
        }

        $this->approvals->recordDecision($pendingStage['approval_id'], $decision, $remarks);

        if ($decision === 'Rejected') {
            $this->requests->setStatus($leaveRequestId, 'Rejected');
            return ['success' => true, 'message' => 'Leave request rejected.'];
        }

        // Approved at this stage — figure out if there's a next one.
        if ($pendingStage['approval_level'] === 'ASM') {
            if (empty($nextApproverEmployeeId)) {
                return ['success' => false, 'message' => 'nextApproverEmployeeId (HR) is required to advance the chain.', 'status' => 422];
            }

            $this->approvals->create([
                'leave_request_id' => $leaveRequestId,
                'approver_employee_id' => $nextApproverEmployeeId,
                'approval_level' => 'HR',
                'decision' => 'Pending',
            ]);
            $this->requests->setStatus($leaveRequestId, 'Under Review');

            return ['success' => true, 'message' => 'Approved by ASM, forwarded to HR.'];
        }

        // HR-level approval is the final stage — finalize the request.
        $this->requests->setStatus($leaveRequestId, 'Approved');

        $requestedDays = $this->calculateRequestedDays($request['start_date'], $request['end_date'], $request['day_type'], $workingDays);
        $year = (int) substr($request['start_date'], 0, 4);
        $balance = $this->balances->findForEmployeeYear($request['employee_id'], $request['leave_policy_id'], $year);

        if ($balance) {
            $this->balances->deductDays($balance['leave_balance_id'], $requestedDays);
        }

        return ['success' => true, 'message' => 'Leave request fully approved.'];
    }

    /**
     * Employee-initiated cancellation. Only allowed while the request
     * hasn't finished the chain yet (Pending / Under Review) OR after
     * it's Approved but before the leave has actually started — once
     * Approved, we also have to give the deducted days back.
     */
    public function cancel(string $leaveRequestId, string $employeeId, array $workingDays): array
    {
        $request = $this->requests->findById($leaveRequestId);

        if (!$request || $request['employee_id'] !== $employeeId) {
            return ['success' => false, 'message' => 'Leave request not found.', 'status' => 404];
        }

        if (!in_array($request['status'], ['Pending', 'Under Review', 'Approved'], true)) {
            return ['success' => false, 'message' => 'This request can no longer be cancelled.', 'status' => 409];
        }

        if ($request['status'] === 'Approved' && $request['start_date'] <= date('Y-m-d')) {
            return ['success' => false, 'message' => 'Cannot cancel a leave that has already started.', 'status' => 409];
        }

        $wasApproved = $request['status'] === 'Approved';

        $this->requests->setStatus($leaveRequestId, 'Cancelled');

        if ($wasApproved) {
            $requestedDays = $this->calculateRequestedDays($request['start_date'], $request['end_date'], $request['day_type'], $workingDays);
            $year = (int) substr($request['start_date'], 0, 4);
            $balance = $this->balances->findForEmployeeYear($request['employee_id'], $request['leave_policy_id'], $year);

            if ($balance) {
                $this->balances->restoreDays($balance['leave_balance_id'], $requestedDays);
            }
        }

        return ['success' => true, 'message' => 'Leave request cancelled.'];
    }

    /**
     * Counts working days between two dates (inclusive) — a day only
     * counts if its weekday name (e.g. "Monday") is present in
     * $workingDays — minus any company holidays that fall in the
     * range. Half-day requests are always a single day at 0.5,
     * regardless of end_date.
     *
     * Nothing about which days are "off" is hardcoded here — it all
     * comes from $workingDays, which the Controller resolves from
     * Settings' company_settings.working_days. If an admin changes
     * that JSON value (e.g. to only give Sundays off), this method's
     * behavior changes automatically, with zero code changes here.
     */
    private function calculateRequestedDays(string $startDate, string $endDate, string $dayType, array $workingDays): float
    {
        if ($dayType !== 'Full Day') {
            return 0.5;
        }

        $count = 0;
        $current = new \DateTime($startDate);
        $end = new \DateTime($endDate);

        while ($current <= $end) {
            if (in_array($current->format('l'), $workingDays, true)) {
                $count++;
            }
            $current->modify('+1 day');
        }

        $holidays = $this->holidays->findAllBetween($startDate, $endDate);

        return (float) max(0, $count - count($holidays));
    }
}