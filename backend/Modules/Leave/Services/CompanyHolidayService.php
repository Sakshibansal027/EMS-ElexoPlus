<?php

namespace Modules\Leave\Services;

use Modules\Leave\Repositories\CompanyHolidayRepository;

class CompanyHolidayService
{
    private const VALID_TYPES = ['Public Holiday', 'Optional Holiday', 'Company Holiday'];

    public function __construct(
        private CompanyHolidayRepository $holidays
    ) {
    }

    /**
     * Powers the holiday calendar screen — one year at a time,
     * optionally scoped to a location/branch.
     */
    public function listForYear(int $year, ?string $location = null): array
    {
        return ['success' => true, 'holidays' => $this->holidays->findAllInYear($year, $location)];
    }

    public function getById(string $id): array
    {
        $holiday = $this->holidays->findById($id);

        if (!$holiday) {
            return ['success' => false, 'message' => 'Holiday not found.', 'status' => 404];
        }

        return ['success' => true, 'holiday' => $holiday];
    }

    /**
     * Adds a holiday. Only real rule here is that holiday_type has to
     * be one of the schema's allowed ENUM values — checked here
     * rather than just letting a bad value hit the DB and bounce back
     * as a cryptic SQL error, so the caller gets a clear message.
     * The (date, title, location) uniqueness is still enforced by the
     * DB's UNIQUE constraint — we don't duplicate that check here,
     * we just let the DB reject it and the Controller translate that
     * into a friendly error.
     */
    public function create(array $data): array
    {
        $data['title'] = trim((string) ($data['title'] ?? ''));
        $data['location'] = trim((string) ($data['location'] ?? 'All')) ?: 'All';
        if ($data['title'] === '' || empty($data['holiday_date']) || empty($data['holiday_type'])) {
            return ['success' => false, 'message' => 'title, holiday_date and holiday_type are required.', 'status' => 422];
        }

        if (mb_strlen($data['title']) > 150 || mb_strlen($data['location']) > 100 || !$this->isValidDate((string) $data['holiday_date'])) {
            return ['success' => false, 'message' => 'Provide a valid date, title (max 150 characters), and location (max 100 characters).', 'status' => 422];
        }

        if (!in_array($data['holiday_type'], self::VALID_TYPES, true)) {
            return ['success' => false, 'message' => 'Invalid holiday_type.', 'status' => 422];
        }

        $holiday = $this->holidays->create($data);

        return ['success' => true, 'message' => 'Holiday added.', 'holiday' => $holiday];
    }

    public function update(string $id, array $data): array
    {
        $existing = $this->holidays->findById($id);
        if (!$existing) {
            return ['success' => false, 'message' => 'Holiday not found.', 'status' => 404];
        }

        if (array_key_exists('title', $data)) $data['title'] = trim((string) $data['title']);
        if (array_key_exists('location', $data)) $data['location'] = trim((string) $data['location']) ?: 'All';
        if ((array_key_exists('title', $data) && ($data['title'] === '' || mb_strlen($data['title']) > 150))
            || (array_key_exists('location', $data) && mb_strlen($data['location']) > 100)
            || (array_key_exists('holiday_date', $data) && !$this->isValidDate((string) $data['holiday_date']))) {
            return ['success' => false, 'message' => 'Provide a valid date, title (max 150 characters), and location (max 100 characters).', 'status' => 422];
        }
        if (!empty($data['holiday_type']) && !in_array($data['holiday_type'], self::VALID_TYPES, true)) {
            return ['success' => false, 'message' => 'Invalid holiday_type.', 'status' => 422];
        }

        $holiday = $this->holidays->update($id, $data);

        return ['success' => true, 'message' => 'Holiday updated.', 'holiday' => $holiday];
    }

    public function delete(string $id): array
    {
        $existing = $this->holidays->findById($id);
        if (!$existing) {
            return ['success' => false, 'message' => 'Holiday not found.', 'status' => 404];
        }

        $this->holidays->delete($id);

        return ['success' => true, 'message' => 'Holiday removed.'];
    }

    private function isValidDate(string $value): bool
    {
        $date = \DateTime::createFromFormat('!Y-m-d', $value);
        return $date !== false && $date->format('Y-m-d') === $value;
    }
}
