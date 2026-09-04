<?php

require_once __DIR__ . '/../../../bootstrap/autoload.php';

use Core\Database;

$db = Database::connection();
$employees = $db->query('SELECT employee_id, reporting_manager_id FROM employees ORDER BY date_of_joining, employee_id')->fetchAll();
$insert = $db->prepare('INSERT IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, break_minutes, working_hours, overtime, status, shift, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

foreach ($employees as $employeeIndex => $employee) {
    for ($daysAgo = 1; $daysAgo <= 45; $daysAgo++) {
        $date = date('Y-m-d', strtotime("-$daysAgo days"));
        $weekday = (int) date('N', strtotime($date));
        $seed = ($employeeIndex + 3) * ($daysAgo + 7);
        $status = $weekday >= 6 ? 'Weekend' : ['Present', 'Present', 'Late', 'Work From Home', 'Present', 'Half Day', 'Absent'][$seed % 7];
        $checkIn = null; $checkOut = null; $break = 0; $hours = 0; $overtime = 0; $remarks = null;
        if (in_array($status, ['Present', 'Late', 'Work From Home'], true)) {
            $checkIn = $status === 'Late' ? '09:35:00' : '09:' . str_pad((string) ($seed % 15), 2, '0', STR_PAD_LEFT) . ':00';
            $checkOut = '18:' . str_pad((string) (10 + ($seed % 25)), 2, '0', STR_PAD_LEFT) . ':00';
            $break = 45;
            $hours = $status === 'Late' ? 7.7 : 8.2;
            $overtime = max(0, $hours - 8);
            $remarks = $status === 'Work From Home' ? 'Approved work from home' : ($status === 'Late' ? 'Late arrival' : null);
        } elseif ($status === 'Half Day') {
            $checkIn = '09:10:00'; $checkOut = '13:30:00'; $break = 15; $hours = 4.08; $remarks = 'Half day approved';
        } elseif ($status === 'Absent') {
            $remarks = 'No check-in recorded';
        }
        $insert->execute([$employee['employee_id'], $date, $checkIn, $checkOut, $break, $hours, $overtime, $status, 'General Shift', $remarks]);
    }
}

// One realistic pending correction per employee-with-manager makes the role queues testable.
$correction = $db->prepare("INSERT INTO attendance_corrections (employee_id, correction_date, requested_check_in, requested_check_out, reason, status, submitted_on, approver_employee_id) SELECT ?, ?, '09:00:00', '18:00:00', ?, 'Pending', ?, ? WHERE NOT EXISTS (SELECT 1 FROM attendance_corrections WHERE employee_id = ? AND reason = ?)");
foreach ($employees as $employee) {
    if (empty($employee['reporting_manager_id'])) continue;
    $reason = 'Demo correction request for approval workflow';
    $date = date('Y-m-d', strtotime('-7 days'));
    $correction->execute([$employee['employee_id'], $date, $reason, date('Y-m-d'), $employee['reporting_manager_id'], $employee['employee_id'], $reason]);
}

$roleRows = $db->query("SELECT UPPER(u.role) role_code, e.employee_id FROM users u INNER JOIN employees e ON e.employee_id=u.employee_id WHERE UPPER(u.role) IN ('ADMIN','HR','ASM')")->fetchAll();
$byRole = [];
foreach ($roleRows as $row) $byRole[$row['role_code']] = $row['employee_id'];
foreach ([['ASM', 'HR'], ['HR', 'ADMIN']] as [$requesterRole, $approverRole]) {
    if (empty($byRole[$requesterRole]) || empty($byRole[$approverRole])) continue;
    $reason = "Demo {$requesterRole} correction request for {$approverRole} approval";
    $date = date('Y-m-d', strtotime('-8 days'));
    $correction->execute([$byRole[$requesterRole], $date, $reason, date('Y-m-d'), $byRole[$approverRole], $byRole[$requesterRole], $reason]);
}

echo "Attendance demo data is ready.\n";
