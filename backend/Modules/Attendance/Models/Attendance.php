<?php

namespace Modules\Attendance\Models;

use Core\Database;

class Attendance
{
    private static function select(): string
    {
        return "SELECT a.*, e.employee_code, e.full_name AS employee_name, d.department_name AS department, ds.designation_name AS designation, wl.location_name AS branch FROM attendance a INNER JOIN employees e ON e.employee_id=a.employee_id LEFT JOIN departments d ON d.department_id=e.department_id LEFT JOIN designations ds ON ds.designation_id=e.designation_id LEFT JOIN work_locations wl ON wl.work_location_id=e.work_location_id";
    }

    public static function find(int $id): ?array { $s=Database::connection()->prepare(self::select().' WHERE a.id=?'); $s->execute([$id]); return $s->fetch() ?: null; }
    public static function findByEmployeeAndDate(string $employeeId, string $date): ?array { $s=Database::connection()->prepare(self::select().' WHERE a.employee_id=? AND a.attendance_date=?'); $s->execute([$employeeId,$date]); return $s->fetch() ?: null; }

    public static function findMany(array $ids, ?string $from=null, ?string $to=null): array
    {
        if (!$ids) return [];
        $where=['a.employee_id IN ('.implode(',',array_fill(0,count($ids),'?')).')']; $values=array_values($ids);
        if ($from) { $where[]='a.attendance_date >= ?'; $values[]=$from; }
        if ($to) { $where[]='a.attendance_date <= ?'; $values[]=$to; }
        $s=Database::connection()->prepare(self::select().' WHERE '.implode(' AND ',$where).' ORDER BY a.attendance_date DESC,a.id DESC'); $s->execute($values); return $s->fetchAll();
    }

    public static function create(array $d): ?array
    {
        $db=Database::connection(); $s=$db->prepare('INSERT INTO attendance (employee_id,attendance_date,check_in,check_out,break_minutes,working_hours,overtime,status,shift,remarks) VALUES (?,?,?,?,?,?,?,?,?,?)');
        $s->execute([$d['employee_id'],$d['attendance_date'],$d['check_in']??null,$d['check_out']??null,$d['break_minutes']??0,$d['working_hours']??0,$d['overtime']??0,$d['status']??'Present',$d['shift']??'General Shift',$d['remarks']??null]); return self::find((int)$db->lastInsertId());
    }

    public static function update(int $id,array $d): ?array
    {
        $fields=['check_in','check_out','break_minutes','working_hours','overtime','status','shift','remarks','break_started_at']; $sets=[];$values=[];
        foreach($fields as $field) if(array_key_exists($field,$d)){ $sets[]="$field=?";$values[]=$d[$field]; }
        if(!$sets) return self::find($id); $values[]=$id; Database::connection()->prepare('UPDATE attendance SET '.implode(',',$sets).' WHERE id=?')->execute($values); return self::find($id);
    }
}
