<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

$sql = file_get_contents(__DIR__ . '/Migrations/employee_master_setup.sql');
if ($sql === false) throw new RuntimeException('Employee Master migration file is missing.');

foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
    if (str_starts_with($statement, '--')) {
        $statement = preg_replace('/^--[^\n]*\n/m', '', $statement);
    }
    if ($statement !== '') \Core\Database::connection()->exec($statement);
}

echo "Employee Master schema is ready.\n";
