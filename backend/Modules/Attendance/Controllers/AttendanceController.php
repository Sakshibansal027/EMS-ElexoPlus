<?php

namespace Modules\Attendance\Controllers;

use Modules\Attendance\Repositories\AttendanceCorrectionRepository;
use Modules\Attendance\Repositories\AttendanceRepository;
use Modules\Attendance\Services\AttendanceCorrectionService;
use Modules\Attendance\Services\AttendanceService;
use Modules\Authentication\Support\Request;

class AttendanceController
{
    private AttendanceService $attendance;
    private AttendanceCorrectionService $corrections;

    public function __construct()
    {
        $this->attendance = new AttendanceService(
            new AttendanceRepository()
        );

        $this->corrections = new AttendanceCorrectionService(
            new AttendanceCorrectionRepository()
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

    public function findAllCorrections(array $params): array
    {
        return $this->corrections->findAll();
    }

    public function findCorrection(array $params): array
    {
        $id = (int) ($params['id'] ?? 0);

        if ($id <= 0) {
            return [
                'success' => false,
                'message' => 'Correction id is required.',
                'status' => 422,
            ];
        }

        return $this->corrections->findById($id);
    }

    public function findEmployeeCorrections(array $params): array
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

        return $this->corrections->findByEmployee($employeeId);
    }

    public function createCorrection(array $params): array
    {
        return $this->corrections->create([
            'employee_id' => trim((string) Request::input('employee_id', '')),
            'correction_date' => trim((string) Request::input('correction_date', '')),
            'requested_check_in' => Request::input('requested_check_in'),
            'requested_check_out' => Request::input('requested_check_out'),
            'reason' => trim((string) Request::input('reason', '')),
            'submitted_on' => Request::input('submitted_on'),
        ]);
    }

    public function approveCorrection(array $params): array
    {
        $id = (int) ($params['id'] ?? 0);

        if ($id <= 0) {
            return [
                'success' => false,
                'message' => 'Correction id is required.',
                'status' => 422,
            ];
        }

        return $this->corrections->approve($id);
    }

    public function rejectCorrection(array $params): array
    {
        $id = (int) ($params['id'] ?? 0);

        if ($id <= 0) {
            return [
                'success' => false,
                'message' => 'Correction id is required.',
                'status' => 422,
            ];
        }

        return $this->corrections->reject($id);
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
