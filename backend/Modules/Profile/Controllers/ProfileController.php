<?php

namespace Modules\Profile\Controllers;

use Core\Database;
use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Authentication\Models\User;
use Modules\Authentication\Support\Request;

class ProfileController
{
    public function show(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];

        $user = $auth['user'];
        $employee = [];
        if (!empty($user['employee_id'])) {
            $stmt = Database::connection()->prepare(
                'SELECT e.employee_code, e.full_name, e.email, e.phone, e.gender, e.date_of_birth, e.date_of_joining,
                        d.department_name, g.designation_name, et.employment_type_name, wl.location_name,
                        manager.full_name AS manager_name
                 FROM employees e
                 LEFT JOIN departments d ON d.department_id=e.department_id
                 LEFT JOIN designations g ON g.designation_id=e.designation_id
                 LEFT JOIN employment_types et ON et.employment_type_id=e.employment_type_id
                 LEFT JOIN work_locations wl ON wl.work_location_id=e.work_location_id
                 LEFT JOIN employees manager ON manager.employee_id=e.reporting_manager_id
                 WHERE e.employee_id=?'
            );
            $stmt->execute([$user['employee_id']]);
            $employee = $stmt->fetch() ?: [];
        }

        return ['success' => true, 'profile' => [
            'personal' => [
                ['label' => 'Date of Birth', 'value' => $employee['date_of_birth'] ?? 'Not provided'],
                ['label' => 'Gender', 'value' => $employee['gender'] ?? 'Not provided'],
                ['label' => 'Phone', 'value' => $employee['phone'] ?? 'Not provided'],
            ],
            'employment' => [
                ['label' => 'Employee Code', 'value' => $employee['employee_code'] ?? 'Not assigned'],
                ['label' => 'Department', 'value' => $employee['department_name'] ?? 'Not assigned'],
                ['label' => 'Reporting To', 'value' => $employee['manager_name'] ?? 'Not assigned'],
                ['label' => 'Joining Date', 'value' => $employee['date_of_joining'] ?? 'Not provided'],
                ['label' => 'Employment Type', 'value' => $employee['employment_type_name'] ?? 'Not assigned'],
                ['label' => 'Work Location', 'value' => $employee['location_name'] ?? 'Not assigned'],
            ],
            'contact' => [
                ['label' => 'Email', 'value' => $employee['email'] ?? ($user['email'] ?? 'Not provided')],
                ['label' => 'Work Location', 'value' => $employee['location_name'] ?? 'Not assigned'],
            ],
            'emergency' => [],
            'bank' => [],
        ]];
    }

    public function changePassword(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];

        $current = (string) Request::input('current_password', '');
        $password = (string) Request::input('new_password', '');
        if (!password_verify($current, $auth['user']['password_hash'] ?? $auth['user']['password'] ?? '')) {
            return ['success' => false, 'message' => 'Current password is incorrect.', 'status' => 422];
        }
        if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/\d/', $password) || !preg_match('/[^A-Za-z0-9]/', $password)) {
            return ['success' => false, 'message' => 'New password does not meet the security requirements.', 'status' => 422];
        }
        User::updatePassword(User::idOf($auth['user']), password_hash($password, PASSWORD_BCRYPT));
        return ['success' => true, 'message' => 'Password updated successfully.'];
    }
}
