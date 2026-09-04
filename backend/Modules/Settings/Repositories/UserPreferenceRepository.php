<?php

namespace Modules\Settings\Repositories;

use Modules\Settings\Models\UserPreference;

class UserPreferenceRepository
{
    public function get(string $userId): ?array { return UserPreference::get($userId); }
    public function create(string $userId, array $data): array { return UserPreference::create($userId, $data); }
    public function update(string $userId, array $data): array { return UserPreference::update($userId, $data); }
}
