<?php

namespace Modules\Employee\Repositories;

use Core\Database;
use Modules\Employee\Support\Uuid;

class EmployeeRepository
{
    public function all(): array
    {
        return Database::connection()->query(
            'SELECT e.*, d.department_name AS department, ds.designation_name AS designation,
                    et.employment_type_name AS employment_type, wl.location_name AS work_location,
                    es.status_name AS employee_status, manager.full_name AS manager_name
             FROM employees e
             JOIN departments d ON d.department_id=e.department_id
             JOIN designations ds ON ds.designation_id=e.designation_id
             JOIN employment_types et ON et.employment_type_id=e.employment_type_id
             JOIN work_locations wl ON wl.work_location_id=e.work_location_id
             JOIN employee_statuses es ON es.employee_status_id=e.employee_status_id
             LEFT JOIN employees manager ON manager.employee_id=e.reporting_manager_id
             ORDER BY e.created_at DESC'
        )->fetchAll();
    }

    public function find(string $id): ?array
    {
        foreach ($this->all() as $employee) {
            if ($employee['employee_id'] === $id || $employee['employee_code'] === $id) return $employee;
        }
        return null;
    }

    public function create(array $data): array
    {
        $id = Uuid::generate();
        $stmt = Database::connection()->prepare(
            'INSERT INTO employees (employee_id, employee_code, full_name, email, phone, gender, date_of_birth, department_id, designation_id, reporting_manager_id, date_of_joining, employment_type_id, work_location_id, employee_status_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$id, $data['employee_code'], $data['full_name'], $data['email'], $data['phone'], $data['gender'], $data['date_of_birth'] ?? null, $data['department_id'], $data['designation_id'], $data['reporting_manager_id'] ?? null, $data['date_of_joining'], $data['employment_type_id'], $data['work_location_id'], $data['employee_status_id']]);
        return $this->find($id);
    }

    public function update(string $id, array $data): ?array
    {
        $allowed = ['full_name','email','phone','gender','date_of_birth','department_id','designation_id','reporting_manager_id','date_of_joining','employment_type_id','work_location_id','employee_status_id'];
        $sets = []; $values = [];
        foreach ($allowed as $field) if (array_key_exists($field, $data)) { $sets[] = "$field = ?"; $values[] = $data[$field] ?: null; }
        if (!$sets) return $this->find($id);
        $values[] = $id;
        Database::connection()->prepare('UPDATE employees SET ' . implode(', ', $sets) . ' WHERE employee_id = ?')->execute($values);
        return $this->find($id);
    }

    public function deactivate(string $id): bool
    {
        $stmt = Database::connection()->prepare("UPDATE employees e JOIN employee_statuses es ON es.employee_status_id=e.employee_status_id SET e.employee_status_id=(SELECT employee_status_id FROM employee_statuses WHERE status_name='Inactive' LIMIT 1) WHERE e.employee_id=?");
        return $stmt->execute([$id]);
    }

    public function options(): array
    {
        $db = Database::connection();
        return [
            'departments' => $db->query("SELECT department_id id, department_name name FROM departments WHERE status='Active' ORDER BY department_name")->fetchAll(),
            'designations' => $db->query("SELECT designation_id id, designation_name name FROM designations WHERE status='Active' ORDER BY designation_name")->fetchAll(),
            'employment_types' => $db->query("SELECT employment_type_id id, employment_type_name name FROM employment_types WHERE status='Active' ORDER BY employment_type_name")->fetchAll(),
            'work_locations' => $db->query("SELECT work_location_id id, location_name name FROM work_locations WHERE status='Active' ORDER BY location_name")->fetchAll(),
            'statuses' => $db->query("SELECT employee_status_id id, status_name name FROM employee_statuses WHERE status='Active' ORDER BY status_name")->fetchAll(),
            'managers' => $db->query('SELECT employee_id id, full_name name FROM employees ORDER BY full_name')->fetchAll(),
        ];
    }

    public function resolveReference(string $table, string $idColumn, string $nameColumn, string $value): ?string
    {
        if ($value === '') return null;
        $stmt = Database::connection()->prepare("SELECT $idColumn FROM $table WHERE $idColumn = ? OR $nameColumn = ? LIMIT 1");
        $stmt->execute([$value, $value]);
        return $stmt->fetchColumn() ?: null;
    }

    public function documentsForEmployee(string $employeeId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT document_id, document_type, document_name, status
             FROM employee_documents WHERE employee_id = ? ORDER BY uploaded_at DESC'
        );
        $stmt->execute([$employeeId]);
        return $stmt->fetchAll();
    }

    public function viewData(string $employeeId): array
    {
        $db = Database::connection();
        $address = $db->prepare("SELECT address_line_1 FROM employee_addresses WHERE employee_id=? AND address_type='Current' LIMIT 1");
        $address->execute([$employeeId]);
        $documents = $db->prepare('SELECT document_id, document_name, document_type, status FROM employee_documents WHERE employee_id=? ORDER BY uploaded_at DESC');
        $documents->execute([$employeeId]);
        $balances = $db->prepare('SELECT p.leave_policy_code, b.remaining_days FROM employee_leave_balances b JOIN leave_policies p ON p.leave_policy_id=b.leave_policy_id WHERE b.employee_id=? AND b.leave_year=?');
        $balances->execute([$employeeId, (int) date('Y')]);
        $bank = $db->prepare('SELECT bank_name, account_number, ifsc_code FROM employee_bank_accounts WHERE employee_id=? AND is_primary=1 LIMIT 1');
        $bank->execute([$employeeId]);
        $statutory = $db->prepare('SELECT pan_number, aadhaar_number, uan_number FROM employee_statutory_details WHERE employee_id=? LIMIT 1');
        $statutory->execute([$employeeId]);
        $compensation = $db->prepare('SELECT basic_salary, hra, allowance, bonus, gross_salary, net_salary FROM employee_compensations WHERE employee_id=? LIMIT 1');
        $compensation->execute([$employeeId]);
        return ['address' => $address->fetch() ?: [], 'documents' => $documents->fetchAll(), 'balances' => $balances->fetchAll(), 'bank' => $bank->fetch() ?: [], 'statutory' => $statutory->fetch() ?: [], 'compensation' => $compensation->fetch() ?: []];
    }

    public function saveProfileData(string $employeeId, array $data): void
    {
        $db = Database::connection();
        if (isset($data['address']) && trim((string) $data['address']) !== '') {
            $this->upsert($db, 'employee_addresses', 'employee_id', $employeeId,
                ['address_line_1' => trim((string) $data['address']), 'city' => 'Not specified', 'state' => 'Not specified', 'country' => 'India', 'postal_code' => '000000'],
                ['address_id' => Uuid::generate(), 'employee_id' => $employeeId, 'address_type' => 'Current']);
        }
        if (array_key_exists('bankName', $data) && trim((string) $data['bankName']) !== '') {
            $this->upsert($db, 'employee_bank_accounts', 'employee_id', $employeeId,
                ['bank_name' => trim((string) $data['bankName']), 'account_number' => trim((string) $data['accountNo']), 'ifsc_code' => strtoupper(trim((string) $data['ifsc']))],
                ['bank_account_id' => Uuid::generate(), 'employee_id' => $employeeId, 'is_primary' => 1]);
        }
        if (array_key_exists('pan', $data) && trim((string) $data['pan']) !== '') {
            $this->upsert($db, 'employee_statutory_details', 'employee_id', $employeeId,
                ['pan_number' => strtoupper(trim((string) $data['pan'])), 'aadhaar_number' => preg_replace('/\D/', '', (string) $data['aadhaar']), 'uan_number' => preg_replace('/\D/', '', (string) $data['uan'])],
                ['statutory_detail_id' => Uuid::generate(), 'employee_id' => $employeeId]);
        }
        if (array_key_exists('basicSalary', $data) && $data['basicSalary'] !== '') {
            $this->upsert($db, 'employee_compensations', 'employee_id', $employeeId,
                ['basic_salary' => $data['basicSalary'], 'hra' => $data['hra'], 'allowance' => $data['allowance'], 'bonus' => $data['bonus'], 'gross_salary' => $data['grossSalary'], 'net_salary' => $data['netSalary']],
                ['employee_compensation_id' => Uuid::generate(), 'employee_id' => $employeeId]);
        }
    }

    public function findDocument(string $employeeId, string $documentId): ?array
    {
        $stmt = Database::connection()->prepare('SELECT document_id, document_name, document_url FROM employee_documents WHERE employee_id=? AND document_id=? LIMIT 1');
        $stmt->execute([$employeeId, $documentId]);
        return $stmt->fetch() ?: null;
    }

    public function addDocument(string $employeeId, string $type, string $name, string $storagePath): array
    {
        $id = Uuid::generate();
        Database::connection()->prepare("INSERT INTO employee_documents (document_id,employee_id,document_type,document_name,document_url,status) VALUES (?,?,?,?,?,'Pending')")
            ->execute([$id, $employeeId, $type, $name, $storagePath]);
        return ['document_id' => $id, 'document_type' => $type, 'document_name' => $name, 'status' => 'Pending'];
    }

    private function upsert(\PDO $db, string $table, string $key, string $value, array $updates, array $insert): void
    {
        $exists = $db->prepare("SELECT 1 FROM {$table} WHERE {$key}=? LIMIT 1");
        $exists->execute([$value]);
        if ($exists->fetchColumn()) {
            $sets = implode(', ', array_map(static fn(string $column) => "{$column}=?", array_keys($updates)));
            $stmt = $db->prepare("UPDATE {$table} SET {$sets} WHERE {$key}=?");
            $stmt->execute([...array_values($updates), $value]);
            return;
        }
        $columns = array_keys([...$insert, ...$updates]);
        $stmt = $db->prepare('INSERT INTO ' . $table . ' (' . implode(',', $columns) . ') VALUES (' . implode(',', array_fill(0, count($columns), '?')) . ')');
        $stmt->execute(array_values([...$insert, ...$updates]));
    }
}
