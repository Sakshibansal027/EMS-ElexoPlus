<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

use Core\Database;
use Modules\Notifications\Support\Uuid;

$db = Database::connection();
$columns = $db->query('SHOW COLUMNS FROM users')->fetchAll(\PDO::FETCH_COLUMN);
$userKey = in_array('user_id', $columns, true) ? 'user_id' : 'id';
$users = $db->query("SELECT {$userKey} AS user_id, role FROM users WHERE LOWER(status) NOT IN ('inactive', 'disabled', 'suspended')")->fetchAll();

$insert = $db->prepare(
    'INSERT INTO notifications (notification_id, user_id, title, message, type, category, link)
     SELECT ?, ?, ?, ?, ?, ?, ?
     WHERE NOT EXISTS (
        SELECT 1 FROM notifications WHERE user_id = ? AND title = ? AND category = ?
     )'
);

foreach ($users as $user) {
    $items = [
        ['Welcome to ElexoPlus', 'Your account is ready. Use the dashboard to review your work updates.', 'Info', 'system', '/dashboard'],
        ['Attendance module is active', 'Check in, manage breaks and submit attendance corrections from Attendance.', 'Info', 'attendance', '/attendance'],
    ];

    if (in_array(strtoupper((string) $user['role']), ['ADMIN', 'HR', 'ASM'], true)) {
        $items[] = ['Review pending requests', 'Open Leave Management to review requests assigned to you.', 'Warning', 'leave', '/leave'];
    }

    foreach ($items as [$title, $message, $type, $category, $link]) {
        $insert->execute([Uuid::generate(), $user['user_id'], $title, $message, $type, $category, $link, $user['user_id'], $title, $category]);
    }
}

echo "Notification demo data is ready.\n";
