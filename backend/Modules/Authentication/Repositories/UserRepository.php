<?php

namespace Modules\Authentication\Repositories;

use Modules\Authentication\Models\User;

class UserRepository
{
    public function findById(int $id): ?array
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

    public function updateLastLogin(int $id): void
    {
        User::updateLastLogin($id);
    }

    public function updatePassword(int $id, string $passwordHash): bool
    {
        return User::updatePassword($id, $passwordHash);
    }
}