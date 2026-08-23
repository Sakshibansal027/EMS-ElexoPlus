<?php

$composerAutoload = __DIR__ . '/../../../vendor/autoload.php';
require file_exists($composerAutoload) ? $composerAutoload : __DIR__ . '/../../../bootstrap/autoload.php';

$db = \Core\Database::connection();
$columns = $db->query('SHOW COLUMNS FROM users')->fetchAll(\PDO::FETCH_COLUMN);
if (!in_array('employee_id', $columns, true)) $db->exec('ALTER TABLE users ADD COLUMN employee_id CHAR(36) NULL UNIQUE AFTER id');

$users = $db->query("SELECT id,email,name,designation,role FROM users WHERE role IN ('ADMIN','HR','ASM','SALES_EXECUTIVE') ORDER BY id LIMIT 4")->fetchAll();
$reference = [
    'ADMIN' => ['00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011'],
    'HR' => ['00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000012'],
    'ASM' => ['00000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000013'],
    'SALES_EXECUTIVE' => ['00000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000014'],
];
$managerId = null;
foreach ($users as $user) {
    [$departmentId, $designationId] = $reference[$user['role']];
    $employeeId = $db->prepare('SELECT employee_id FROM employees WHERE email=?'); $employeeId->execute([$user['email']]); $employeeId=$employeeId->fetchColumn();
    if (!$employeeId) {
        $employeeId = \Modules\Employee\Support\Uuid::generate();
        $db->prepare('INSERT INTO employees (employee_id,employee_code,full_name,email,phone,gender,department_id,designation_id,reporting_manager_id,date_of_joining,employment_type_id,work_location_id,employee_status_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')->execute([$employeeId,'EMP-DEMO-'.$user['id'],$user['name'],$user['email'],'9999999999','Other',$departmentId,$designationId,$user['role']==='SALES_EXECUTIVE'?$managerId:null,date('Y-m-d'),'00000000-0000-4000-8000-000000000021','00000000-0000-4000-8000-000000000031','00000000-0000-4000-8000-000000000041']);
    }
    if ($user['role'] === 'ASM') $managerId = $employeeId;
    $db->prepare('UPDATE users SET employee_id=? WHERE id=?')->execute([$employeeId,$user['id']]);
}
echo "Demo users are mapped to employee profiles.\n";
