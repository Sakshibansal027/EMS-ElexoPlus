<?php

/**
 * Run Sales module migrations in dependency order.
 * Usage: php Modules/Sales/Database/migrate.php
 */

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload)
    ? $composerAutoload
    : __DIR__ . '/../../../bootstrap/autoload.php';

use Core\Database;

$db = Database::connection();
$migrationDirectory = __DIR__ . '/Migrations';

// Foreign-key dependencies: employees -> territories/target types -> leads -> clients/orders.
$migrations = [
    'territories.sql',
    'target_types.sql',
    'leads.sql',
    'lead_status_history.sql',
    'sales_activity_logs.sql',
    'clients.sql',
    'orders.sql',
    'territory_assignments.sql',
    'targets.sql',
    'visits.sql',
    'expenses.sql',
    'daily_activity_reports.sql',
];

foreach ($migrations as $filename) {
    $file = $migrationDirectory . '/' . $filename;
    if (!file_exists($file)) {
        fwrite(STDERR, "Migration file not found: $file\n");
        exit(1);
    }

    try {
        $sql = file_get_contents($file);
        // Migration files are also usable in the legacy SQL console, where
        // they include a fixed USE statement. The app database is configured
        // through .env, so ignore that database-switch directive here.
        $sql = preg_replace('/^\s*USE\s+[^;]+;\s*/mi', '', $sql);
        $db->exec($sql);
        echo "Applied: $filename\n";
    } catch (Throwable $exception) {
        fwrite(STDERR, "Migration '$filename' failed: {$exception->getMessage()}\n");
        exit(1);
    }
}

echo "Sales migrations applied OK.\n";
