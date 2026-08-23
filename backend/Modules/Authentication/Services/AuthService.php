<?php

namespace Modules\Authentication\Services;

use Modules\Authentication\Models\User;
use Modules\Authentication\Repositories\PasswordResetRepository;
use Modules\Authentication\Repositories\UserRepository;
use Modules\Authentication\Support\Jwt;
use Core\Mailer;

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

        // Do not reveal whether an email address belongs to an account.
        if (!$user) return ['success' => true, 'message' => 'If the account exists, password reset instructions have been sent.'];

        $token = bin2hex(random_bytes(32));
        $userId = User::idOf($user);
        $this->resets->invalidateFor($userId);
        $this->resets->createFor($userId, $token);

        $frontend = config('frontend_url', 'http://localhost:5173');
        $link = $frontend . '/reset-password?token=' . $token;

        $name = (string) ($user['name'] ?: $user['username']);
        $subject = 'Reset your ElexoPlus password';
        $body = $this->resetEmailHtml($name, $link);
        $alt = "Hi {$name},\n\nWe received a request to reset your ElexoPlus password. Click the link below to choose a new one:\n\n{$link}\n\nIf you didn't request this, you can safely ignore this email.\n\nThanks,\nThe ElexoPlus Team";

        Mailer::send($email, $subject, $body, $alt);

        return ['success' => true, 'message' => 'If the account exists, password reset instructions have been sent.'];
    }

    public function resetPassword(string $token, string $password): array
    {
        $record = $this->resets->findValid($token);

        if (!$record) {
            return ['success' => false, 'message' => 'Invalid or expired reset token.', 'status' => 400];
        }

        if (!$this->isStrongPassword($password)) {
            return ['success' => false, 'message' => 'Password does not meet the security requirements.', 'status' => 422];
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

    private function resetEmailHtml(string $name, string $link): string
    {
        $escapedName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $escapedLink = htmlspecialchars($link, ENT_QUOTES, 'UTF-8');

        return '
        <div style="font-family: Arial, Helvetica, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 16px;">
            <div style="max-width: 520px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px;">
                <h2 style="margin: 0 0 16px; color: #f59e0b;">Reset your password</h2>
                <p style="margin: 0 0 16px; line-height: 1.6;">Hi ' . $escapedName . ',</p>
                <p style="margin: 0 0 16px; line-height: 1.6;">We received a request to reset the password for your ElexoPlus account. Click the button below to choose a new one.</p>
                <p style="margin: 0 0 24px; text-align: center;">
                    <a href="' . $escapedLink . '" style="display: inline-block; background: #f59e0b; color: #0f172a; text-decoration: none; font-weight: bold; padding: 12px 28px; border-radius: 10px;">Reset Password</a>
                </p>
                <p style="margin: 0 0 16px; line-height: 1.6; font-size: 13px; color: #94a3b8;">If the button does not work, copy and paste this link into your browser:</p>
                <p style="margin: 0 0 24px; line-height: 1.5; word-break: break-all; font-size: 12px; color: #cbd5e1;">' . $escapedLink . '</p>
                <p style="margin: 0 0 8px; line-height: 1.6; font-size: 13px; color: #94a3b8;">If you didn\'t request this, you can safely ignore this email.</p>
                <p style="margin: 0; line-height: 1.6; font-size: 13px; color: #94a3b8;">Thanks,<br />The ElexoPlus Team</p>
            </div>
        </div>';
    }

    private function isStrongPassword(string $password): bool
    {
        return strlen($password) >= 8
            && preg_match('/[A-Z]/', $password)
            && preg_match('/[a-z]/', $password)
            && preg_match('/\d/', $password)
            && preg_match('/[^A-Za-z0-9]/', $password);
    }
}
