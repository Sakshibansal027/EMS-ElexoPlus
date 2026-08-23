<?php

namespace Modules\Leave\Models;

use Core\Database;
use Modules\Leave\Support\Uuid;

class LeavePolicy
{
    protected const TABLE = 'leave_policies';

    /**
     * Find one leave policy by its UUID primary key.
     */
    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . ' WHERE leave_policy_id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function findByCode(string $code): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . ' WHERE leave_policy_code = ?'
        );
        $stmt->execute([$code]);
        return $stmt->fetch() ?: null;
    }

    /**
     * Returns all policies, newest-name-sorted.
     */
    public static function all(bool $activeOnly = false): array
    {
        $sql = 'SELECT * FROM ' . self::TABLE;
        if ($activeOnly) {
            $sql .= " WHERE status = 'Active'";
        }
        $sql .= ' ORDER BY leave_policy_name ASC';

        $stmt = Database::connection()->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Creates a new policy. We generate the UUID here in PHP (via
     * Uuid::generate()) BEFORE inserting, and pass it explicitly.
     */
    public static function create(array $data): ?array
    {
        $id = Uuid::generate();

        $stmt = Database::connection()->prepare(
            'INSERT INTO ' . self::TABLE . '
             (leave_policy_id, leave_policy_code, leave_policy_name, description,
              annual_quota, accrual_frequency, accrual_method, allow_half_day,
              requires_document, is_paid, carry_forward_allowed, max_carry_forward_days, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            $data['leave_policy_code'],
            $data['leave_policy_name'],
            $data['description'] ?? null,
            $data['annual_quota'],
            $data['accrual_frequency'],
            $data['accrual_method'],
            $data['allow_half_day'] ?? false,
            $data['requires_document'] ?? false,
            $data['is_paid'] ?? true,
            $data['carry_forward_allowed'] ?? false,
            $data['max_carry_forward_days'] ?? 0,
            $data['status'] ?? 'Active',
        ]);

        return self::find($id);
    }

    /**
     * Generic partial update — only the columns present in $data get
     * updated. $id is always the UUID, passed separately so callers
     * can't accidentally overwrite it via $data.
     */
    public static function update(string $id, array $data): ?array
    {
        $allowed = ['leave_policy_code', 'leave_policy_name', 'description', 'annual_quota', 'accrual_frequency', 'accrual_method', 'allow_half_day', 'requires_document', 'is_paid', 'carry_forward_allowed', 'max_carry_forward_days', 'status'];
        $data = array_intersect_key($data, array_flip($allowed));

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
            'UPDATE ' . self::TABLE . ' SET ' . implode(', ', $fields) . ' WHERE leave_policy_id = ?'
        );
        $stmt->execute($values);

        return self::find($id);
    }

    /**
     * Soft delete only
     */
    public static function delete(string $id): bool
    {
        $stmt = Database::connection()->prepare(
            "UPDATE " . self::TABLE . " SET status = 'Inactive' WHERE leave_policy_id = ?"
        );
        return $stmt->execute([$id]);
    }
}
