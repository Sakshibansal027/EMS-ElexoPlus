<?php

namespace Modules\Attendance\Services;

use Modules\Attendance\Repositories\AttendanceRepository;

class AttendanceService
{
    public function __construct(
        private AttendanceRepository $attendance
    ) {
    }

    public function findById(int $id): array
    {
        $record = $this->attendance->findById($id);

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Attendance record not found.',
                'status' => 404,
            ];
        }

        return [
            'success' => true,
            'data' => $record,
        ];
    }

    public function findByEmployeeAndDate(
        string $employeeId,
        string $attendanceDate
    ): array {
        $record = $this->attendance->findByEmployeeAndDate(
            $employeeId,
            $attendanceDate
        );

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Attendance record not found.',
                'status' => 404,
            ];
        }

        return [
            'success' => true,
            'data' => $record,
        ];
    }

    public function findAll(): array
    {
        return [
            'success' => true,
            'data' => $this->attendance->findAll(),
        ];
    }

    public function findByEmployee(string $employeeId): array
    {
        return [
            'success' => true,
            'data' => $this->attendance->findByEmployee($employeeId),
        ];
    }

    public function findByEmployees(array $employeeIds): array
    {
        return [
            'success' => true,
            'data' => $this->attendance->findByEmployees($employeeIds),
        ];
    }

    public function findByDate(string $attendanceDate): array
    {
        return [
            'success' => true,
            'data' => $this->attendance->findByDate($attendanceDate),
        ];
    }

    public function create(array $data): array
    {
        $existing = $this->attendance->findByEmployeeAndDate(
            $data['employee_id'],
            $data['attendance_date']
        );

        if ($existing) {
            return [
                'success' => false,
                'message' => 'Attendance already exists for this employee and date.',
                'status' => 409,
            ];
        }

        $record = $this->attendance->create($data);

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Unable to create attendance record.',
                'status' => 500,
            ];
        }

        return [
            'success' => true,
            'message' => 'Attendance created successfully.',
            'data' => $record,
        ];
    }
}