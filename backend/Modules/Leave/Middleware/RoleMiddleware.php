<?php

namespace Modules\Leave\Middleware;

use Core\Database;
use Modules\Authentication\Middleware\AuthMiddleware;

class RoleMiddleware
{
    /**
     * Checks BOTH that the request is logged in AND that the logged-
     * in user holds one of $allowedRoleCodes (e.g. ['Admin', 'HR']).
     * Combines both checks into one call so Controllers don't need
     * to call AuthMiddleware::handle() separately before this.
     *
     * Returns either:
     *   ['user' => [...], 'roles' => ['Admin', ...]]   on success
     *   ['error' => '...', 'status' => 401|403]         on failure
     *
     * Role data comes from the RBAC tables added in this schema
     * version (roles / user_roles) — a user can hold more than one
     * role, and only Active role-assignments count (a Revoked one
     * shouldn't still grant access).
     */
    public static function handle(array $allowedRoleCodes): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return $auth; // not logged in at all — same error/status AuthMiddleware already built
        }

        $userId = $auth['user']['user_id'] ?? $auth['user']['id'] ?? null;
        $userRoleCodes = $userId ? self::rolesForUser((string) $userId) : [];
        // Legacy users table stores one role directly instead of RBAC rows.
        if (!$userRoleCodes && !empty($auth['user']['role'])) {
            $userRoleCodes = [strtoupper((string) $auth['user']['role'])];
        }

        $allowedRoleCodes = array_map('strtoupper', $allowedRoleCodes);
        $hasAllowedRole = count(array_intersect($allowedRoleCodes, $userRoleCodes)) > 0;

        if (!$hasAllowedRole) {
            return ['error' => 'You do not have permission to perform this action.', 'status' => 403];
        }

        return ['user' => $auth['user'], 'roles' => $userRoleCodes];
    }

    /**
     * All Active role_codes assigned to a user right now.
     */
    private static function rolesForUser(string $userId): array
    {
        try {
            $stmt = Database::connection()->prepare(
                "SELECT r.role_code
                 FROM user_roles ur
                 JOIN roles r ON r.role_id = ur.role_id
                 WHERE ur.user_id = ?
                   AND ur.status = 'Active'
                   AND r.status = 'Active'"
            );
            $stmt->execute([$userId]);
            return array_column($stmt->fetchAll(), 'role_code');
        } catch (\Throwable) {
            // The current production database uses the legacy users.role
            // column. handle() safely falls back to that verified value.
            return [];
        }
    }
}
