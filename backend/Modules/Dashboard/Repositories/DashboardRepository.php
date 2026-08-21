<?php

namespace Modules\Dashboard\Repositories;

use Core\Database;
use PDOException;

/** Read-only data access for dashboard aggregates. */
class DashboardRepository
{
    public function scalar(string $sql, array $bindings = [], int|float $default = 0): int|float
    {
        try {
            $statement = Database::connection()->prepare($sql);
            $statement->execute($bindings);
            $value = $statement->fetchColumn();
            return $value === false || $value === null ? $default : $value + 0;
        } catch (PDOException) {
            // A partially migrated environment must still have a usable dashboard.
            return $default;
        }
    }

    public function rows(string $sql, array $bindings = []): array
    {
        try {
            $statement = Database::connection()->prepare($sql);
            $statement->execute($bindings);
            return $statement->fetchAll();
        } catch (PDOException) {
            return [];
        }
    }

    public function row(string $sql, array $bindings = []): ?array
    {
        return $this->rows($sql, $bindings)[0] ?? null;
    }

    public function resolveRole(array $user): string
    {
        if (!empty($user['role'])) return strtoupper((string) $user['role']);
        $userId = $user['user_id'] ?? $user['id'] ?? null;
        if (!$userId) return 'SALES_EXECUTIVE';

        $role = $this->row(
            "SELECT r.role_code FROM user_roles ur INNER JOIN roles r ON r.role_id = ur.role_id WHERE ur.user_id = ? AND ur.status = 'Active' AND r.status = 'Active' ORDER BY ur.assigned_at DESC LIMIT 1",
            [$userId]
        );
        return strtoupper((string) ($role['role_code'] ?? 'SALES_EXECUTIVE'));
    }

    public function directReportIds(string $employeeId): array
    {
        return array_column($this->rows('SELECT employee_id FROM employees WHERE reporting_manager_id = ?', [$employeeId]), 'employee_id');
    }
}
