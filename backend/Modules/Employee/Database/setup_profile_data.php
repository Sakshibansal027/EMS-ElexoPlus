<?php

// Idempotent Employee Master/Profile extension and demo data seed.
$autoload = __DIR__ . '/../../../bootstrap/autoload.php';
require $autoload;

use Core\Database;
use Modules\Employee\Support\Uuid;

$db = Database::connection();
$statements = [
    "CREATE TABLE IF NOT EXISTS employee_addresses (address_id CHAR(36) PRIMARY KEY, employee_id CHAR(36) NOT NULL, address_type ENUM('Current','Permanent') NOT NULL DEFAULT 'Current', address_line_1 VARCHAR(255) NOT NULL, city VARCHAR(100) NOT NULL, state VARCHAR(100) NOT NULL, country VARCHAR(100) NOT NULL DEFAULT 'India', postal_code VARCHAR(20) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE KEY uq_employee_address_type (employee_id,address_type), FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE)",
    "CREATE TABLE IF NOT EXISTS employee_bank_accounts (bank_account_id CHAR(36) PRIMARY KEY, employee_id CHAR(36) NOT NULL, bank_name VARCHAR(150) NOT NULL, account_number VARCHAR(50) NOT NULL, ifsc_code VARCHAR(20) NOT NULL, is_primary BOOLEAN NOT NULL DEFAULT TRUE, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE KEY uq_employee_primary_bank (employee_id,is_primary), FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE)",
    "CREATE TABLE IF NOT EXISTS employee_statutory_details (statutory_detail_id CHAR(36) PRIMARY KEY, employee_id CHAR(36) NOT NULL UNIQUE, pan_number VARCHAR(20) NOT NULL, aadhaar_number VARCHAR(20) NOT NULL, uan_number VARCHAR(20) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE)",
    "CREATE TABLE IF NOT EXISTS employee_documents (document_id CHAR(36) PRIMARY KEY, employee_id CHAR(36) NOT NULL, document_type VARCHAR(100) NOT NULL, document_name VARCHAR(255) NOT NULL, document_url VARCHAR(500) NOT NULL, status ENUM('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending', uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, verified_at DATETIME NULL, verified_by CHAR(36) NULL, FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE)",
];
foreach ($statements as $sql) $db->exec($sql);

$employees = $db->query('SELECT employee_id, employee_code FROM employees')->fetchAll();
foreach ($employees as $index => $employee) {
    $id = $employee['employee_id'];
    $suffix = str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT);
    $db->prepare("INSERT IGNORE INTO employee_addresses (address_id,employee_id,address_type,address_line_1,city,state,country,postal_code) VALUES (?,?, 'Current', ?, 'New Delhi', 'Delhi', 'India', '1100??')")
        ->execute([Uuid::generate(), $id, 'Demo address for ' . $employee['employee_code']]);
    $db->prepare('INSERT IGNORE INTO employee_bank_accounts (bank_account_id,employee_id,bank_name,account_number,ifsc_code,is_primary) VALUES (?,?,?,?,?,1)')
        ->execute([Uuid::generate(), $id, 'Demo Bank', '00000000' . $suffix, 'DEMO0000' . ($index + 1)]);
    $db->prepare('INSERT IGNORE INTO employee_statutory_details (statutory_detail_id,employee_id,pan_number,aadhaar_number,uan_number) VALUES (?,?,?,?,?)')
        ->execute([Uuid::generate(), $id, 'DEMO' . $suffix . 'X', '99990000' . $suffix, '10000000' . $suffix]);
    $db->prepare("INSERT IGNORE INTO employee_documents (document_id,employee_id,document_type,document_name,document_url,status) VALUES (?,?,?,?,?,'Verified')")
        ->execute([Uuid::generate(), $id, 'Identity Proof', 'demo-id-proof.pdf', '/uploads/demo-id-proof.pdf']);
}

echo "Employee profile tables and demo data are ready.\n";
