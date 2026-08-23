<?php

namespace Modules\Attendance\Repositories;

use Modules\Attendance\Models\Attendance;

class AttendanceRepository
{
    public function findById(int $id): ?array
    {
        return Attendance::find($id);
    }

    public function findByEmployeeAndDate(
        string $employeeId,
        string $attendanceDate
    ): ?array {
        return Attendance::findByEmployeeAndDate(
            $employeeId,
            $attendanceDate
        );
    }

    public function findAll(): array
    {
        return Attendance::findAll();
    }

    public function findByEmployee(string $employeeId): array
    {
        return Attendance::findByEmployee($employeeId);
    }

    public function findByEmployees(array $employeeIds): array
    {
        return Attendance::findByEmployees($employeeIds);
    }

    public function findByDate(string $attendanceDate): array
    {
        return Attendance::findByDate($attendanceDate);
    }

    public function create(array $data): ?array
    {
        return Attendance::create($data);
    }
}