<?php

/**
 * Run the Leave module migrations.
 *
 * Unlike Authentication (single migrations.sql), Leave's tables are
 * split into one .sql file per table under Migrations/, because
 * several of them have foreign keys into each other (and into
 * employees, from the Employee module) — they have to be applied in
 * dependency order, not just glob() order.
 *
 * Requires the Employee module's `employees` table to already exist
 * (leave_requests, leave_approvals and leave_balances all have a
 * foreign key into it).
 *
 * Usage: php Modules/Leave/Database/migrate.php
 */

require __DIR__ . '/../../../vendor/autoload.php';

use Core\Database;

$db = Database::connection();

// Dependency order: policies/holidays first (no FKs out), then
// requests (FKs to employees + policies), then approvals/balances
// (FK to requests / policies), then documents (FK to requests).
$migrationOrder = [
    'leave_policies.sql',
    'holidays.sql',
    'leave_requests.sql',
    'leave_approvals.sql',
    'leave_balances.sql',
    'leave_documents.sql',
];

$migrationsDir = __DIR__ . '/Migrations';

foreach ($migrationOrder as $file) {
    $path = $migrationsDir . '/' . $file;

    if (!file_exists($path)) {
        fwrite(STDERR, "Migration file not found: $path\n");
        exit(1);
    }

    $sql = file_get_contents($path);

    try {
        $db->exec($sql);
        echo "Applied: $file\n";
    } catch (\Throwable $e) {
        fwrite(STDERR, "Migration failed on $file: " . $e->getMessage() . "\n");
        exit(1);
    }
}

echo "\nLeave migrations applied OK.\n";

$leaveTables = ['leave_policies', 'company_holidays', 'leave_requests', 'leave_approvals', 'employee_leave_balances', 'leave_request_documents'];
foreach ($db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN) as $table) {
    if (in_array($table, $leaveTables, true)) {
        echo "  - $table\n";
    }
}