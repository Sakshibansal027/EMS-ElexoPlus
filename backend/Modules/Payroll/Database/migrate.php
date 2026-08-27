<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

// These migrations match the UUID-based Employee and Authentication schemas
// used by the application. They are intentionally executed in FK order.
$files = [
    'salary_structures.sql' => 'salary_structures',
    'employee_salary.sql' => 'employee_salary_structures',
    'payroll.sql' => 'payrolls',
    'incentives.sql' => 'incentives',
    'deductions.sql' => 'deductions',
    'payslips.sql' => 'payslips',
];
foreach ($files as $file => $table) {
    $exists = \Core\Database::connection()->prepare('SHOW TABLES LIKE ?');
    $exists->execute([$table]);
    if ($exists->fetchColumn()) {
        echo "Skipped (already exists): $table\n";
        continue;
    }
    $sql = file_get_contents(__DIR__ . '/Migrations/' . $file);
    if ($sql === false) throw new RuntimeException("Migration file is missing: $file");
    // Historical export headers point at a developer-local database. The
    // configured connection already chooses the correct database.
    $sql = preg_replace('/^USE\\s+[^;]+;\\s*/mi', '', $sql);
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
        \Core\Database::connection()->exec($statement);
    }
    echo "Applied: $file\n";
}

// Earlier Payroll exports did not include this column, although the API uses
// it to deactivate templates and to select a valid structure for a run.
$columns = \Core\Database::connection()->query('SHOW COLUMNS FROM salary_structures')->fetchAll(\PDO::FETCH_COLUMN);
if (!in_array('status', $columns, true)) {
    \Core\Database::connection()->exec("ALTER TABLE salary_structures ADD COLUMN status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active' AFTER bonus_frequency");
    echo "Applied compatibility update: salary_structures.status\n";
}

$indexes = \Core\Database::connection()->query('SHOW INDEX FROM employee_salary_structures')->fetchAll(\PDO::FETCH_ASSOC);
$indexNames = array_column($indexes, 'Key_name');
if (!in_array('uq_employee_salary_structure_effective_from', $indexNames, true)) {
    \Core\Database::connection()->exec('ALTER TABLE employee_salary_structures ADD UNIQUE INDEX uq_employee_salary_structure_effective_from (employee_id, effective_from)');
    echo "Applied compatibility update: employee salary structure effective-date uniqueness\n";
}
echo "Payroll schema is ready.\n";
