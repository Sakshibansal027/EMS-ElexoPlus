<?php

/**
 * Run the Authentication module migrations.
 *
 * Usage: php Modules/Authentication/Database/migrate.php
 */

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload)
    ? $composerAutoload
    : __DIR__ . '/../../../bootstrap/autoload.php';

use Core\Database;

$db = Database::connection();

// Keep the dependency order explicit: users must exist before user_roles.
$migrations = ['users.sql', 'password_resets.sql', 'access_control.sql'];

foreach ($migrations as $filename) {
    $file = __DIR__ . '/Migrations/' . $filename;
    if (!file_exists($file)) {
        fwrite(STDERR, "Migration file not found: $file\n");
        exit(1);
    }

    try {
        $db->exec(file_get_contents($file));
        echo "Applied: $filename\n";
    } catch (\Throwable $e) {
        fwrite(STDERR, "Migration '$filename' failed: " . $e->getMessage() . "\n");
        exit(1);
    }
}

echo "Migrations applied OK.\n";

foreach ($db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN) as $table) {
    echo "  - $table\n";
}
