<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

$sql = file_get_contents(__DIR__ . '/Migrations/notifications.sql');
if ($sql === false) throw new RuntimeException('Notifications migration file is missing.');

foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
    if (str_starts_with($statement, '--')) {
        $statement = preg_replace('/^--[^\n]*\n/m', '', $statement);
    }
    if ($statement !== '') \Core\Database::connection()->exec($statement);
}

echo "Notifications schema is ready.\n";
