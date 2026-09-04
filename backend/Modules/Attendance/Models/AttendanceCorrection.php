<?php

namespace Modules\Attendance\Models;

use Core\Database;

class AttendanceCorrection
{
    private static function select(): string { return "SELECT c.*,e.employee_code,e.full_name AS employee_name,d.department_name AS department,ds.designation_name AS designation,a.full_name AS approver_name FROM attendance_corrections c INNER JOIN employees e ON e.employee_id=c.employee_id LEFT JOIN departments d ON d.department_id=e.department_id LEFT JOIN designations ds ON ds.designation_id=e.designation_id LEFT JOIN employees a ON a.employee_id=c.approver_employee_id"; }
    public static function find(int $id): ?array { $s=Database::connection()->prepare(self::select().' WHERE c.id=?');$s->execute([$id]);return $s->fetch()?:null; }
    public static function findMany(array $ids): array { if(!$ids)return []; $s=Database::connection()->prepare(self::select().' WHERE c.employee_id IN ('.implode(',',array_fill(0,count($ids),'?')).') ORDER BY c.submitted_on DESC,c.id DESC');$s->execute(array_values($ids));return $s->fetchAll(); }
    public static function create(array $d): ?array { $db=Database::connection();$s=$db->prepare("INSERT INTO attendance_corrections (employee_id,correction_date,requested_check_in,requested_check_out,reason,status,submitted_on,approver_employee_id) VALUES (?,?,?,?,?,'Pending',?,?)");$s->execute([$d['employee_id'],$d['correction_date'],$d['requested_check_in']??null,$d['requested_check_out']??null,$d['reason'],$d['submitted_on'],$d['approver_employee_id']??null]);return self::find((int)$db->lastInsertId()); }
    public static function decide(int $id,string $status,?string $remarks): ?array { Database::connection()->prepare('UPDATE attendance_corrections SET status=?,review_remarks=?,reviewed_at=NOW() WHERE id=?')->execute([$status,$remarks,$id]);return self::find($id); }
}
