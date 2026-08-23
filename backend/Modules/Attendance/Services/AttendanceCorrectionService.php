<?php

namespace Modules\Attendance\Services;

use Modules\Attendance\Repositories\AttendanceCorrectionRepository;

class AttendanceCorrectionService
{
    private const PENDING = 'Pending';
    private const APPROVED = 'Approved';
    private const REJECTED = 'Rejected';

    public function __construct(
        private AttendanceCorrectionRepository $corrections
    ) {
    }

    public function findById(int $id): array
    {
        $record = $this->corrections->findById($id);

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Attendance correction not found.',
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
            'data' => $this->corrections->findAll(),
        ];
    }

    public function findByEmployee(string $employeeId): array
    {
        if (trim($employeeId) === '') {
            return [
                'success' => false,
                'message' => 'employee_id is required.',
                'status' => 422,
            ];
        }

        return [
            'success' => true,
            'data' => $this->corrections->findByEmployee($employeeId),
        ];
    }

    public function create(array $data): array
    {
        if (
            empty($data['employee_id']) ||
            empty($data['correction_date']) ||
            empty($data['reason'])
        ) {
            return [
                'success' => false,
                'message' => 'employee_id, correction_date and reason are required.',
                'status' => 422,
            ];
        }

        $record = $this->corrections->create([
            'employee_id' => $data['employee_id'],
            'correction_date' => $data['correction_date'],
            'requested_check_in' => $data['requested_check_in'] ?? null,
            'requested_check_out' => $data['requested_check_out'] ?? null,
            'reason' => $data['reason'],
            'status' => self::PENDING,
            'submitted_on' => $data['submitted_on'] ?? date('Y-m-d'),
        ]);

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Unable to create attendance correction.',
                'status' => 500,
            ];
        }

        return [
            'success' => true,
            'message' => 'Attendance correction submitted successfully.',
            'data' => $record,
        ];
    }

    public function approve(int $id): array
    {
        return $this->updateStatus($id, self::APPROVED);
    }

    public function reject(int $id): array
    {
        return $this->updateStatus($id, self::REJECTED);
    }

    private function updateStatus(int $id, string $status): array
    {
        $record = $this->corrections->findById($id);

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Attendance correction not found.',
                'status' => 404,
            ];
        }

        if (($record['status'] ?? null) !== self::PENDING) {
            return [
                'success' => false,
                'message' => 'Only pending corrections can be updated.',
                'status' => 409,
            ];
        }

        $updated = $this->corrections->updateStatus($id, $status);

        if (!$updated) {
            return [
                'success' => false,
                'message' => 'Unable to update attendance correction.',
                'status' => 500,
            ];
        }

        return [
            'success' => true,
            'message' => 'Attendance correction status updated successfully.',
            'data' => $updated,
        ];
    }
}