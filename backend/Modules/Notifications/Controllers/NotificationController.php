<?php

namespace Modules\Notifications\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Notifications\Repositories\NotificationRepository;
use Modules\Notifications\Services\NotificationService;
use Modules\Authentication\Support\Request;

class NotificationController
{
    private NotificationService $service;

    public function __construct()
    {
        $this->service = new NotificationService(new NotificationRepository());
    }

    private function auth(): ?array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        return null;
    }

    private function userId(): string
    {
        $auth = AuthMiddleware::handle();
        return $auth['user']['user_id'] ?? $auth['user']['id'] ?? '';
    }

    public function index(array $params): array
    {
        if ($denied = $this->auth()) return $denied;
        $userId = $this->userId();
        $filters = [
            'category' => $_GET['category'] ?? '',
            'type' => $_GET['type'] ?? '',
            'status' => $_GET['status'] ?? '',
            'search' => $_GET['search'] ?? '',
            'archived' => !empty($_GET['archived']),
        ];
        return $this->service->list($userId, $filters);
    }

    public function unreadCount(array $params): array
    {
        if ($denied = $this->auth()) return $denied;
        return $this->service->unreadCount($this->userId());
    }

    public function recentUnread(array $params): array
    {
        if ($denied = $this->auth()) return $denied;
        $limit = (int) ($_GET['limit'] ?? 5);
        return $this->service->recentUnread($this->userId(), $limit);
    }

    public function store(array $params): array
    {
        $auth = RoleMiddleware::handle(['ADMIN', 'HR']);
        if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        return $this->service->create(Request::all());
    }

    public function markAsRead(array $params): array
    {
        if ($denied = $this->auth()) return $denied;
        return $this->service->markAsRead($params['id'], $this->userId());
    }

    public function markAllAsRead(array $params): array
    {
        if ($denied = $this->auth()) return $denied;
        return $this->service->markAllAsRead($this->userId());
    }

    public function archive(array $params): array
    {
        if ($denied = $this->auth()) return $denied;
        return $this->service->archive($params['id'], $this->userId());
    }

    public function destroy(array $params): array
    {
        if ($denied = $this->auth()) return $denied;
        return $this->service->delete($params['id'], $this->userId());
    }
}
