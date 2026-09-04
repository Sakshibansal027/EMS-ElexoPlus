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
