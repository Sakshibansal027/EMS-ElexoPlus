<?php

namespace Modules\Payroll\Models;

use Core\Database;
use Modules\Payroll\Support\Uuid;

class SalaryStructure
{
    public static function all(bool $activeOnly = false): array
    {
        $sql = "SELECT s.*, (SELECT COUNT(*) FROM employee_salary_structures ess WHERE ess.salary_structure_id=s.salary_structure_id AND ess.status='Active') AS assigned_count FROM salary_structures s";
        if ($activeOnly) $sql .= " WHERE s.status='Active'";
        $sql .= ' ORDER BY s.structure_name';
        return Database::connection()->query($sql)->fetchAll();
    }

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM salary_structures WHERE salary_structure_id=?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function findByCode(string $code): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM salary_structures WHERE structure_code=?');
        $stmt->execute([$code]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): array
    {
        $id = Uuid::generate();
        $stmt = Database::connection()->prepare('INSERT INTO salary_structures (salary_structure_id,structure_name,structure_code,basic_percentage,hra_percentage,special_allowance,medical_allowance,conveyance_allowance,bonus_type,bonus_value,bonus_frequency,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([$id, $data['structure_name'], $data['structure_code'], $data['basic_percentage'], $data['hra_percentage'], $data['special_allowance'], $data['medical_allowance'], $data['conveyance_allowance'], $data['bonus_type'] ?? null, $data['bonus_value'], $data['bonus_frequency'] ?? null, $data['status'] ?? 'Active']);
        return self::find($id);
    }

    public static function update(string $id, array $data): ?array
    {
        $allowed = ['structure_name','structure_code','basic_percentage','hra_percentage','special_allowance','medical_allowance','conveyance_allowance','bonus_type','bonus_value','bonus_frequency','status'];
        $data = array_intersect_key($data, array_flip($allowed));
        if (!$data) return self::find($id);
        $fields=[]; $values=[];
        foreach ($data as $field=>$value) { $fields[] = "$field=?"; $values[]=$value; }
        $values[]=$id;
        Database::connection()->prepare('UPDATE salary_structures SET '.implode(',', $fields).' WHERE salary_structure_id=?')->execute($values);
        return self::find($id);
    }

    public static function delete(string $id): bool
    {
        return Database::connection()->prepare('DELETE FROM salary_structures WHERE salary_structure_id=?')->execute([$id]);
    }

    public static function usage(string $id): array
    {
        $db = Database::connection();
        $assignments = $db->prepare('SELECT COUNT(*) FROM employee_salary_structures WHERE salary_structure_id=?');
        $assignments->execute([$id]);
        $payrolls = $db->prepare('SELECT COUNT(*) FROM payrolls WHERE salary_structure_id=?');
        $payrolls->execute([$id]);
        return ['assignments' => (int) $assignments->fetchColumn(), 'payrolls' => (int) $payrolls->fetchColumn()];
    }

    public static function assignments(string $structureId): array
    {
        $stmt = Database::connection()->prepare('SELECT ess.*, e.employee_code, e.full_name, e.email FROM employee_salary_structures ess JOIN employees e ON e.employee_id=ess.employee_id WHERE ess.salary_structure_id=? ORDER BY ess.effective_from DESC');
        $stmt->execute([$structureId]); return $stmt->fetchAll();
    }

    public static function assign(string $structureId, string $employeeId, string $effectiveFrom): array
    {
        $db=Database::connection();
        $ownsTransaction = !$db->inTransaction();
        if ($ownsTransaction) $db->beginTransaction();
        try {
            $existing = $db->prepare('SELECT * FROM employee_salary_structures WHERE employee_id=? AND effective_from=? LIMIT 1');
            $existing->execute([$employeeId, $effectiveFrom]);
            $row = $existing->fetch();
            if ($row) {
                if ($row['salary_structure_id'] === $structureId) {
                    if ($ownsTransaction) $db->commit();
                    return $row;
                }
                throw new \DomainException('An employee can only have one salary structure for an effective date.');
            }
            // Keep historical assignments valid through the day before the
            // replacement takes effect. A future-dated assignment must not
            // make today's structure disappear from payroll calculations.
            $db->prepare("UPDATE employee_salary_structures SET effective_to=DATE_SUB(?, INTERVAL 1 DAY) WHERE employee_id=? AND status='Active' AND effective_from<? AND (effective_to IS NULL OR effective_to>=?)")
                ->execute([$effectiveFrom, $employeeId, $effectiveFrom, $effectiveFrom]);

            // When back-dating a structure, cap it at the next scheduled
            // assignment. Without this, two active structures overlap and a
            // payroll run depends on an arbitrary query ordering.
            $next = $db->prepare("SELECT effective_from FROM employee_salary_structures WHERE employee_id=? AND status='Active' AND effective_from>? ORDER BY effective_from ASC LIMIT 1");
            $next->execute([$employeeId, $effectiveFrom]);
            $nextEffectiveFrom = $next->fetchColumn();
            $effectiveTo = $nextEffectiveFrom ? date('Y-m-d', strtotime($nextEffectiveFrom . ' -1 day')) : null;
            $id=Uuid::generate();
            $db->prepare('INSERT INTO employee_salary_structures (employee_salary_structure_id,employee_id,salary_structure_id,effective_from,effective_to,status) VALUES (?,?,?,?,?,\'Active\')')->execute([$id,$employeeId,$structureId,$effectiveFrom,$effectiveTo]);
            $stmt=$db->prepare('SELECT * FROM employee_salary_structures WHERE employee_salary_structure_id=?');
            $stmt->execute([$id]);
            $assignment=$stmt->fetch();
            if ($ownsTransaction) $db->commit();
            return $assignment;
        } catch (\Throwable $exception) {
            if ($ownsTransaction && $db->inTransaction()) $db->rollBack();
            throw $exception;
        }
    }

    public static function activeForEmployee(string $employeeId, string $onDate): ?array
    {
        $stmt=Database::connection()->prepare("SELECT ess.*, s.* FROM employee_salary_structures ess JOIN salary_structures s ON s.salary_structure_id=ess.salary_structure_id WHERE ess.employee_id=? AND ess.status='Active' AND s.status='Active' AND ess.effective_from<=? AND (ess.effective_to IS NULL OR ess.effective_to>=?) ORDER BY ess.effective_from DESC LIMIT 1");
        $stmt->execute([$employeeId,$onDate,$onDate]); return $stmt->fetch() ?: null;
    }
}
