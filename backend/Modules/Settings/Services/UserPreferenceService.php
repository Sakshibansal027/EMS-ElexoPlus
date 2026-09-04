<?php

namespace Modules\Settings\Services;

use Modules\Settings\Repositories\UserPreferenceRepository;

class UserPreferenceService
{
    public function __construct(private UserPreferenceRepository $repo) {}

    public function get(string $userId): array
    {
        $prefs = $this->repo->get($userId);
        if (!$prefs) {
            return ['success' => true, 'preferences' => $this->defaults()];
        }
        return ['success' => true, 'preferences' => $this->present($prefs)];
    }

    public function update(string $userId, array $data): array
    {
        $validation = $this->validate($data);
        if (isset($validation['error'])) return $validation;

        $mapped = [];
        if (isset($data['appearance'])) $mapped['appearance'] = $data['appearance'];
        if (isset($data['notifications'])) $mapped['notifications'] = $data['notifications'];
        if (isset($data['language'])) $mapped['language'] = $data['language'];

        try {
            $this->repo->update($userId, $mapped);
            return ['success' => true, 'message' => 'Preferences updated.'];
        } catch (\PDOException $e) {
            return ['success' => false, 'message' => 'Unable to save preferences.', 'status' => 500];
        }
    }

    private function validate(array $data): array
    {
        $allowed = ['appearance', 'notifications', 'language'];
        $provided = array_intersect(array_keys($data), $allowed);
        if ($provided === []) {
            return ['error' => true, 'success' => false, 'message' => 'At least one preference group is required.', 'status' => 422];
        }

        foreach ($provided as $group) {
            if (!is_array($data[$group])) {
                return ['error' => true, 'success' => false, 'message' => "$group must be an object.", 'status' => 422];
            }
            $encoded = json_encode($data[$group]);
            if ($encoded === false || strlen($encoded) > 20000) {
                return ['error' => true, 'success' => false, 'message' => "$group contains invalid or oversized data.", 'status' => 422];
            }
        }

        if (isset($data['appearance'])) {
            $appearance = $data['appearance'];
            if (isset($appearance['theme']) && !in_array($appearance['theme'], ['dark', 'light'], true)) {
                return ['error' => true, 'success' => false, 'message' => 'Appearance theme must be dark or light.', 'status' => 422];
            }
            if (isset($appearance['fontSize']) && !in_array($appearance['fontSize'], ['small', 'medium', 'large'], true)) {
                return ['error' => true, 'success' => false, 'message' => 'Appearance font size is invalid.', 'status' => 422];
            }
            foreach (['compactMode', 'reducedMotion'] as $field) {
                if (isset($appearance[$field]) && !is_bool($appearance[$field])) {
                    return ['error' => true, 'success' => false, 'message' => "Appearance $field must be true or false.", 'status' => 422];
                }
            }
        }

        if (isset($data['language'])) {
            $language = $data['language'];
            if (isset($language['preferred']) && !in_array($language['preferred'], ['en', 'hi'], true)) {
                return ['error' => true, 'success' => false, 'message' => 'Preferred language is invalid.', 'status' => 422];
            }
            if (isset($language['timeFormat']) && !in_array($language['timeFormat'], ['12h', '24h'], true)) {
                return ['error' => true, 'success' => false, 'message' => 'Time format is invalid.', 'status' => 422];
            }
            if (isset($language['firstDayOfWeek']) && !in_array($language['firstDayOfWeek'], ['monday', 'sunday'], true)) {
                return ['error' => true, 'success' => false, 'message' => 'First day of week is invalid.', 'status' => 422];
            }
        }

        return [];
    }

    private function present(array $prefs): array
    {
        return [
            'appearance' => $prefs['appearance'] ?? [
                'theme' => 'dark',
                'fontSize' => 'medium',
                'compactMode' => false,
                'reducedMotion' => false,
            ],
            'notifications' => $prefs['notifications'] ?? [
                'email' => [
                    'leaveUpdates' => true,
                    'attendanceAlerts' => false,
                    'payrollUpdates' => true,
                    'taskAssignments' => true,
                    'systemAnnouncements' => false,
                ],
                'inApp' => [
                    'leaveUpdates' => true,
                    'attendanceAlerts' => true,
                    'payrollUpdates' => true,
                    'taskAssignments' => true,
                    'systemAnnouncements' => true,
                ],
                'pushEnabled' => false,
                'digestFrequency' => 'immediate',
                'quietHoursStart' => '22:00',
                'quietHoursEnd' => '08:00',
            ],
            'language' => $prefs['language'] ?? [
                'preferred' => 'en',
                'timeFormat' => '12h',
                'firstDayOfWeek' => 'monday',
            ],
        ];
    }

    private function defaults(): array
    {
        return [
            'appearance' => [
                'theme' => 'dark',
                'fontSize' => 'medium',
                'compactMode' => false,
                'reducedMotion' => false,
            ],
            'notifications' => [
                'email' => [
                    'leaveUpdates' => true,
                    'attendanceAlerts' => false,
                    'payrollUpdates' => true,
                    'taskAssignments' => true,
                    'systemAnnouncements' => false,
                ],
                'inApp' => [
                    'leaveUpdates' => true,
                    'attendanceAlerts' => true,
                    'payrollUpdates' => true,
                    'taskAssignments' => true,
                    'systemAnnouncements' => true,
                ],
                'pushEnabled' => false,
                'digestFrequency' => 'immediate',
                'quietHoursStart' => '22:00',
                'quietHoursEnd' => '08:00',
            ],
            'language' => [
                'preferred' => 'en',
                'timeFormat' => '12h',
                'firstDayOfWeek' => 'monday',
            ],
        ];
    }
}
