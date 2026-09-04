<?php

require_once __DIR__ . '/../../../bootstrap/autoload.php';

use Core\Database;

$db = Database::connection();
foreach (array_filter(array_map('trim', explode(';', file_get_contents(__DIR__ . '/migrations.sql')))) as $statement) {
    $db->exec($statement);
}

$ensureColumn = static function (string $table, string $column, string $definition) use ($db): void {
    $columns = $db->query("SHOW COLUMNS FROM {$table}")->fetchAll(\PDO::FETCH_COLUMN);
    if (!in_array($column, $columns, true)) $db->exec("ALTER TABLE {$table} ADD COLUMN {$definition}");
};

$ensureColumn('attendance', 'break_started_at', 'break_started_at DATETIME NULL AFTER overtime');
$ensureColumn('attendance_corrections', 'approver_employee_id', 'approver_employee_id CHAR(36) NULL AFTER submitted_on');
$ensureColumn('attendance_corrections', 'review_remarks', 'review_remarks TEXT NULL AFTER approver_employee_id');
$ensureColumn('attendance_corrections', 'reviewed_at', 'reviewed_at DATETIME NULL AFTER review_remarks');

$db->exec("CREATE TABLE IF NOT EXISTS attendance_notifications (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, employee_id CHAR(36) NOT NULL, title VARCHAR(180) NOT NULL, message VARCHAR(500) NOT NULL, notification_type ENUM('success','warning','info') NOT NULL DEFAULT 'info', is_read BOOLEAN NOT NULL DEFAULT FALSE, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), KEY idx_attendance_notification_employee (employee_id, created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

echo "Attendance schema is ready.\n";
