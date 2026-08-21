<?php

namespace Modules\Authentication\Models;

use Core\Database;

class PasswordReset
{
    protected const TABLE = 'password_resets';
    private static ?bool $legacySchema = null;

    public static function createFor(string $userId, string $token): void
    {
        if (self::isLegacySchema()) {
            $stmt = Database::connection()->prepare(
                'INSERT INTO ' . self::TABLE . ' (user_id, token, expires_at)
                 VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))'
            );
            $stmt->execute([$userId, $token, 60]);
            return;
        }

        $stmt = Database::connection()->prepare(
            'INSERT INTO ' . self::TABLE . ' (password_reset_id, user_id, token_hash, expires_at)
             VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))'
        );
        $stmt->execute([self::uuid(), $userId, hash('sha256', $token), 60]);
    }

    public static function findValid(string $token): ?array
    {
        if (self::isLegacySchema()) {
            $stmt = Database::connection()->prepare(
                'SELECT * FROM ' . self::TABLE . ' WHERE token = ? AND used_at IS NULL AND expires_at > NOW()'
            );
            $stmt->execute([$token]);
            return $stmt->fetch() ?: null;
        }

        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()'
        );
        $stmt->execute([hash('sha256', $token)]);
        return $stmt->fetch() ?: null;
    }

    public static function markUsed(string $id): void
    {
        if (self::isLegacySchema()) {
            $stmt = Database::connection()->prepare('UPDATE ' . self::TABLE . ' SET used_at = NOW() WHERE id = ?');
            $stmt->execute([$id]);
            return;
        }

        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . ' SET used_at = NOW() WHERE password_reset_id = ?'
        );
        $stmt->execute([$id]);
    }

    public static function invalidateFor(string $userId): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . ' SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL'
        );
        $stmt->execute([$userId]);
    }

    private static function uuid(): string
    {
        $bytes = random_bytes(16);
        $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
        $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
        $hex = bin2hex($bytes);
        return sprintf('%s-%s-%s-%s-%s', substr($hex, 0, 8), substr($hex, 8, 4), substr($hex, 12, 4), substr($hex, 16, 4), substr($hex, 20));
    }

    private static function isLegacySchema(): bool
    {
        if (self::$legacySchema !== null) return self::$legacySchema;

        try {
            $columns = Database::connection()->query('SHOW COLUMNS FROM ' . self::TABLE)->fetchAll();
            return self::$legacySchema = in_array('id', array_column($columns, 'Field'), true);
        } catch (\Throwable) {
            return self::$legacySchema = false;
        }
    }
}
