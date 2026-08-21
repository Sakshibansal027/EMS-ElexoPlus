<?php

require __DIR__ . '/../../../../vendor/autoload.php';

use Core\Database;
use Modules\Leave\Repositories\LeavePolicyRepository;
use Modules\Leave\Repositories\CompanyHolidayRepository;
use Modules\Leave\Repositories\EmployeeLeaveBalanceRepository;

$policyRepo = new LeavePolicyRepository();
$holidayRepo = new CompanyHolidayRepository();
$balanceRepo = new EmployeeLeaveBalanceRepository();

// ============================================================
// Leave Policies
// ============================================================

$demoPolicies = [
    [
        'leave_policy_code' => 'SL',
        'leave_policy_name' => 'Sick Leave',
        'description' => 'Paid leave for illness or medical needs.',
        'annual_quota' => 12,
        'accrual_frequency' => 'Monthly',
        'accrual_method' => 'Upfront',
        'allow_half_day' => true,
        'requires_document' => true,
        'is_paid' => true,
        'carry_forward_allowed' => false,
        'max_carry_forward_days' => 0,
    ],
    [
        'leave_policy_code' => 'CL',
        'leave_policy_name' => 'Casual Leave',
        'description' => 'Short-notice leave for personal matters.',
        'annual_quota' => 8,
        'accrual_frequency' => 'Monthly',
        'accrual_method' => 'Upfront',
        'allow_half_day' => true,
        'requires_document' => false,
        'is_paid' => true,
        'carry_forward_allowed' => false,
        'max_carry_forward_days' => 0,
    ],
    [
        'leave_policy_code' => 'EL',
        'leave_policy_name' => 'Earned Leave',
        'description' => 'Planned/vacation leave, accrued through the year.',
        'annual_quota' => 15,
        'accrual_frequency' => 'Monthly',
        'accrual_method' => 'Pro-rata',
        'allow_half_day' => true,
        'requires_document' => false,
        'is_paid' => true,
        'carry_forward_allowed' => true,
        'max_carry_forward_days' => 10,
    ],
    [
        'leave_policy_code' => 'ML',
        'leave_policy_name' => 'Maternity Leave',
        'description' => 'Paid leave for childbirth and postnatal care.',
        'annual_quota' => 182,
        'accrual_frequency' => 'Yearly',
        'accrual_method' => 'Upfront',
        'allow_half_day' => false,
        'requires_document' => true,
        'is_paid' => true,
        'carry_forward_allowed' => false,
        'max_carry_forward_days' => 0,
    ],
    [
        'leave_policy_code' => 'LWP',
        'leave_policy_name' => 'Leave Without Pay',
        'description' => 'Unpaid leave once other balances are exhausted.',
        'annual_quota' => 30,
        'accrual_frequency' => 'Yearly',
        'accrual_method' => 'Upfront',
        'allow_half_day' => false,
        'requires_document' => false,
        'is_paid' => false,
        'carry_forward_allowed' => false,
        'max_carry_forward_days' => 0,
    ],
];

$createdPolicies = [];

foreach ($demoPolicies as $policy) {
    $existing = $policyRepo->findByCode($policy['leave_policy_code']);

    if ($existing) {
        echo "Skipped (exists): {$policy['leave_policy_code']}\n";
        $createdPolicies[] = $existing;
        continue;
    }

    $created = $policyRepo->create($policy);
    $createdPolicies[] = $created;
    echo "Created policy: {$policy['leave_policy_code']} - {$policy['leave_policy_name']}\n";
}

// ============================================================
// Company Holidays (current year, India-typical set — adjust as needed)
// ============================================================

$year = (int) date('Y');

$demoHolidays = [
    ['title' => 'Republic Day', 'holiday_date' => "$year-01-26", 'holiday_type' => 'Public Holiday'],
    ['title' => 'Holi', 'holiday_date' => "$year-03-14", 'holiday_type' => 'Public Holiday'],
    ['title' => 'Independence Day', 'holiday_date' => "$year-08-15", 'holiday_type' => 'Public Holiday'],
    ['title' => 'Gandhi Jayanti', 'holiday_date' => "$year-10-02", 'holiday_type' => 'Public Holiday'],
    ['title' => 'Diwali', 'holiday_date' => "$year-11-01", 'holiday_type' => 'Public Holiday'],
    ['title' => 'Christmas', 'holiday_date' => "$year-12-25", 'holiday_type' => 'Public Holiday'],
    ['title' => 'Founders Day', 'holiday_date' => "$year-06-15", 'holiday_type' => 'Company Holiday'],
];

foreach ($demoHolidays as $holiday) {
    try {
        $holidayRepo->create(array_merge($holiday, ['location' => 'All']));
        echo "Created holiday: {$holiday['title']} ({$holiday['holiday_date']})\n";
    } catch (\Throwable $e) {
        // Unique constraint (date, title, location) — already seeded, skip quietly.
        echo "Skipped (exists): {$holiday['title']}\n";
    }
}

// ============================================================
// Employee Leave Balances — one row per existing employee, per
// policy, for the current year, using each policy's annual_quota.
// ============================================================

$stmt = Database::connection()->prepare('SELECT employee_id FROM employees');
$stmt->execute();
$employeeIds = array_column($stmt->fetchAll(), 'employee_id');

if (empty($employeeIds)) {
    echo "No employees found — skipping balance seeding. Run the Employee module's seed first.\n";
} else {
    foreach ($employeeIds as $employeeId) {
        foreach ($createdPolicies as $policy) {
            $existing = $balanceRepo->findForEmployeeYear($employeeId, $policy['leave_policy_id'], $year);

            if ($existing) {
                continue; // already seeded for this employee/policy/year
            }

            $balanceRepo->create([
                'employee_id' => $employeeId,
                'leave_policy_id' => $policy['leave_policy_id'],
                'leave_year' => $year,
                'allocated_days' => $policy['annual_quota'],
            ]);
        }
    }
    echo 'Seeded balances for ' . count($employeeIds) . " employee(s).\n";
}

echo "Done.\n";