<?php

/**
 * Run the Authentication module migrations.
 *
 * Usage: php Modules/Authentication/Database/migrate.php
 */

require __DIR__ . '/../../../vendor/autoload.php';

use Core\Database;

$db = Database::connection();

$migration = __DIR__ . '/migrations.sql';

if (!file_exists($migration)) {
    fwrite(STDERR, "Migration file not found: $migration\n");
    exit(1);
}

$sql = file_get_contents($migration);

try {
    $db->exec($sql);
} catch (\Throwable $e) {
    fwrite(STDERR, "Migration failed: " . $e->getMessage() . "\n");
    exit(1);
}

echo "Migrations applied OK.\n";

foreach ($db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN) as $table) {
    echo "  - $table\n";
}
