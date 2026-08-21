<?php

namespace Modules\Leave\Services;

use Modules\Leave\Repositories\LeaveRequestDocumentRepository;
use Modules\Leave\Repositories\LeaveRequestRepository;

class LeaveRequestDocumentService
{
    private const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
    private const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

    public function __construct(
        private LeaveRequestDocumentRepository $documents,
        private LeaveRequestRepository $requests
    ) {
    }

    public function listForRequest(string $leaveRequestId): array
    {
        return ['success' => true, 'documents' => $this->documents->findAllByRequest($leaveRequestId)];
    }

    /**
     * Attaches a document to a leave request.
     *
     * Note what this does NOT do: move/save the uploaded file to
     * disk. That's a Controller-level concern (reading $_FILES,
     * picking a storage path, calling move_uploaded_file()) — by the
     * time this method is called, the file should already be saved
     * somewhere, and $data['file_url'] should point to it. This
     * method's job is purely: validate the request is in a state
     * where attaching a document makes sense, and record it.
     */
    public function attach(string $leaveRequestId, array $data, ?string $fileSizeBytes = null, ?string $fileExtension = null): array
    {
        $request = $this->requests->findById($leaveRequestId);
        if (!$request) {
            return ['success' => false, 'message' => 'Leave request not found.', 'status' => 404];
        }

        // Once a request is fully decided, its documents shouldn't
        // change anymore — that would let someone alter the evidence
        // an approval was already based on.
        if (in_array($request['status'], ['Approved', 'Rejected', 'Cancelled'], true)) {
            return ['success' => false, 'message' => 'Cannot attach documents to a finalized request.', 'status' => 409];
        }

        if (empty($data['document_type']) || empty($data['file_name']) || empty($data['file_url'])) {
            return ['success' => false, 'message' => 'document_type, file_name and file_url are required.', 'status' => 422];
        }

        if ($fileExtension !== null && !in_array(strtolower($fileExtension), self::ALLOWED_EXTENSIONS, true)) {
            return ['success' => false, 'message' => 'Only PDF, JPG and PNG files are allowed.', 'status' => 422];
        }

        if ($fileSizeBytes !== null && (int) $fileSizeBytes > self::MAX_FILE_SIZE_BYTES) {
            return ['success' => false, 'message' => 'File exceeds the 5 MB limit.', 'status' => 422];
        }

        $document = $this->documents->create([
            'leave_request_id' => $leaveRequestId,
            'document_type' => $data['document_type'],
            'file_name' => $data['file_name'],
            'file_url' => $data['file_url'],
        ]);

        return ['success' => true, 'message' => 'Document attached.', 'document' => $document];
    }

    /**
     * Same "finalized requests are locked" rule applies to removing
     * a document as it does to attaching one.
     */
    public function remove(string $documentId): array
    {
        $document = $this->documents->findById($documentId);
        if (!$document) {
            return ['success' => false, 'message' => 'Document not found.', 'status' => 404];
        }

        $request = $this->requests->findById($document['leave_request_id']);
        if ($request && in_array($request['status'], ['Approved', 'Rejected', 'Cancelled'], true)) {
            return ['success' => false, 'message' => 'Cannot remove documents from a finalized request.', 'status' => 409];
        }

        $this->documents->delete($documentId);

        return ['success' => true, 'message' => 'Document removed.'];
    }
}