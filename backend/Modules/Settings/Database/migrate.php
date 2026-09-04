<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

// Create module-owned tables first, then enhance shared master tables.
$files = [
    __DIR__ . '/Migrations/company_settings.sql',
    __DIR__ . '/Migrations/settings_user_preferences.sql',
    __DIR__ . '/Migrations/settings_schema.sql',
];

$db = \Core\Database::connection();
$userColumns = $db->query('SHOW COLUMNS FROM users')->fetchAll(\PDO::FETCH_COLUMN);
$userKey = in_array('user_id', $userColumns, true) ? 'user_id' : 'id';
$userIdType = $userKey === 'user_id' ? 'CHAR(36)' : 'INT UNSIGNED';

foreach ($files as $file) {
    if (!file_exists($file)) {
        echo "Skipping missing migration: " . basename($file) . "\n";
        continue;
    }
    $sql = file_get_contents($file);
    if ($sql === false) continue;
    $sql = str_replace(['{{USER_ID_TYPE}}', '{{USER_PRIMARY_KEY}}'], [$userIdType, $userKey], $sql);

    foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
        if (str_starts_with($statement, '--')) {
            $statement = preg_replace('/^--[^\n]*\n/m', '', $statement);
        }
        $statement = trim($statement);
        if ($statement !== '') {
            try {
                $db->exec($statement);
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

// Legacy databases do not always have head_employee_id. Add the display-only
// head field without relying on a particular column order.
$departmentTable = $db->query("SHOW TABLES LIKE 'departments'")->fetchColumn();
if ($departmentTable) {
    $departmentColumns = $db->query('SHOW COLUMNS FROM departments')->fetchAll(\PDO::FETCH_COLUMN);
    if (!in_array('head', $departmentColumns, true)) {
        $db->exec('ALTER TABLE departments ADD COLUMN head VARCHAR(150) NULL');
    }
}

echo "Settings schema is ready.\n";
