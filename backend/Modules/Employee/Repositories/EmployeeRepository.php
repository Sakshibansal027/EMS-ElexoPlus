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
}
