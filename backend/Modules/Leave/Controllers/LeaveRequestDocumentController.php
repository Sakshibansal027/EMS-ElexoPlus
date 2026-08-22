<?php

namespace Modules\Leave\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Leave\Repositories\LeaveRequestDocumentRepository;
use Modules\Leave\Repositories\LeaveRequestRepository;
use Modules\Leave\Services\LeaveRequestDocumentService;
use Modules\Leave\Support\Request;
use Modules\Leave\Support\Uuid;

class LeaveRequestDocumentController
{
    private LeaveRequestDocumentService $documentService;

    public function __construct()
    {
        $this->documentService = new LeaveRequestDocumentService(
            new LeaveRequestDocumentRepository(),
            new LeaveRequestRepository()
        );
    }

    /**
     * GET /leave/requests/{requestId}/documents
     */
    public function index(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->documentService->listForRequest($params['requestId']);
    }

    /**
     * POST /leave/requests/{requestId}/documents
     *
     * Expects a multipart/form-data request with the file under the
     * "document" field, plus a "document_type" field. This method
     * moves the file to storage/uploads/leave-documents/{requestId}/
     * (path comes from config('upload.path'), same config other
     * modules should reuse) and hands the resulting file_url/file_name
     * to the service to validate + record.
     */
    public function store(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $file = $_FILES['document'] ?? null;
        if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            return ['success' => false, 'message' => 'A document file is required.', 'status' => 422];
        }

        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $fileSize = $file['size'];

        $moved = $this->moveUploadedFile($file, $params['requestId'], $fileExtension);
        if (isset($moved['error'])) {
            return ['success' => false, 'message' => $moved['error'], 'status' => 422];
        }

        $data = Request::input();
        $data['file_url'] = $moved['file_url'];
        $data['file_name'] = $file['name'];

        return $this->documentService->attach($params['requestId'], $data, $fileSize, $fileExtension);
    }

    /**
     * Moves an uploaded file into storage/uploads/leave-documents/{requestId}/
     * under a random filename (never trust the client-supplied name for
     * the on-disk path — only keep it as the display file_name), and
     * returns a file_url relative to the storage root.
     *
     * Extension/size validation itself still happens in
     * LeaveRequestDocumentService::attach() — this only handles the
     * actual disk write, so it stays a controller-level concern like
     * the service's docblock already says.
     */
    private function moveUploadedFile(array $file, string $requestId, string $fileExtension): array
    {
        $baseDir = rtrim((string) config('upload.path', __DIR__ . '/../../../storage/uploads'), '/');
        $targetDir = $baseDir . '/leave-documents/' . $requestId;

        if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
            return ['error' => 'Could not create storage directory for this upload.'];
        }

        $storedName = Uuid::generate() . ($fileExtension !== '' ? ".{$fileExtension}" : '');
        $destination = $targetDir . '/' . $storedName;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            return ['error' => 'Failed to store the uploaded file.'];
        }

        // NOTE: storage/uploads lives outside public/ (the web root),
        // so Apache can't serve it directly at that path. A symlink
        // public/uploads -> ../storage/uploads makes files reachable
        // at /uploads/... — see storage/uploads/README.md for the
        // one-time setup command. This mirrors the standard
        // "public/storage -> storage/app/public" symlink pattern.
        return ['file_url' => '/uploads/leave-documents/' . $requestId . '/' . $storedName];
    }

    /**
     * DELETE /leave/documents/{id}
     */
    public function destroy(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->documentService->remove($params['id']);
    }
}