<?php

namespace Modules\Leave\Repositories;

use Modules\Leave\Models\LeaveApproval;

class LeaveApprovalRepository
{
    public function findById(string $id): ?array
    {
        return LeaveApproval::find($id);
    }

    public function findAllByRequest(string $leaveRequestId): array
    {
        return LeaveApproval::allByRequest($leaveRequestId);
    }

    public function findPendingForRequest(string $leaveRequestId): ?array
    {
        return LeaveApproval::findPendingForRequest($leaveRequestId);
    }

    public function findAllPendingForApprover(string $approverEmployeeId): array
    {
        return LeaveApproval::allPendingForApprover($approverEmployeeId);
    }

    public function create(array $data): ?array
    {
        return LeaveApproval::create($data);
    }

    public function recordDecision(string $id, string $decision, ?string $remarks = null): ?array
    {
        return LeaveApproval::recordDecision($id, $decision, $remarks);
    }
}