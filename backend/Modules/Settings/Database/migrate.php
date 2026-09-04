<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

// Run schema enhancement migrations (ALTER TABLE statements for existing tables)
$files = [
    __DIR__ . '/Migrations/settings_schema.sql',
];

foreach ($files as $file) {
    if (!file_exists($file)) {
        echo "Skipping missing migration: " . basename($file) . "\n";
        continue;
    }
    $sql = file_get_contents($file);
    if ($sql === false) continue;

    foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
        if (str_starts_with($statement, '--')) {
            $statement = preg_replace('/^--[^\n]*\n/m', '', $statement);
        }
        $statement = trim($statement);
        if ($statement !== '') {
            try {
                \Core\Database::connection()->exec($statement);
            } catch (\PDOException $e) {
                // Ignore duplicate column/table errors for idempotent migrations
                $msg = $e->getMessage();
                if (!str_contains($msg, 'Duplicate') && !str_contains($msg, 'already exists') && !str_contains($msg, 'Column')) {
                    echo "Migration warning: " . $msg . "\n";
                }
            }
        }
    }
}

echo "Settings schema is ready.\n";
