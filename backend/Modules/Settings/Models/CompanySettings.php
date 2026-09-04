<?php

namespace Modules\Settings\Models;

use Core\Database;

class CompanySettings
{
    public static function get(): ?array
    {
        $stmt = Database::connection()->query('SELECT * FROM company_settings ORDER BY created_at DESC LIMIT 1');
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): array
    {
        $id = \Modules\Settings\Support\Uuid::generate();
        $stmt = Database::connection()->prepare(
            'INSERT INTO company_settings (company_setting_id, company_name, tagline, email, phone, website, address, city, state, country, pincode, working_days, working_hours_start, working_hours_end, timezone, date_format, currency)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            $data['company_name'],
            $data['tagline'] ?? null,
            $data['email'],
            $data['phone'],
            $data['website'] ?? null,
            $data['address'] ?? null,
            $data['city'] ?? null,
            $data['state'] ?? null,
            $data['country'],
            $data['pincode'] ?? null,
            is_array($data['working_days']) ? json_encode($data['working_days']) : $data['working_days'],
            $data['working_hours_start'],
            $data['working_hours_end'],
            $data['timezone'],
            $data['date_format'],
            $data['currency'],
        ]);
        return self::get();
    }

    public static function update(array $data): array
    {
        $existing = self::get();
        if (!$existing) return self::create($data);

        $allowed = ['company_name','tagline','email','phone','website','address','city','state','country','pincode','working_days','working_hours_start','working_hours_end','timezone','date_format','currency'];
        $sets = [];
        $values = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[] = "$field = ?";
                $values[] = $field === 'working_days' && is_array($data[$field]) ? json_encode($data[$field]) : $data[$field];
            }
        }
        if (!$sets) return $existing;
        $values[] = $existing['company_setting_id'];
        Database::connection()->prepare('UPDATE company_settings SET ' . implode(', ', $sets) . ' WHERE company_setting_id = ?')->execute($values);
        return self::get();
    }
}
