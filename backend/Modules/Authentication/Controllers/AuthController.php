<?php

namespace Modules\Authentication\Controllers;

class AuthController
{
    public function login(array $params): array
    {
        return ['success' => true, 'message' => 'Login endpoint ready'];
    }

    public function me(array $params): array
    {
        return ['success' => true, 'message' => 'Profile endpoint ready'];
    }
}
