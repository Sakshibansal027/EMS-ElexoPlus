<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

$sql = file_get_contents(__DIR__ . '/Migrations/notifications.sql');
if ($sql === false) throw new RuntimeException('Notifications migration file is missing.');

$db = \Core\Database::connection();
$userColumns = $db->query('SHOW COLUMNS FROM users')->fetchAll(\PDO::FETCH_COLUMN);
$userKey = in_array('user_id', $userColumns, true) ? 'user_id' : 'id';
$userIdType = $userKey === 'user_id' ? 'CHAR(36)' : 'INT UNSIGNED';
$sql = str_replace(['{{USER_ID_TYPE}}', '{{USER_PRIMARY_KEY}}'], [$userIdType, $userKey], $sql);

foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
    if (str_starts_with($statement, '--')) {
        $statement = preg_replace('/^--[^\n]*\n/m', '', $statement);
    }
    if ($statement === '') continue;
    try {
        $db->exec($statement);
    } catch (\PDOException $exception) {
        $message = $exception->getMessage();
        if (!str_contains($message, 'already exists') && !str_contains($message, 'Duplicate key name')) throw $exception;
    }
}

echo "Notifications schema is ready.\n";
