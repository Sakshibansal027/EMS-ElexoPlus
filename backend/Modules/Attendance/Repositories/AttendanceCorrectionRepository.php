<?php

namespace Modules\Attendance\Repositories;

use Modules\Attendance\Models\AttendanceCorrection;

class AttendanceCorrectionRepository
{
    public function findById(int $id): ?array
    {
        return AttendanceCorrection::find($id);
    }

    public function findAll(): array
    {
        return AttendanceCorrection::findAll();
    }

    public function findByEmployee(string $employeeId): array
    {
        return AttendanceCorrection::findByEmployee($employeeId);
    }

    public function create(array $data): ?array
    {
        return AttendanceCorrection::create($data);
    }

    public function updateStatus(int $id, string $status): ?array
    {
        return AttendanceCorrection::updateStatus($id, $status);
    }
}
