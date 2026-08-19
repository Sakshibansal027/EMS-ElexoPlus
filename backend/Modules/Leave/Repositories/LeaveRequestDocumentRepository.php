<?php

namespace Modules\Leave\Repositories;

use Modules\Leave\Models\LeaveRequestDocument;

class LeaveRequestDocumentRepository
{
    public function findById(string $id): ?array
    {
        return LeaveRequestDocument::find($id);
    }

    public function findAllByRequest(string $leaveRequestId): array
    {
        return LeaveRequestDocument::allByRequest($leaveRequestId);
    }

    public function create(array $data): ?array
    {
        return LeaveRequestDocument::create($data);
    }

    public function delete(string $id): bool
    {
        return LeaveRequestDocument::delete($id);
    }
}