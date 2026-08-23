<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

$db = \Core\Database::connection();
$year = date('Y');
$policies = [
    ['11111111-1111-4111-8111-111111111111', 'CL', 'Casual Leave', 12, 1, 0],
    ['22222222-2222-4222-8222-222222222222', 'SL', 'Sick Leave', 10, 1, 1],
    ['33333333-3333-4333-8333-333333333333', 'EL', 'Earned Leave', 18, 1, 0],
];
foreach ($policies as [$id, $code, $name, $quota, $half, $document]) {
    $db->prepare("INSERT IGNORE INTO leave_policies (leave_policy_id,leave_policy_code,leave_policy_name,annual_quota,accrual_frequency,accrual_method,allow_half_day,requires_document,is_paid,carry_forward_allowed,max_carry_forward_days,status) VALUES (?,?,?,?,'Yearly','Upfront',?,?,1,0,0,'Active')")->execute([$id,$code,$name,$quota,$half,$document]);
}
foreach ($db->query('SELECT employee_id FROM employees')->fetchAll(\PDO::FETCH_COLUMN) as $employeeId) {
    foreach ($policies as [$policyId,,, $quota]) {
        $balanceId = \Modules\Leave\Support\Uuid::generate();
        $db->prepare('INSERT IGNORE INTO employee_leave_balances (leave_balance_id,employee_id,leave_policy_id,leave_year,allocated_days,used_days,remaining_days) VALUES (?,?,?,?,?,0,?)')->execute([$balanceId,$employeeId,$policyId,$year,$quota,$quota]);
    }
}
echo "Leave demo policies and balances are ready.\n";
