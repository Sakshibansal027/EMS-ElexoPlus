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

        $address = $this->firstRow('SELECT address_line_1, city, state, country, postal_code FROM employee_addresses WHERE employee_id=? AND address_type=?', [$user['employee_id'] ?? '', 'Current']);
        $bank = $this->firstRow('SELECT bank_name, account_number, ifsc_code FROM employee_bank_accounts WHERE employee_id=? AND is_primary=1', [$user['employee_id'] ?? '']);
        $statutory = $this->firstRow('SELECT pan_number FROM employee_statutory_details WHERE employee_id=?', [$user['employee_id'] ?? '']);
        $documents = $this->rows('SELECT document_id, document_name, document_type, status FROM employee_documents WHERE employee_id=? ORDER BY uploaded_at DESC', [$user['employee_id'] ?? '']);

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
                ['label' => 'Address', 'value' => $address['address_line_1'] ?? 'Not provided'],
                ['label' => 'City', 'value' => $address['city'] ?? 'Not provided'],
                ['label' => 'State', 'value' => $address['state'] ?? 'Not provided'],
                ['label' => 'PIN Code', 'value' => $address['postal_code'] ?? 'Not provided'],
                ['label' => 'Work Location', 'value' => $employee['location_name'] ?? 'Not assigned'],
            ],
            'emergency' => [],
            'bank' => [
                ['label' => 'Bank Name', 'value' => $bank['bank_name'] ?? 'Not provided'],
                ['label' => 'Account Number', 'value' => $this->mask($bank['account_number'] ?? '')],
                ['label' => 'IFSC Code', 'value' => $bank['ifsc_code'] ?? 'Not provided'],
                ['label' => 'PAN Number', 'value' => $this->mask($statutory['pan_number'] ?? '')],
            ],
            'documents' => array_map(static fn(array $document) => ['id' => $document['document_id'], 'name' => $document['document_name'], 'type' => $document['document_type'], 'status' => $document['status']], $documents),
        ]];
    }

    public function downloadDocument(array $params): string|array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        $employeeId = (string) ($auth['user']['employee_id'] ?? '');
        $document = $employeeId === '' ? [] : $this->firstRow('SELECT document_name, document_url FROM employee_documents WHERE employee_id=? AND document_id=?', [$employeeId, $params['documentId']]);
        if (!$document) return ['success' => false, 'message' => 'Document not found.', 'status' => 404];
        $storageRoot = realpath(rtrim((string) config('upload.path'), '/\\'));
        $path = $storageRoot ? realpath($storageRoot . DIRECTORY_SEPARATOR . ltrim($document['document_url'], '/\\')) : false;
        if (!$storageRoot || !$path || !str_starts_with($path, $storageRoot . DIRECTORY_SEPARATOR)) return ['success' => false, 'message' => 'Document file is unavailable.', 'status' => 404];
        header('Content-Type: ' . ((new \finfo(FILEINFO_MIME_TYPE))->file($path) ?: 'application/octet-stream'));
        header('Content-Length: ' . filesize($path));
        header('Content-Disposition: inline; filename="' . str_replace('"', '', $document['document_name']) . '"');
        return (string) file_get_contents($path);
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

    private function firstRow(string $sql, array $bindings): array
    {
        try {
            $stmt = Database::connection()->prepare($sql);
            $stmt->execute($bindings);
            return $stmt->fetch() ?: [];
        } catch (\Throwable) {
            return [];
        }
    }

    private function rows(string $sql, array $bindings): array
    {
        try { $stmt = Database::connection()->prepare($sql); $stmt->execute($bindings); return $stmt->fetchAll(); }
        catch (\Throwable) { return []; }
    }

    private function mask(string $value): string
    {
        if ($value === '') return 'Not provided';
        return str_repeat('•', max(0, strlen($value) - 4)) . substr($value, -4);
    }
}
