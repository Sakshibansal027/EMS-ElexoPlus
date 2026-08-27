<?php

namespace Modules\Payroll\Models;

use Core\Database;
use Modules\Payroll\Support\Uuid;

class PayrollPeriod
{
    public static function all(): array { return Database::connection()->query('SELECT * FROM payroll_periods ORDER BY payroll_year DESC,payroll_month DESC')->fetchAll(); }
    public static function find(string $id): ?array { $s=Database::connection()->prepare('SELECT * FROM payroll_periods WHERE payroll_period_id=?'); $s->execute([$id]); return $s->fetch() ?: null; }
    public static function findByMonth(int $month, int $year): ?array { $s=Database::connection()->prepare('SELECT * FROM payroll_periods WHERE payroll_month=? AND payroll_year=?'); $s->execute([$month,$year]); return $s->fetch() ?: null; }
    public static function create(array $data): array { $id=Uuid::generate(); Database::connection()->prepare('INSERT INTO payroll_periods (payroll_period_id,payroll_month,payroll_year,period_start,period_end) VALUES (?,?,?,?,?)')->execute([$id,$data['payroll_month'],$data['payroll_year'],$data['period_start'],$data['period_end']]); return self::find($id); }
    public static function update(string $id,array $data): ?array { $allowed=['period_start','period_end']; $data=array_intersect_key($data,array_flip($allowed)); if(!$data)return self::find($id); $f=[];$v=[];foreach($data as $k=>$x){$f[]="$k=?";$v[]=$x;}$v[]=$id;Database::connection()->prepare('UPDATE payroll_periods SET '.implode(',',$f).' WHERE payroll_period_id=?')->execute($v);return self::find($id); }
    public static function delete(string $id): bool { return Database::connection()->prepare('DELETE FROM payroll_periods WHERE payroll_period_id=?')->execute([$id]); }
    public static function setStatus(string $id,string $status,string $userId): ?array { $fields=$status==='Locked' ? 'status=?,locked_by=?,locked_at=NOW()' : 'status=?,processed_by=?,processed_at=NOW()'; Database::connection()->prepare("UPDATE payroll_periods SET $fields WHERE payroll_period_id=?")->execute([$status,$userId,$id]); return self::find($id); }
}
