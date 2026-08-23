<?php

namespace Modules\Leave\Services;

use Modules\Leave\Repositories\EmployeeLeaveBalanceRepository;
use Modules\Leave\Repositories\LeavePolicyRepository;

class EmployeeLeaveBalanceService
{
    public function __construct(
        private EmployeeLeaveBalanceRepository $balances,
        private LeavePolicyRepository $policies
    ) {
    }

    /**
     * Powers the "your leave balance" dashboard card — every policy's
     * balance for one employee, one year, in one call.
     */
    public function getForEmployee(string $employeeId, int $year): array
    {
        return ['success' => true, 'balances' => $this->balances->findAllForEmployee($employeeId, $year)];
    }

    public function getForEmployeePolicy(string $employeeId, string $leavePolicyId, int $year): array
    {
        $balance = $this->balances->findForEmployeeYear($employeeId, $leavePolicyId, $year);

        if (!$balance) {
            return ['success' => false, 'message' => 'No balance found for this employee/policy/year.', 'status' => 404];
        }

        return ['success' => true, 'balance' => $balance];
    }

    /**
     * Allocates a fresh year's balance for one employee/policy, based
     * on the policy's annual_quota and accrual_method:
     *  - 'Upfront'  -> the employee gets the full annual_quota on day one.
     *  - 'Pro-rata' -> only meaningful if the employee joined partway
     *    through the year, so we need $joiningDate for that case. Like
     *    $firstApproverEmployeeId elsewhere, joining date is Employee-
     *    module data, so it's passed in rather than looked up here.
     *    If the employee joined before this year started, pro-rata
     *    also just means the full quota (nothing partial about it).
     *
     * Guards against double-allocating: if a balance already exists
     * for this employee/policy/year, we return it instead of erroring
     * or silently creating a duplicate (the DB's UNIQUE constraint
     * would reject a duplicate insert anyway, but this gives a
     * cleaner message than a raw SQL error).
     */
    public function allocate(string $employeeId, string $leavePolicyId, int $year, ?string $joiningDate = null): array
    {
        $existing = $this->balances->findForEmployeeYear($employeeId, $leavePolicyId, $year);
        if ($existing) {
            return ['success' => true, 'message' => 'Balance already allocated for this year.', 'balance' => $existing];
        }

        $policy = $this->policies->findById($leavePolicyId);
        if (!$policy || $policy['status'] !== 'Active') {
            return ['success' => false, 'message' => 'Leave policy not found or inactive.', 'status' => 422];
        }

        $allocatedDays = (float) $policy['annual_quota'];

        if ($policy['accrual_method'] === 'Pro-rata' && $joiningDate !== null) {
            $joinYear = (int) substr($joiningDate, 0, 4);

            if ($joinYear === $year) {
                $daysRemainingInYear = (int) (new \DateTime($joiningDate))
                    ->diff(new \DateTime("$year-12-31"))
                    ->days + 1;

                $allocatedDays = round(($allocatedDays / 365) * $daysRemainingInYear, 2);
            }
            // if the employee joined in an earlier year, pro-rata for
            // *this* year is the full quota — no partial-year to prorate.
        }

        $balance = $this->balances->create([
            'employee_id' => $employeeId,
            'leave_policy_id' => $leavePolicyId,
            'leave_year' => $year,
            'allocated_days' => $allocatedDays,
        ]);

        return ['success' => true, 'message' => 'Leave balance allocated.', 'balance' => $balance];
    }

    /**
     * Rolls unused days from one year into the next, respecting the
     * policy's carry_forward_allowed / max_carry_forward_days rules.
     * Meant to run once per policy per employee at year-end (e.g.
     * from a scheduled job), after allocate() has already created
     * the new year's base row.
     */
    public function carryForward(string $employeeId, string $leavePolicyId, int $fromYear, int $toYear): array
    {
        $policy = $this->policies->findById($leavePolicyId);
        if (!$policy || !$policy['carry_forward_allowed']) {
            return ['success' => false, 'message' => 'This policy does not allow carry-forward.', 'status' => 422];
        }

        $previous = $this->balances->findForEmployeeYear($employeeId, $leavePolicyId, $fromYear);
        if (!$previous) {
            return ['success' => false, 'message' => 'No balance found for the previous year.', 'status' => 404];
        }

        $newBalance = $this->balances->findForEmployeeYear($employeeId, $leavePolicyId, $toYear);
        if (!$newBalance) {
            return ['success' => false, 'message' => 'Allocate the new year\'s balance before carrying forward.', 'status' => 422];
        }

        $carryDays = min((float) $previous['remaining_days'], (float) $policy['max_carry_forward_days']);

        if ($carryDays <= 0) {
            return ['success' => true, 'message' => 'Nothing to carry forward.', 'balance' => $newBalance];
        }

        // Carried-in days effectively increase what's available, same
        // as restoreDays does for a cancellation — it adds to both the
        // running "remaining" total.
        $updated = $this->balances->restoreDays($newBalance['leave_balance_id'], $carryDays);

        return ['success' => true, 'message' => "Carried forward {$carryDays} day(s).", 'balance' => $updated];
    }
}