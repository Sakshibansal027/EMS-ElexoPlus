<?php
require __DIR__ . '/bootstrap/autoload.php';

$db = Core\Database::connection();
$rows = $db->query(
    'SELECT r.leave_request_id, r.status, r.employee_id AS requester_id, a.approver_employee_id, a.approval_level, a.decision,
            requester.employee_code AS requester_code, requester.full_name AS requester_name,
            approver.employee_code AS approver_code, approver.full_name AS approver_name,
            u.email AS approver_email, u.role AS approver_role
     FROM leave_requests r
     LEFT JOIN leave_approvals a ON a.leave_request_id = r.leave_request_id
     LEFT JOIN employees requester ON requester.employee_id = r.employee_id
     LEFT JOIN employees approver ON approver.employee_id = a.approver_employee_id
     LEFT JOIN users u ON u.employee_id = a.approver_employee_id
     ORDER BY r.applied_at DESC'
)->fetchAll();
echo json_encode($rows, JSON_PRETTY_PRINT);
