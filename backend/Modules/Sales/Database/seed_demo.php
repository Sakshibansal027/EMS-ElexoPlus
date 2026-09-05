<?php

/**
 * Idempotent Sales demo data for the four standard demo employees.
 * Run after migrate.php: php Modules/Sales/Database/seed_demo.php
 */

$autoload = __DIR__ . '/../../../bootstrap/autoload.php';
require $autoload;

use Core\Database;

$db = Database::connection();

/** Resolve stable foreign-key UUIDs from the current Employee Master rows. */
$resolveEmployee = $db->prepare('SELECT employee_id FROM employees WHERE email=? LIMIT 1');
$resolveEmployee->execute(['gaurav@elexoplus.com']);
$asmId = (string) $resolveEmployee->fetchColumn();
$resolveEmployee->execute(['nisha@elexoplus.com']);
$seId = (string) $resolveEmployee->fetchColumn();

if ($asmId === '' || $seId === '') {
    throw new RuntimeException('Sales demo seed requires the ASM and Sales Executive Employee Master records.');
}

$statements = [
    "INSERT IGNORE INTO territories (territory_id, territory_name, description, status) VALUES
        ('20000000-0000-4000-8000-000000000001', 'North Zone', 'North sales territory', 'Active'),
        ('20000000-0000-4000-8000-000000000002', 'Central Zone', 'Central sales territory', 'Active')",
    "INSERT IGNORE INTO target_types (target_type_id, target_type_name, description, status) VALUES
        ('21000000-0000-4000-8000-000000000001', 'Revenue', 'Revenue target', 'Active')",
    "INSERT IGNORE INTO territory_assignments (assignment_id, territory_id, assigned_to_employee_id, assigned_by_employee_id, effective_from, status, remarks) VALUES
        ('22000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'EMP-DEMO-4', 'EMP-DEMO-3', CURDATE(), 'Active', 'Demo assignment')",
    "INSERT IGNORE INTO leads (lead_id, segment, lead_name, company_name, contact_person, phone_number, email, requirement, estimated_value, assigned_employee_id, lead_source, lead_priority, current_status, region, next_follow_up_date, remarks) VALUES
        ('23000000-0000-4000-8000-000000000001', 'B2B', 'Acme Retail', 'Acme Retail Pvt Ltd', 'Riya Mehta', '9876500001', 'riya@acme.example', 'Retail inventory solution', 250000, 'EMP-DEMO-4', 'Website', 'High', 'Contacted', 'North Zone', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Demo B2B lead'),
        ('23000000-0000-4000-8000-000000000002', 'B2C', 'Vikram Shah', NULL, 'Vikram Shah', '9876500002', 'vikram@example.test', 'Individual product enquiry', 45000, 'EMP-DEMO-4', 'Reference', 'Medium', 'New Lead', 'North Zone', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'Demo B2C lead')",
    "INSERT IGNORE INTO clients (client_id, lead_id, client_name, contact_person, phone_number, email, address, city, state, pincode, status, assigned_employee_id, remarks) VALUES
        ('24000000-0000-4000-8000-000000000001', '23000000-0000-4000-8000-000000000001', 'Acme Retail Pvt Ltd', 'Riya Mehta', '9876500001', 'riya@acme.example', 'Sector 18', 'Noida', 'Uttar Pradesh', '201301', 'Active', 'EMP-DEMO-4', 'Converted demo client'),
        ('24000000-0000-4000-8000-000000000002', '23000000-0000-4000-8000-000000000002', 'Vikram Shah', 'Vikram Shah', '9876500002', 'vikram@example.test', 'MG Road', 'Gurugram', 'Haryana', '122001', 'Active', 'EMP-DEMO-4', 'Demo client')",
    "INSERT IGNORE INTO orders (order_id, order_no, client_id, employee_id, lead_id, territory_id, order_type, item_count, order_value, order_status, payment_status, delivery_address, order_date, remarks) VALUES
        ('25000000-0000-4000-8000-000000000001', 'ORD-DEMO-1001', '24000000-0000-4000-8000-000000000001', 'EMP-DEMO-4', '23000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'B2B', 12, 180000, 'Delivered', 'Paid', 'Sector 18, Noida', CURDATE(), 'Delivered demo order'),
        ('25000000-0000-4000-8000-000000000002', 'ORD-DEMO-1002', '24000000-0000-4000-8000-000000000002', 'EMP-DEMO-4', '23000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'B2C', 2, 25000, 'Pending', 'Pending', 'MG Road, Gurugram', CURDATE(), 'Pending demo order')",
    "INSERT IGNORE INTO targets (target_id, target_type_id, assigned_to_employee_id, territory_id, target_period, period_start, period_end, target_value, achieved_value, status, assigned_by_employee_id, remarks) VALUES
        ('26000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001', 'EMP-DEMO-4', '20000000-0000-4000-8000-000000000001', 'Monthly', DATE_FORMAT(CURDATE(), '%Y-%m-01'), LAST_DAY(CURDATE()), 300000, 180000, 'Active', 'EMP-DEMO-3', 'Current month demo target')",
    "INSERT IGNORE INTO client_visits (visit_id, employee_id, client_id, visit_date, purpose, discussion_summary, outcome, next_followup_date) VALUES
        ('27000000-0000-4000-8000-000000000001', 'EMP-DEMO-4', '24000000-0000-4000-8000-000000000001', CURDATE(), 'Product discussion', 'Discussed enterprise package.', 'Completed', DATE_ADD(CURDATE(), INTERVAL 7 DAY))",
    "INSERT IGNORE INTO expenses (expense_id, employee_id, expense_date, expense_type, amount, description, status, reviewed_by_employee_id, reviewed_at, review_remarks) VALUES
        ('28000000-0000-4000-8000-000000000001', 'EMP-DEMO-4', CURDATE(), 'Travel', 850, 'Client visit travel expense', 'Approved', 'EMP-DEMO-3', NOW(), 'Approved demo expense')",
    "INSERT IGNORE INTO daily_activity_reports (report_id, employee_id, report_date, total_client_visits, total_leads_generated, total_followups, activity_summary, challenges_faced, plan_for_next_day, review_status, reviewed_by_employee_id, reviewed_at, asm_feedback) VALUES
        ('29000000-0000-4000-8000-000000000001', 'EMP-DEMO-4', CURDATE(), 1, 2, 3, 'Met Acme Retail and followed up with prospects.', 'None', 'Follow up with Acme Retail.', 'Reviewed', 'EMP-DEMO-3', NOW(), 'Good progress')",
];

foreach ($statements as $statement) {
    $db->exec(str_replace(['EMP-DEMO-3', 'EMP-DEMO-4'], [$asmId, $seId], $statement));
}

echo "Sales demo data is ready.\n";
