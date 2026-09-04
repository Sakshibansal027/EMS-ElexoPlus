<?php

namespace Modules\Settings\Models;

use Core\Database;

class UserPreference
{
    public static function get(string $userId): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM user_preferences WHERE user_id = ? LIMIT 1');
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        if (!$row) return null;
        return [
            'appearance' => $row['appearance'] ? json_decode($row['appearance'], true) : null,
            'notifications' => $row['notification_settings'] ? json_decode($row['notification_settings'], true) : null,
            'language' => $row['language_settings'] ? json_decode($row['language_settings'], true) : null,
        ];
    }

    public static function create(string $userId, array $data): array
    {
        $id = \Modules\Settings\Support\Uuid::generate();
        $stmt = Database::connection()->prepare(
            'INSERT INTO user_preferences (user_preference_id, user_id, appearance, notification_settings, language_settings)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            $userId,
            isset($data['appearance']) ? json_encode($data['appearance']) : null,
            isset($data['notifications']) ? json_encode($data['notifications']) : null,
            isset($data['language']) ? json_encode($data['language']) : null,
        ]);
        return self::get($userId);
    }

    public static function update(string $userId, array $data): array
    {
        $existing = self::get($userId);
        if (!$existing) return self::create($userId, $data);

        $sets = [];
        $values = [];
        if (array_key_exists('appearance', $data)) {
            $sets[] = 'appearance = ?';
            $values[] = json_encode($data['appearance']);
        }
        if (array_key_exists('notifications', $data)) {
            $sets[] = 'notification_settings = ?';
            $values[] = json_encode($data['notifications']);
        }
        if (array_key_exists('language', $data)) {
            $sets[] = 'language_settings = ?';
            $values[] = json_encode($data['language']);
        }
        if (!$sets) return $existing;
        $values[] = $userId;
        Database::connection()->prepare('UPDATE user_preferences SET ' . implode(', ', $sets) . ' WHERE user_id = ?')->execute($values);
        return self::get($userId);
    }
}
