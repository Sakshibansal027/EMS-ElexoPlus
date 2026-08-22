<?php

use Core\Router;
use Modules\Profile\Controllers\ProfileController;

Router::group('api', function () {
    Router::get('/profile', [ProfileController::class, 'show']);
    Router::get('/profile/documents/{documentId}/download', [ProfileController::class, 'downloadDocument']);
    Router::post('/profile/change-password', [ProfileController::class, 'changePassword']);
});
