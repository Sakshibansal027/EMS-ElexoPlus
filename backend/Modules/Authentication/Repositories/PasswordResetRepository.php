<?php

namespace Modules\Authentication\Repositories;

use Modules\Authentication\Models\PasswordReset;

class PasswordResetRepository
{
    public function createFor(string $userId, string $token): void
    {
        PasswordReset::createFor($userId, $token);
    }

    public function findValid(string $token): ?array
    {
        return PasswordReset::findValid($token);
    }

    public function markUsed(string $id): void
    {
        PasswordReset::markUsed($id);
    }

    public function invalidateFor(string $userId): void
    {
        PasswordReset::invalidateFor($userId);
    }
}
