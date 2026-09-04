<?php

namespace Modules\Notifications\Repositories;

use Modules\Notifications\Models\Notification;

class NotificationRepository
{
    public function allByUser(string $userId, array $filters = []): array
    {
        return Notification::allByUser($userId, $filters);
    }

    public function find(string $id): ?array
    {
        return Notification::find($id);
    }

    public function create(array $data): array
    {
        return Notification::create($data);
    }

    public function markAsRead(string $id): bool
    {
        return Notification::markAsRead($id);
    }

    public function markAllAsRead(string $userId): bool
    {
        return Notification::markAllAsRead($userId);
    }

    public function archive(string $id): bool
    {
        return Notification::archive($id);
    }

    public function delete(string $id): bool
    {
        return Notification::delete($id);
    }

    public function unreadCount(string $userId): int
    {
        return Notification::unreadCount($userId);
    }

    public function recentUnread(string $userId, int $limit = 5): array
    {
        return Notification::recentUnread($userId, $limit);
    }

    public function ownerUserId(string $id): ?string
    {
        return Notification::ownerUserId($id);
    }
}
