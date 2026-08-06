<?php

namespace Modules\Authentication\Models;

use Core\Database;

class PasswordReset
{
    protected const TABLE = 'password_resets';

    public static function createFor(int $userId, string $token): void
    {
        $stmt = Database::connection()->prepare(
            'INSERT INTO ' . self::TABLE . ' (user_id, token, expires_at)
             VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))'
        );
        $stmt->execute([$userId, $token, 60]);
    }

    public static function findValid(string $token): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE token = ? AND used_at IS NULL AND expires_at > NOW()'
        );
        $stmt->execute([$token]);
        return $stmt->fetch() ?: null;
    }

    public static function markUsed(int $id): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . ' SET used_at = NOW() WHERE id = ?'
        );
        $stmt->execute([$id]);
    }

    public static function invalidateFor(int $userId): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . ' SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL'
        );
        $stmt->execute([$userId]);
    }
}