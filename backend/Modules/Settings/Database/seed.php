<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

use Core\Database;
use Modules\Settings\Support\Uuid;

$db = Database::connection();

// Seed company_settings if empty
$check = $db->query('SELECT COUNT(*) FROM company_settings')->fetchColumn();
if ((int) $check === 0) {
    $id = Uuid::generate();
    $stmt = $db->prepare(
        'INSERT INTO company_settings (company_setting_id, company_name, tagline, email, phone, website, address, city, state, country, pincode, working_days, working_hours_start, working_hours_end, timezone, date_format, currency)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id,
        'ElexoPlus Pvt. Ltd.',
        'Empowering Enterprises',
        'contact@elexoplus.com',
        '+91 9876543210',
        'www.elexoplus.com',
        '123, Tech Park, Sector 21, Gurugram, Haryana - 122001',
        'Gurugram',
        'Haryana',
        'India',
        '122001',
        json_encode(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
        '09:00',
        '18:00',
        'Asia/Kolkata',
        'DD-MMM-YYYY',
        'INR',
    ]);
    echo "Seeded company_settings.\n";
} else {
    echo "company_settings already has data, skipping.\n";
}

// Seed departments with head values if head column is NULL
$departments = $db->query('SELECT department_id, department_name FROM departments ORDER BY department_name')->fetchAll();
$heads = [
    'Administration' => 'System Admin',
    'Human Resources' => 'Sakshi Bansal',
    'Sales' => 'Gaurav Kumar',
    'Operations' => 'Rajesh Mehta',
];
foreach ($departments as $dept) {
    if (empty($dept['department_id'])) continue;
    $head = $heads[$dept['department_name']] ?? null;
    if ($head) {
        $stmt = $db->prepare('UPDATE departments SET head = ? WHERE department_id = ? AND (head IS NULL OR head = \'\')');
        $stmt->execute([$head, $dept['department_id']]);
    }
}
echo "Departments head data synced.\n";

echo "Settings seed complete.\n";
