<?php

namespace Modules\Notifications\Services;

use Modules\Notifications\Repositories\NotificationRepository;
use Modules\Notifications\Support\Uuid;

class NotificationService
{
    private const VALID_TYPES = ['Success', 'Warning', 'Info', 'Error'];
    private const VALID_CATEGORIES = ['leave', 'attendance', 'sales', 'employee', 'payroll', 'task', 'system'];

    public function __construct(private NotificationRepository $notifications) {}

    public function list(string $userId, array $filters = []): array
    {
        $notifications = $this->notifications->allByUser($userId, $filters);
        return ['success' => true, 'notifications' => array_map(fn(array $n) => $this->present($n), $notifications)];
    }

    public function show(string $id): array
    {
        $notification = $this->notifications->find($id);
        if (!$notification) return ['success' => false, 'message' => 'Notification not found.', 'status' => 404];
        return ['success' => true, 'notification' => $this->present($notification)];
    }

    public function create(array $data): array
    {
        $validated = $this->validate($data);
        if (isset($validated['error'])) return $validated;

        $data['notification_id'] = Uuid::generate();
        $notification = $this->notifications->create($data);
        return ['success' => true, 'message' => 'Notification created.', 'notification' => $this->present($notification)];
    }

    public function markAsRead(string $id, string $userId): array
    {
        $ownerId = $this->notifications->ownerUserId($id);
        if (!$ownerId) return ['success' => false, 'message' => 'Notification not found.', 'status' => 404];
        if ($ownerId !== $userId) return ['success' => false, 'message' => 'You do not have permission to modify this notification.', 'status' => 403];
        $this->notifications->markAsRead($id);
        return ['success' => true, 'message' => 'Notification marked as read.'];
    }

    public function markAllAsRead(string $userId): array
    {
        $this->notifications->markAllAsRead($userId);
        return ['success' => true, 'message' => 'All notifications marked as read.'];
    }

    public function archive(string $id, string $userId): array
    {
        $ownerId = $this->notifications->ownerUserId($id);
        if (!$ownerId) return ['success' => false, 'message' => 'Notification not found.', 'status' => 404];
        if ($ownerId !== $userId) return ['success' => false, 'message' => 'You do not have permission to modify this notification.', 'status' => 403];
        $this->notifications->archive($id);
        return ['success' => true, 'message' => 'Notification archived.'];
    }

    public function delete(string $id, string $userId, string $role): array
    {
        $ownerId = $this->notifications->ownerUserId($id);
        if (!$ownerId) return ['success' => false, 'message' => 'Notification not found.', 'status' => 404];
        if ($ownerId !== $userId && !in_array(strtoupper($role), ['ADMIN', 'HR'], true)) {
            return ['success' => false, 'message' => 'You do not have permission to delete this notification.', 'status' => 403];
        }
        $this->notifications->delete($id);
        return ['success' => true, 'message' => 'Notification deleted.'];
    }

    public function unreadCount(string $userId): array
    {
        return ['success' => true, 'count' => $this->notifications->unreadCount($userId)];
    }

    public function recentUnread(string $userId, int $limit = 5): array
    {
        $notifications = $this->notifications->recentUnread($userId, $limit);
        return ['success' => true, 'notifications' => array_map(fn(array $n) => $this->present($n), $notifications)];
    }

    private function validate(array $data): array
    {
        if (empty($data['user_id'])) return ['error' => true, 'success' => false, 'message' => 'user_id is required.', 'status' => 422];
        if (empty($data['title']) || trim($data['title']) === '') return ['error' => true, 'success' => false, 'message' => 'title is required.', 'status' => 422];
        if (empty($data['message']) || trim($data['message']) === '') return ['error' => true, 'success' => false, 'message' => 'message is required.', 'status' => 422];
        $type = ucfirst(strtolower($data['type'] ?? 'Info'));
        if (!in_array($type, self::VALID_TYPES, true)) return ['error' => true, 'success' => false, 'message' => 'type must be one of: Success, Warning, Info, Error.', 'status' => 422];
        $data['type'] = $type;
        $category = strtolower($data['category'] ?? 'system');
        if (!in_array($category, self::VALID_CATEGORIES, true)) return ['error' => true, 'success' => false, 'message' => 'category must be one of: ' . implode(', ', self::VALID_CATEGORIES) . '.', 'status' => 422];
        $data['category'] = $category;
        return $data;
    }

    private function present(array $notification): array
    {
        return [
            'id' => $notification['notification_id'],
            'title' => $notification['title'],
            'message' => $notification['message'],
            'type' => strtolower($notification['type']),
            'category' => $notification['category'],
            'isRead' => (bool) $notification['is_read'],
            'isArchived' => (bool) $notification['is_archived'],
            'link' => $notification['link'] ?: null,
            'createdAt' => $notification['created_at'],
            'readAt' => $notification['read_at'] ?: null,
        ];
    }
}
