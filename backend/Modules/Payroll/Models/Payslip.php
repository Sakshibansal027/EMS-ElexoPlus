<?php

namespace Modules\Payroll\Models;

use Core\Database;
use Modules\Payroll\Support\Uuid;

class Payslip
{
    public static function find(string $id): ?array { $s=Database::connection()->prepare('SELECT ps.*,p.gross_salary,p.net_salary,p.payroll_status,pp.payroll_month,pp.payroll_year,e.employee_code,e.full_name FROM payslips ps JOIN payrolls p ON p.payroll_id=ps.payroll_id JOIN payroll_periods pp ON pp.payroll_period_id=p.payroll_period_id JOIN employees e ON e.employee_id=ps.employee_id WHERE ps.payslip_id=?');$s->execute([$id]);return $s->fetch() ?: null; }
    public static function findByPayroll(string $payrollId): ?array { $s=Database::connection()->prepare('SELECT * FROM payslips WHERE payroll_id=?');$s->execute([$payrollId]);return $s->fetch() ?: null; }
    public static function forEmployee(string $employeeId): array { $s=Database::connection()->prepare('SELECT ps.*,p.net_salary,p.gross_salary,p.payroll_status,pp.payroll_month,pp.payroll_year FROM payslips ps JOIN payrolls p ON p.payroll_id=ps.payroll_id JOIN payroll_periods pp ON pp.payroll_period_id=p.payroll_period_id WHERE ps.employee_id=? ORDER BY pp.payroll_year DESC,pp.payroll_month DESC');$s->execute([$employeeId]);return $s->fetchAll(); }
    public static function create(string $payrollId,string $employeeId,string $number): array { $id=Uuid::generate();$url='/api/payroll/payslips/'.$id.'/download';Database::connection()->prepare('INSERT INTO payslips (payslip_id,payroll_id,employee_id,payslip_number,pdf_url) VALUES (?,?,?,?,?)')->execute([$id,$payrollId,$employeeId,$number,$url]);return self::find($id); }
}
