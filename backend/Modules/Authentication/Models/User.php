<?php

namespace Modules\Authentication\Models;

use Core\Database;

class User
{
    protected const TABLE = 'users';

    protected const HIDDEN = ['password'];

    public static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM ' . self::TABLE . ' WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function findByEmail(string $email): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM ' . self::TABLE . ' WHERE email = ?');
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public static function findByUsername(string $username): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM ' . self::TABLE . ' WHERE username = ?');
        $stmt->execute([$username]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): ?array
    {
        $db = Database::connection();
        $stmt = $db->prepare(
            'INSERT INTO ' . self::TABLE . '
             (username, email, password, name, designation, avatar, role, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['username'],
            $data['email'],
            $data['password'],
            $data['name'] ?? null,
            $data['designation'] ?? null,
            $data['avatar'] ?? null,
            $data['role'] ?? 'SALES_EXECUTIVE',
            $data['status'] ?? 'System Live',
        ]);

        return self::find((int) $db->lastInsertId());
    }

    public static function updateLastLogin(int $id): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . ' SET last_login_at = NOW() WHERE id = ?'
        );
        $stmt->execute([$id]);
    }

    public static function updatePassword(int $id, string $passwordHash): bool
    {
        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . ' SET password = ? WHERE id = ?'
        );
        return $stmt->execute([$passwordHash, $id]);
    }

    public static function publicData(array $user): array
    {
        return array_diff_key($user, array_flip(self::HIDDEN));
    }
}
