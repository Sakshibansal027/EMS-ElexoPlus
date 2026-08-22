<?php

namespace Modules\Leave\Repositories;

use Modules\Leave\Models\LeaveRequest;

class LeaveRequestRepository
{
    public function findById(string $id): ?array
    {
        return LeaveRequest::find($id);
    }

    public function findAllByEmployee(string $employeeId): array
    {
        return LeaveRequest::allByEmployee($employeeId);
    }

    public function findAllByStatus(string $status): array
    {
        return LeaveRequest::allByStatus($status);
    }

    public function create(array $data): ?array
    {
        return LeaveRequest::create($data);
    }

    public function update(string $id, array $data): ?array
    {
        return LeaveRequest::update($id, $data);
    }

    public function findAllBetween(string $startDate, string $endDate): array
    {
        return LeaveRequest::allBetween($startDate, $endDate);
    }

    public function hasConflictingRequest(string $employeeId, string $startDate, string $endDate): bool
    {
        return LeaveRequest::hasConflictingRequest($employeeId, $startDate, $endDate);
    }

    public function setStatus(string $id, string $status): ?array
    {
        return LeaveRequest::setStatus($id, $status);
    }
}
