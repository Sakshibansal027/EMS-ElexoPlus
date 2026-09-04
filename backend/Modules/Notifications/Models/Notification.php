<?php

namespace Modules\Notifications\Models;

use Core\Database;

class Notification
{
    public static function allByUser(string $userId, array $filters = []): array
    {
        $db = Database::connection();
        $conditions = ['n.user_id = ?'];
        $params = [$userId];

        if (!empty($filters['category'])) {
            $conditions[] = 'n.category = ?';
            $params[] = $filters['category'];
        }
        if (!empty($filters['type'])) {
            $conditions[] = 'n.type = ?';
            $params[] = $filters['type'];
        }
        if (($filters['status'] ?? '') === 'unread') {
            $conditions[] = 'n.is_read = 0';
        } elseif (($filters['status'] ?? '') === 'read') {
            $conditions[] = 'n.is_read = 1';
        }
        if (!empty($filters['archived'])) {
            $conditions[] = 'n.is_archived = 1';
        } else {
            $conditions[] = 'n.is_archived = 0';
        }

        $where = implode(' AND ', $conditions);
        $sql = "SELECT n.* FROM notifications n WHERE {$where} ORDER BY n.created_at DESC";

        if (!empty($filters['search'])) {
            $sql = "SELECT n.* FROM notifications n WHERE {$where} AND (n.title LIKE ? OR n.message LIKE ?) ORDER BY n.created_at DESC";
            $params[] = '%' . $filters['search'] . '%';
            $params[] = '%' . $filters['search'] . '%';
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT n.* FROM notifications n WHERE n.notification_id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): array
    {
        $db = Database::connection();
        $stmt = $db->prepare(
            'INSERT INTO notifications (notification_id, user_id, title, message, type, category, link)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['notification_id'],
            $data['user_id'],
            $data['title'],
            $data['message'],
            $data['type'],
            $data['category'],
            $data['link'] ?? null,
        ]);
        return self::find($data['notification_id']);
    }

    public static function markAsRead(string $id): bool
    {
        $stmt = Database::connection()->prepare(
            'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE notification_id = ? AND is_read = 0'
        );
        return $stmt->execute([$id]);
    }

    public static function markAllAsRead(string $userId): bool
    {
        $stmt = Database::connection()->prepare(
            'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0'
        );
        return $stmt->execute([$userId]);
    }

    public static function archive(string $id): bool
    {
        $stmt = Database::connection()->prepare(
            'UPDATE notifications SET is_archived = 1 WHERE notification_id = ?'
        );
        return $stmt->execute([$id]);
    }

    public static function delete(string $id): bool
    {
        $stmt = Database::connection()->prepare('DELETE FROM notifications WHERE notification_id = ?');
        return $stmt->execute([$id]);
    }

    public static function unreadCount(string $userId): int
    {
        $stmt = Database::connection()->prepare(
            'SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = 0 AND is_archived = 0'
        );
        $stmt->execute([$userId]);
        return (int) $stmt->fetchColumn();
    }

    public static function recentUnread(string $userId, int $limit = 5): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT n.* FROM notifications n WHERE n.user_id = ? AND n.is_read = 0 AND n.is_archived = 0 ORDER BY n.created_at DESC LIMIT ?'
        );
        $stmt->execute([$userId, $limit]);
        return $stmt->fetchAll();
    }

    public static function ownerUserId(string $id): ?string
    {
        $stmt = Database::connection()->prepare('SELECT user_id FROM notifications WHERE notification_id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetchColumn() ?: null;
    }
}
