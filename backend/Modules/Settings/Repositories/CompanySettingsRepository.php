<?php

namespace Modules\Settings\Repositories;

use Modules\Settings\Models\CompanySettings;

class CompanySettingsRepository
{
    public function get(): ?array { return CompanySettings::get(); }
    public function create(array $data): array { return CompanySettings::create($data); }
    public function update(array $data): array { return CompanySettings::update($data); }
}
