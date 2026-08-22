<?php

namespace Modules\Authentication\Repositories;

use Modules\Authentication\Models\User;

class UserRepository
{
    public function findById(string $id): ?array
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?array
    {
        return User::findByEmail($email);
    }

    public function create(array $data): ?array
    {
        return User::create($data);
    }

    public function updateLastLogin(string $id): void
    {
        User::updateLastLogin($id);
    }

    public function updatePassword(string $id, string $passwordHash): bool
    {
        return User::updatePassword($id, $passwordHash);
    }
}
