<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

$db = \Core\Database::connection();
$db->exec("CREATE TABLE IF NOT EXISTS leave_approvals (approval_id CHAR(36) PRIMARY KEY, leave_request_id CHAR(36) NOT NULL, approver_employee_id CHAR(36) NOT NULL, approval_level ENUM('ASM','HR') NOT NULL, decision ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending', remarks TEXT NULL, action_date DATETIME NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (leave_request_id) REFERENCES leave_requests(leave_request_id), FOREIGN KEY (approver_employee_id) REFERENCES employees(employee_id))");
$db->exec("CREATE TABLE IF NOT EXISTS leave_request_documents (document_id CHAR(36) PRIMARY KEY, leave_request_id CHAR(36) NOT NULL, document_type VARCHAR(100) NOT NULL, file_name VARCHAR(255) NOT NULL, file_url VARCHAR(500) NOT NULL, uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (leave_request_id) REFERENCES leave_requests(leave_request_id) ON DELETE CASCADE)");
$db->exec("CREATE TABLE IF NOT EXISTS company_holidays (holiday_id CHAR(36) PRIMARY KEY, title VARCHAR(150) NOT NULL, holiday_date DATE NOT NULL, holiday_type ENUM('Public Holiday','Optional Holiday','Company Holiday') NOT NULL, location VARCHAR(100) NOT NULL DEFAULT 'All', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE KEY uq_company_holiday (holiday_date,title,location))");
echo "Missing Leave tables are ready.\n";
