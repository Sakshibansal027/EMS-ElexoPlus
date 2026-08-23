<?php

namespace Modules\Leave\Models;

use Core\Database;
use Modules\Leave\Support\Uuid;

class CompanyHoliday
{
    protected const TABLE = 'company_holidays';

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . ' WHERE holiday_id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    /**
     * All holidays falling inside a date range, optionally filtered
     * to one location. This is what the holiday calendar screen
     * queries for "show me holidays this year", and what a leave-
     * days calculator would use to skip holidays when counting
     * total_days for a request.
     * $location = null means "don't filter" — return holidays for
     * every location (still includes the 'All' ones either way,
     * since holidays marked 'All' apply everywhere).
     */
    public static function allBetween(string $startDate, string $endDate, ?string $location = null): array
    {
        $sql = 'SELECT * FROM ' . self::TABLE . '
                WHERE holiday_date BETWEEN ? AND ?';
        $params = [$startDate, $endDate];

        if ($location !== null) {
            $sql .= " AND (location = ? OR location = 'All')";
            $params[] = $location;
        }

        $sql .= ' ORDER BY holiday_date ASC';

        $stmt = Database::connection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * All holidays in a given calendar year — a thin convenience
     * wrapper around allBetween() for the common "show this year's
     * calendar" case, so callers don't have to build Jan 1 / Dec 31
     * date strings themselves every time.
     */
    public static function allInYear(int $year, ?string $location = null): array
    {
        return self::allBetween("$year-01-01", "$year-12-31", $location);
    }

    public static function create(array $data): ?array
    {
        $id = Uuid::generate();

        $stmt = Database::connection()->prepare(
            'INSERT INTO ' . self::TABLE . '
             (holiday_id, title, holiday_date, holiday_type, location)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            $data['title'],
            $data['holiday_date'],
            $data['holiday_type'],
            $data['location'] ?? 'All',
        ]);

        return array_merge($data, ['holiday_id' => $id, 'location' => $data['location'] ?? 'All']);
    }

    public static function update(string $id, array $data): ?array
    {
        $data = array_intersect_key($data, array_flip(['title', 'holiday_date', 'holiday_type', 'location']));

        if (empty($data)) {
            return self::find($id);
        }

        $fields = [];
        $values = [];
        foreach ($data as $column => $value) {
            $fields[] = "$column = ?";
            $values[] = $value;
        }
        $values[] = $id;

        $stmt = Database::connection()->prepare(
            'UPDATE ' . self::TABLE . ' SET ' . implode(', ', $fields) . ' WHERE holiday_id = ?'
        );
        $stmt->execute($values);

        return array_merge($data, ['holiday_id' => $id]);
    }

    /**
     * Hard delete — same reasoning as LeaveRequestDocument. Nothing
     * else in the schema has an FK pointing at company_holidays, so
     * removing a wrongly-added holiday doesn't risk orphaning or
     * blocking any other row.
     */
    public static function delete(string $id): bool
    {
        $stmt = Database::connection()->prepare(
            'DELETE FROM ' . self::TABLE . ' WHERE holiday_id = ?'
        );
        return $stmt->execute([$id]);
    }
}
