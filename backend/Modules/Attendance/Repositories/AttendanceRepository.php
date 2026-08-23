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

    public function create(array $data): ?array
    {
        return Attendance::create($data);
    }
}