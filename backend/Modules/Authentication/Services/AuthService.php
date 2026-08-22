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

        if (!$user || !password_verify($password, $user['password'])) {
            return ['success' => false, 'message' => 'Invalid email or password.', 'status' => 401];
        }

        $this->users->updateLastLogin((int) $user['id']);

        return [
            'success' => true,
            'message' => 'Login successful.',
            'token' => $this->issueAccessToken($user),
            'refresh_token' => $this->issueRefreshToken($user),
            'user' => User::publicData($user),
        ];
    }

    public function me(int $id): array
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

        $user = $this->users->findById((int) $claims['sub']);

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
        $this->resets->invalidateFor((int) $user['id']);
        $this->resets->createFor((int) $user['id'], $token);

        $frontend = config('frontend_url', 'http://localhost:5173');
        $link = $frontend . '/reset-password?token=' . $token;

        $name = $user['name'] ?: $user['username'];
        $subject = 'Reset your ElexoPlus password';
        $body = $this->resetEmailHtml($name, $link);
        $alt = "Hi {$name},\n\nWe received a request to reset your ElexoPlus password. Click the link below to choose a new one:\n\n{$link}\n\nIf you didn't request this, you can safely ignore this email.\n\nThanks,\nThe ElexoPlus Team";

        Mailer::send($email, $subject, $body, $alt);

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
        $this->users->updatePassword((int) $record['user_id'], $hash);
        $this->resets->markUsed((int) $record['id']);
        $this->resets->invalidateFor((int) $record['user_id']);

        return ['success' => true, 'message' => 'Password reset successfully. You can now log in.'];
    }

    private function issueAccessToken(array $user): string
    {
        return Jwt::issue([
            'sub' => (int) $user['id'],
            'type' => 'access',
            'role' => $user['role'] ?? null,
        ]);
    }

    private function issueRefreshToken(array $user): string
    {
        return Jwt::issue([
            'sub' => (int) $user['id'],
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
}
