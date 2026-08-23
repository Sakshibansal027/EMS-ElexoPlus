<?php

namespace Modules\Attendance\Controllers;

use Modules\Attendance\Repositories\AttendanceRepository;
use Modules\Attendance\Services\AttendanceService;
use Modules\Authentication\Support\Request;

class AttendanceController
{
    private AttendanceService $attendance;

    public function __construct()
    {
        $this->attendance = new AttendanceService(
            new AttendanceRepository()
        );
    }

    public function find(array $params): array
    {
        $id = (int) ($params['id'] ?? 0);

        if ($id <= 0) {
            return [
                'success' => false,
                'message' => 'Attendance id is required.',
                'status' => 422,
            ];
        }

        return $this->attendance->findById($id);
    }

    public function findByEmployeeAndDate(array $params): array
    {
        $employeeId = trim(
            (string) ($params['employee_id'] ?? Request::input('employee_id', ''))
        );

        $attendanceDate = trim(
            (string) ($params['attendance_date'] ?? Request::input('attendance_date', ''))
        );

        if ($employeeId === '' || $attendanceDate === '') {
            return [
                'success' => false,
                'message' => 'employee_id and attendance_date are required.',
                'status' => 422,
            ];
        }

        return $this->attendance->findByEmployeeAndDate(
            $employeeId,
            $attendanceDate
        );
    }

    public function findAll(array $params): array
    {
        return $this->attendance->findAll();
    }

    public function findByEmployee(array $params): array
    {
        $employeeId = trim(
            (string) ($params['employee_id'] ?? Request::input('employee_id', ''))
        );

        if ($employeeId === '') {
            return [
                'success' => false,
                'message' => 'employee_id is required.',
                'status' => 422,
            ];
        }

        return $this->attendance->findByEmployee($employeeId);
    }

    public function findByDate(array $params): array
    {
        $attendanceDate = trim(
            (string) ($params['attendance_date'] ?? Request::input('attendance_date', ''))
        );

        if ($attendanceDate === '') {
            return [
                'success' => false,
                'message' => 'attendance_date is required.',
                'status' => 422,
            ];
        }

        return $this->attendance->findByDate($attendanceDate);
    }

    public function create(array $params): array
    {
        $employeeId = trim((string) Request::input('employee_id', ''));
        $attendanceDate = trim((string) Request::input('attendance_date', ''));

        if ($employeeId === '' || $attendanceDate === '') {
            return [
                'success' => false,
                'message' => 'employee_id and attendance_date are required.',
                'status' => 422,
            ];
        }

        return $this->attendance->create([
            'employee_id' => $employeeId,
            'attendance_date' => $attendanceDate,
            'check_in' => Request::input('check_in'),
            'check_out' => Request::input('check_out'),
            'break_minutes' => (int) Request::input('break_minutes', 0),
            'working_hours' => (float) Request::input('working_hours', 0),
            'overtime' => (float) Request::input('overtime', 0),
            'status' => Request::input('status', 'Present'),
            'shift' => Request::input('shift'),
            'remarks' => Request::input('remarks'),
        ]);
    }
}