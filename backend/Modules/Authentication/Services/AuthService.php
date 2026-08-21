<?php

namespace Modules\Authentication\Services;

use Modules\Authentication\Models\User;
use Modules\Authentication\Repositories\PasswordResetRepository;
use Modules\Authentication\Repositories\UserRepository;
use Modules\Authentication\Support\Jwt;

class AuthService
{
    public function __construct(
        private UserRepository $users,
        private PasswordResetRepository $resets
    ) {
    }

    public function login(string $email, string $password): array
    {
        $user = $this->users->findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'] ?? $user['password'] ?? '')) {
            return ['success' => false, 'message' => 'Invalid email or password.', 'status' => 401];
        }

        if (isset($user['status']) && !in_array($user['status'], ['Active', 'System Live'], true)) {
            return ['success' => false, 'message' => 'This account is inactive.', 'status' => 403];
        }

        $this->users->updateLastLogin(User::idOf($user));

        return [
            'success' => true,
            'message' => 'Login successful.',
            'token' => $this->issueAccessToken($user),
            'refresh_token' => $this->issueRefreshToken($user),
            'user' => User::publicData($user),
        ];
    }

    public function me(string $id): array
    {
        $user = $this->users->findById($id);

        if (!$user) {
            return ['success' => false, 'message' => 'User not found.', 'status' => 404];
        }

        return ['success' => true, 'user' => User::publicData($user)];
    }

    public function logout(): array
    {
        return ['success' => true, 'message' => 'Logged out successfully.'];
    }

    public function refresh(string $refreshToken): array
    {
        $claims = Jwt::parse($refreshToken);

        if (!$claims || ($claims['type'] ?? null) !== 'refresh' || !isset($claims['sub'])) {
            return ['success' => false, 'message' => 'Invalid or expired refresh token.', 'status' => 401];
        }

        $user = $this->users->findById((string) $claims['sub']);

        if (!$user) {
            return ['success' => false, 'message' => 'User not found.', 'status' => 404];
        }

        return [
            'success' => true,
            'token' => $this->issueAccessToken($user),
            'refresh_token' => $this->issueRefreshToken($user),
            'user' => User::publicData($user),
        ];
    }

    public function forgotPassword(string $email): array
    {
        $user = $this->users->findByEmail($email);

        if (!$user) {
            return ['success' => false, 'message' => 'No account found with this email.', 'status' => 404];
        }

        $token = bin2hex(random_bytes(32));
        $this->resets->invalidateFor(User::idOf($user));
        $this->resets->createFor(User::idOf($user), $token);

        $link = config('app.url', 'http://localhost:8000') . '/reset-password?token=' . $token;
        error_log("[ElexoPlus] Password reset link for {$email}: {$link}");

        if (config('debug', false)) {
            return ['success' => true, 'message' => 'Password reset token generated.', 'reset_token' => $token];
        }

        return ['success' => true, 'message' => 'Password reset link sent to your email.'];
    }

    public function resetPassword(string $token, string $password): array
    {
        $record = $this->resets->findValid($token);

        if (!$record) {
            return ['success' => false, 'message' => 'Invalid or expired reset token.', 'status' => 400];
        }

        if (strlen($password) < 6) {
            return ['success' => false, 'message' => 'Password must be at least 6 characters.', 'status' => 422];
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $this->users->updatePassword((string) $record['user_id'], $hash);
        $this->resets->markUsed((string) ($record['password_reset_id'] ?? $record['id']));
        $this->resets->invalidateFor($record['user_id']);

        return ['success' => true, 'message' => 'Password reset successfully. You can now log in.'];
    }

    private function issueAccessToken(array $user): string
    {
        return Jwt::issue([
            'sub' => User::idOf($user),
            'type' => 'access',
            'role' => $user['role'] ?? null,
        ]);
    }

    private function issueRefreshToken(array $user): string
    {
        return Jwt::issue([
            'sub' => User::idOf($user),
            'type' => 'refresh',
            'role' => $user['role'] ?? null,
        ], config('jwt.refresh_ttl', 604800));
    }
}
