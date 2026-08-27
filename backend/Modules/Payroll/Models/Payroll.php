<?php

namespace Modules\Payroll\Models;

use Core\Database;
use Modules\Payroll\Support\Uuid;

class Payroll
{
    public static function all(?string $periodId=null, ?string $employeeId=null): array
    {
        $sql='SELECT p.*, e.employee_code,e.full_name,e.email, pp.payroll_month,pp.payroll_year FROM payrolls p JOIN employees e ON e.employee_id=p.employee_id JOIN payroll_periods pp ON pp.payroll_period_id=p.payroll_period_id WHERE 1=1'; $v=[];
        if($periodId){$sql.=' AND p.payroll_period_id=?';$v[]=$periodId;} if($employeeId){$sql.=' AND p.employee_id=?';$v[]=$employeeId;} $sql.=' ORDER BY e.full_name'; $s=Database::connection()->prepare($sql);$s->execute($v);return $s->fetchAll();
    }
    public static function find(string $id): ?array { $s=Database::connection()->prepare('SELECT p.*, e.employee_code,e.full_name,e.email,pp.payroll_month,pp.payroll_year FROM payrolls p JOIN employees e ON e.employee_id=p.employee_id JOIN payroll_periods pp ON pp.payroll_period_id=p.payroll_period_id WHERE p.payroll_id=?');$s->execute([$id]);return $s->fetch() ?: null; }
    public static function findForPeriodEmployee(string $periodId,string $employeeId): ?array { $s=Database::connection()->prepare('SELECT * FROM payrolls WHERE payroll_period_id=? AND employee_id=?');$s->execute([$periodId,$employeeId]);return $s->fetch() ?: null; }
    public static function create(array $d): array { $id=Uuid::generate(); Database::connection()->prepare('INSERT INTO payrolls (payroll_id,payroll_period_id,employee_id,salary_structure_id,attendance_days,payable_days,lop_days,overtime_hours,gross_salary,total_incentives,total_deductions,net_salary) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')->execute([$id,$d['payroll_period_id'],$d['employee_id'],$d['salary_structure_id'],$d['attendance_days'],$d['payable_days'],$d['lop_days'],$d['overtime_hours'],$d['gross_salary'],$d['total_incentives'],$d['total_deductions'],$d['net_salary']]);return self::find($id); }
    public static function setStatus(string $id,string $status,string $userId): ?array
    {
        $map=['Draft'=>['payroll_status',null,null],'Processing'=>['payroll_status','processed_by','processed_at'],'Approved'=>['payroll_status','approved_by','approved_at'],'Paid'=>['payroll_status',null,null],'Verified'=>['verification_status','verified_by','verified_at'],'Rejected'=>['verification_status','verified_by','verified_at']];
        [$column,$by,$at]=$map[$status];
        if ($status === 'Processing') {
            // A rejected item returns to Draft. Starting it again must clear
            // the old decision or it would be permanently ineligible for verification.
            Database::connection()->prepare("UPDATE payrolls SET $column=?, $by=?, $at=NOW(), verification_status='Pending', verified_by=NULL, verified_at=NULL WHERE payroll_id=?")
                ->execute([$status,$userId,$id]);
        } elseif ($by === null) Database::connection()->prepare("UPDATE payrolls SET $column=? WHERE payroll_id=?")->execute([$status,$id]);
        else Database::connection()->prepare("UPDATE payrolls SET $column=?, $by=?, $at=NOW() WHERE payroll_id=?")->execute([$status,$userId,$id]);
        return self::find($id);
    }
    public static function adjustments(string $payrollId,string $type): array { $table=$type==='incentive'?'incentives':'deductions';$s=Database::connection()->prepare("SELECT * FROM $table WHERE payroll_id=? ORDER BY created_at DESC");$s->execute([$payrollId]);return $s->fetchAll(); }
    public static function addAdjustment(string $payrollId,string $employeeId,string $type,array $d): array { $table=$type==='incentive'?'incentives':'deductions';$key=$type==='incentive'?'incentive_id':'deduction_id';$name=$type==='incentive'?'incentive_name':'deduction_name';$id=Uuid::generate();Database::connection()->prepare("INSERT INTO $table ($key,employee_id,payroll_id,$name,amount,reason,approved_by_employee_id,approved_at) VALUES (?,?,?,?,?,?,?,NOW())")->execute([$id,$employeeId,$payrollId,$d['name'],$d['amount'],$d['reason']??null,$d['approved_by_employee_id']??null]);$s=Database::connection()->prepare("SELECT * FROM $table WHERE $key=?");$s->execute([$id]);return $s->fetch(); }
    public static function deleteAdjustment(string $id,string $type): bool { $table=$type==='incentive'?'incentives':'deductions';$key=$type==='incentive'?'incentive_id':'deduction_id';return Database::connection()->prepare("DELETE FROM $table WHERE $key=?")->execute([$id]); }
    public static function updateAdjustment(string $id,string $type,array $data): ?array { $table=$type==='incentive'?'incentives':'deductions';$key=$type==='incentive'?'incentive_id':'deduction_id';$name=$type==='incentive'?'incentive_name':'deduction_name';Database::connection()->prepare("UPDATE $table SET $name=?, amount=?, reason=? WHERE $key=?")->execute([$data['name'],$data['amount'],$data['reason']??null,$id]);return self::findAdjustment($id,$type); }
    public static function findAdjustment(string $id,string $type): ?array { $table=$type==='incentive'?'incentives':'deductions';$key=$type==='incentive'?'incentive_id':'deduction_id';$s=Database::connection()->prepare("SELECT * FROM $table WHERE $key=?");$s->execute([$id]);return $s->fetch() ?: null; }
    public static function summary(?string $periodId=null): array { $sql='SELECT COUNT(*) employee_count,COALESCE(SUM(gross_salary),0) gross_salary,COALESCE(SUM(total_incentives),0) incentives,COALESCE(SUM(total_deductions),0) deductions,COALESCE(SUM(net_salary),0) net_salary FROM payrolls';$v=[];if($periodId){$sql.=' WHERE payroll_period_id=?';$v[]=$periodId;}$s=Database::connection()->prepare($sql);$s->execute($v);return $s->fetch(); }
    public static function countUnapprovedForPeriod(string $periodId): int { $s=Database::connection()->prepare("SELECT COUNT(*) FROM payrolls WHERE payroll_period_id=? AND payroll_status NOT IN ('Approved','Paid')");$s->execute([$periodId]);return (int)$s->fetchColumn(); }

    public static function statusCounts(string $periodId): array
    {
        $stmt=Database::connection()->prepare("SELECT payroll_status, verification_status, COUNT(*) AS total FROM payrolls WHERE payroll_period_id=? GROUP BY payroll_status, verification_status");
        $stmt->execute([$periodId]);
        return $stmt->fetchAll();
    }

    public static function report(?string $periodId=null, ?string $employeeId=null): array
    {
        $sql="SELECT p.*,e.employee_code,e.full_name,e.email,pp.payroll_month,pp.payroll_year,pp.period_start,pp.period_end,
                     COALESCE(i.total,0) AS incentive_line_total, COALESCE(d.total,0) AS deduction_line_total
              FROM payrolls p
              JOIN employees e ON e.employee_id=p.employee_id
              JOIN payroll_periods pp ON pp.payroll_period_id=p.payroll_period_id
              LEFT JOIN (SELECT payroll_id,SUM(amount) total FROM incentives GROUP BY payroll_id) i ON i.payroll_id=p.payroll_id
              LEFT JOIN (SELECT payroll_id,SUM(amount) total FROM deductions GROUP BY payroll_id) d ON d.payroll_id=p.payroll_id
              WHERE 1=1";
        $values=[];
        if ($periodId) {$sql.=' AND p.payroll_period_id=?';$values[]=$periodId;}
        if ($employeeId) {$sql.=' AND p.employee_id=?';$values[]=$employeeId;}
        $sql.=' ORDER BY pp.payroll_year DESC,pp.payroll_month DESC,e.full_name';
        $stmt=Database::connection()->prepare($sql);$stmt->execute($values);
        return $stmt->fetchAll();
    }
}
