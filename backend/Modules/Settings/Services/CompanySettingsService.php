<?php

namespace Modules\Settings\Services;

use Modules\Settings\Repositories\CompanySettingsRepository;

class CompanySettingsService
{
    public function __construct(private CompanySettingsRepository $repo) {}

    public function get(): array
    {
        $settings = $this->repo->get();
        if (!$settings) {
            return ['success' => true, 'settings' => $this->defaults()];
        }
        $workingDays = $settings['working_days'];
        if (is_string($workingDays)) $workingDays = json_decode($workingDays, true);
        return [
            'success' => true,
            'settings' => [
                'companyName' => $settings['company_name'],
                'tagline' => $settings['tagline'] ?? '',
                'email' => $settings['email'],
                'phone' => $settings['phone'],
                'website' => $settings['website'] ?? '',
                'address' => $settings['address'] ?? '',
                'city' => $settings['city'] ?? '',
                'state' => $settings['state'] ?? '',
                'country' => $settings['country'],
                'pincode' => $settings['pincode'] ?? '',
                'workingDays' => $workingDays ?? [],
                'workingHoursStart' => $settings['working_hours_start'],
                'workingHoursEnd' => $settings['working_hours_end'],
                'timezone' => $settings['timezone'],
                'dateFormat' => $settings['date_format'],
                'currency' => $settings['currency'],
            ],
        ];
    }

    public function update(array $data): array
    {
        $validated = $this->validate($data);
        if (isset($validated['error'])) return $validated;

        $mapped = [
            'company_name' => $data['companyName'] ?? $data['company_name'] ?? null,
            'tagline' => $data['tagline'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'website' => $data['website'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'state' => $data['state'] ?? null,
            'country' => $data['country'] ?? null,
            'pincode' => $data['pincode'] ?? null,
            'working_days' => $data['workingDays'] ?? $data['working_days'] ?? null,
            'working_hours_start' => $data['workingHoursStart'] ?? $data['working_hours_start'] ?? null,
            'working_hours_end' => $data['workingHoursEnd'] ?? $data['working_hours_end'] ?? null,
            'timezone' => $data['timezone'] ?? null,
            'date_format' => $data['dateFormat'] ?? $data['date_format'] ?? null,
            'currency' => $data['currency'] ?? null,
        ];
        $mapped = array_filter($mapped, static fn($v) => $v !== null);

        try {
            $this->repo->update($mapped);
            return ['success' => true, 'message' => 'Company settings updated.'];
        } catch (\PDOException $e) {
            return ['success' => false, 'message' => 'Unable to save company settings.', 'status' => 500];
        }
    }

    private function validate(array $data): array
    {
        $required = ['companyName', 'email', 'phone', 'country'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return ['error' => true, 'success' => false, 'message' => "$field is required.", 'status' => 422];
            }
        }
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return ['error' => true, 'success' => false, 'message' => 'A valid email is required.', 'status' => 422];
        }
        return [];
    }

    private function defaults(): array
    {
        return [
            'companyName' => '',
            'tagline' => '',
            'email' => '',
            'phone' => '',
            'website' => '',
            'address' => '',
            'city' => '',
            'state' => '',
            'country' => '',
            'pincode' => '',
            'workingDays' => [],
            'workingHoursStart' => '09:00',
            'workingHoursEnd' => '18:00',
            'timezone' => 'Asia/Kolkata',
            'dateFormat' => 'DD-MMM-YYYY',
            'currency' => 'INR',
        ];
    }
}
