<?php

namespace Modules\Attendance\Support;

use Core\Database;
use Modules\Authentication\Middleware\AuthMiddleware;

/** Server-side ownership and role scoping for every Attendance endpoint. */
class AttendanceAccess
{
    public static function authenticated(): array
    {
        return AuthMiddleware::handle();
    }

    public static function employeeId(array $user): ?string
    {
        if (!empty($user['employee_id'])) return (string) $user['employee_id'];
        $email = trim((string) ($user['email'] ?? ''));
        if ($email === '') return null;
        $stmt = Database::connection()->prepare('SELECT employee_id FROM employees WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        return $stmt->fetchColumn() ?: null;
    }

    public static function role(array $user): string
    {
        return strtoupper(trim((string) ($user['role'] ?? 'SALES_EXECUTIVE')));
    }

    public static function canManageAll(array $user): bool
    {
        return in_array(self::role($user), ['ADMIN', 'HR'], true);
    }

    /** @return string[] Employee UUIDs visible to this user. */
    public static function visibleEmployeeIds(array $user): array
    {
        $employeeId = self::employeeId($user);
        if (!$employeeId) return [];
        if (self::canManageAll($user)) {
            return Database::connection()->query('SELECT employee_id FROM employees')->fetchAll(\PDO::FETCH_COLUMN);
        }
        if (self::role($user) !== 'ASM') return [$employeeId];

        $stmt = Database::connection()->prepare('SELECT employee_id FROM employees WHERE reporting_manager_id = ?');
        $stmt->execute([$employeeId]);
        return array_values(array_unique(array_merge([$employeeId], $stmt->fetchAll(\PDO::FETCH_COLUMN))));
    }

    public static function canAccessEmployee(array $user, string $employeeId): bool
    {
        return in_array($employeeId, self::visibleEmployeeIds($user), true);
    }

    public static function canApproveCorrection(array $user, array $correction): bool
    {
        $ownEmployeeId = self::employeeId($user);
        if (!$ownEmployeeId || $ownEmployeeId === ($correction['employee_id'] ?? null)) return false;
        if (self::canManageAll($user)) return true;
        return self::role($user) === 'ASM'
            && in_array((string) ($correction['employee_id'] ?? ''), self::visibleEmployeeIds($user), true);
    }
}
