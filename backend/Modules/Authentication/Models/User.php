<?php

namespace Modules\Authentication\Models;

use Core\Database;

class User
{
    protected const TABLE = 'users';

    protected const HIDDEN = ['password', 'password_hash'];
    private static ?bool $legacySchema = null;

    public static function find(string $id): ?array
    {
        $idColumn = self::isLegacySchema() ? 'id' : 'user_id';
        $stmt = Database::connection()->prepare('SELECT * FROM ' . self::TABLE . " WHERE $idColumn = ?");
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

        if (self::isLegacySchema()) {
            $stmt = $db->prepare(
                'INSERT INTO ' . self::TABLE . '
                 (username, email, password, name, designation, avatar, role, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $data['username'], $data['email'], $data['password'],
                $data['name'] ?? null, $data['designation'] ?? null,
                $data['avatar'] ?? null, $data['role'] ?? 'SALES_EXECUTIVE',
                $data['status'] ?? 'Active',
            ]);
            return self::find((string) $db->lastInsertId());
        }

        $stmt = $db->prepare(
            'INSERT INTO ' . self::TABLE . '
             (user_id, employee_id, username, email, password_hash, name, designation, avatar, role, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            self::uuid(),
            $data['employee_id'] ?? null,
            $data['username'],
            $data['email'],
            $data['password'],
            $data['name'] ?? null,
            $data['designation'] ?? null,
            $data['avatar'] ?? null,
            $data['role'] ?? 'SALES_EXECUTIVE',
            $data['status'] ?? 'Active',
        ]);

        return self::findByEmail($data['email']);
    }

    public static function updateLastLogin(string $id): void
    {
        $idColumn = self::isLegacySchema() ? 'id' : 'user_id';
        $stmt = Database::connection()->prepare('UPDATE ' . self::TABLE . " SET last_login_at = NOW() WHERE $idColumn = ?");
        $stmt->execute([$id]);
    }

    public static function updatePassword(string $id, string $passwordHash): bool
    {
        $idColumn = self::isLegacySchema() ? 'id' : 'user_id';
        $passwordColumn = self::isLegacySchema() ? 'password' : 'password_hash';
        $stmt = Database::connection()->prepare('UPDATE ' . self::TABLE . " SET $passwordColumn = ? WHERE $idColumn = ?");
        return $stmt->execute([$passwordHash, $id]);
    }

    public static function publicData(array $user): array
    {
        $employeeCode = null;
        if (!empty($user['employee_id'])) {
            try {
                $stmt = Database::connection()->prepare('SELECT employee_code FROM employees WHERE employee_id = ?');
                $stmt->execute([$user['employee_id']]);
                $employeeCode = $stmt->fetchColumn() ?: null;
            } catch (\Throwable) {
                // Employee Master may not be installed in a fresh environment.
            }
        }

        return [
            'username' => $user['username'] ?? null,
            'name' => $user['name'] ?? null,
            'email' => $user['email'] ?? null,
            'designation' => $user['designation'] ?? null,
            'avatar' => $user['avatar'] ?? null,
            'role' => $user['role'] ?? null,
            'status' => $user['status'] ?? null,
            'employeeCode' => $employeeCode,
        ];
    }

    public static function idOf(array $user): string
    {
        return (string) ($user[self::isLegacySchema() ? 'id' : 'user_id'] ?? '');
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

    private static function uuid(): string
    {
        $bytes = random_bytes(16);
        $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
        $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
        $hex = bin2hex($bytes);
        return sprintf('%s-%s-%s-%s-%s', substr($hex, 0, 8), substr($hex, 8, 4), substr($hex, 12, 4), substr($hex, 16, 4), substr($hex, 20));
    }
}
