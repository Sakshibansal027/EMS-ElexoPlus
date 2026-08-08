<?php

namespace Modules\Authentication\Repositories;

use Modules\Authentication\Models\PasswordReset;

class PasswordResetRepository
{
    public function createFor(int $userId, string $token): void
    {
        PasswordReset::createFor($userId, $token);
    }

    public function findValid(string $token): ?array
    {
        return PasswordReset::findValid($token);
    }

    public function markUsed(int $id): void
    {
        PasswordReset::markUsed($id);
    }

    public function invalidateFor(int $userId): void
    {
        PasswordReset::invalidateFor($userId);
    }
}