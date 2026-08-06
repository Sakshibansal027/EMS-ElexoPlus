<?php

namespace Modules\Authentication\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Authentication\Repositories\PasswordResetRepository;
use Modules\Authentication\Repositories\UserRepository;
use Modules\Authentication\Services\AuthService;
use Modules\Authentication\Support\Request;

class AuthController
{
    private AuthService $auth;

    public function __construct()
    {
        $this->auth = new AuthService(new UserRepository(), new PasswordResetRepository());
    }

    public function login(array $params): array
    {
        $email = trim((string) Request::input('email', ''));
        $password = (string) Request::input('password', '');

        if ($email === '' || $password === '') {
            return ['success' => false, 'message' => 'Email and password are required.', 'status' => 422];
        }

        return $this->auth->login($email, $password);
    }

    public function me(array $params): array
    {
        $auth = AuthMiddleware::handle();

        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->auth->me((int) $auth['user']['id']);
    }

    public function logout(array $params): array
    {
        $auth = AuthMiddleware::handle();

        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->auth->logout();
    }

    public function refresh(array $params): array
    {
        $refreshToken = (string) Request::input('refresh_token', '');

        if ($refreshToken === '') {
            return ['success' => false, 'message' => 'refresh_token is required.', 'status' => 422];
        }

        return $this->auth->refresh($refreshToken);
    }

    public function forgotPassword(array $params): array
    {
        $email = trim((string) Request::input('email', ''));

        if ($email === '') {
            return ['success' => false, 'message' => 'Email is required.', 'status' => 422];
        }

        return $this->auth->forgotPassword($email);
    }

    public function resetPassword(array $params): array
    {
        $token = (string) Request::input('token', '');
        $password = (string) Request::input('password', '');

        if ($token === '' || $password === '') {
            return ['success' => false, 'message' => 'Token and new password are required.', 'status' => 422];
        }

        return $this->auth->resetPassword($token, $password);
    }
}
