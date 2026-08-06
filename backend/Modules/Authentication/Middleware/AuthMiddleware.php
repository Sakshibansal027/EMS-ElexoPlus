<?php

namespace Modules\Authentication\Middleware;

use Modules\Authentication\Models\User;
use Modules\Authentication\Support\Jwt;
use Modules\Authentication\Support\Request;

class AuthMiddleware
{
    /**
     * Resolve the authenticated user from the Authorization bearer token.
     *
     * @return array{user?: array, error?: string, status?: int}
     */
    public static function handle(): array
    {
        $token = Request::bearerToken();

        if (!$token) {
            return ['error' => 'Unauthenticated. Bearer token required.', 'status' => 401];
        }

        $claims = Jwt::parse($token);

        if (!$claims || ($claims['type'] ?? null) !== 'access' || !isset($claims['sub'])) {
            return ['error' => 'Invalid or expired token.', 'status' => 401];
        }

        $user = User::find((int) $claims['sub']);

        if (!$user) {
            return ['error' => 'User not found.', 'status' => 401];
        }

        return ['user' => User::publicData($user)];
    }
}