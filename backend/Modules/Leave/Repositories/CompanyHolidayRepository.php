<?php

namespace Modules\Leave\Repositories;

use Modules\Leave\Models\CompanyHoliday;

class CompanyHolidayRepository
{
    public function findById(string $id): ?array
    {
        return CompanyHoliday::find($id);
    }

    public function findAllBetween(string $startDate, string $endDate, ?string $location = null): array
    {
        return CompanyHoliday::allBetween($startDate, $endDate, $location);
    }

    public function findAllInYear(int $year, ?string $location = null): array
    {
        return CompanyHoliday::allInYear($year, $location);
    }

    public function create(array $data): ?array
    {
        return CompanyHoliday::create($data);
    }

    public function update(string $id, array $data): ?array
    {
        return CompanyHoliday::update($id, $data);
    }

    public function delete(string $id): bool
    {
        return CompanyHoliday::delete($id);
    }
}