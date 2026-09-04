<?php

use Core\Router;
use Modules\Notifications\Controllers\NotificationController;

Router::group('api', function () {
    Router::group('notifications', function () {
        Router::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Router::get('/recent-unread', [NotificationController::class, 'recentUnread']);
        Router::patch('/read-all', [NotificationController::class, 'markAllAsRead']);
        Router::get('/', [NotificationController::class, 'index']);
        Router::post('/', [NotificationController::class, 'store']);
        Router::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
        Router::patch('/{id}/archive', [NotificationController::class, 'archive']);
        Router::delete('/{id}', [NotificationController::class, 'destroy']);
    });
});
