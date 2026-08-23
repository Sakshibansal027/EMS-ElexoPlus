<?php

namespace Modules\Leave\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Leave\Repositories\LeaveRequestDocumentRepository;
use Modules\Leave\Repositories\LeaveRequestRepository;
use Modules\Leave\Services\LeaveRequestDocumentService;
use Modules\Authentication\Support\Request;
use Modules\Leave\Support\Uuid;
use Core\Database;

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

        $request = (new LeaveRequestRepository())->findById($params['requestId']);
        if (!$request) return ['success' => false, 'message' => 'Leave request not found.', 'status' => 404];
        if (!$this->canViewRequest($auth['user'], $request)) {
            return ['success' => false, 'message' => 'You do not have permission to view these documents.', 'status' => 403];
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

        $request = (new LeaveRequestRepository())->findById($params['requestId']);
        if (!$request) return ['success' => false, 'message' => 'Leave request not found.', 'status' => 404];
        if ($this->employeeIdForUser($auth['user']) !== $request['employee_id']) {
            return ['success' => false, 'message' => 'Only the requesting employee can upload documents.', 'status' => 403];
        }

        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $fileSize = (int) $file['size'];
        if (!in_array($fileExtension, ['pdf', 'jpg', 'jpeg', 'png'], true) || $fileSize > 5 * 1024 * 1024) {
            return ['success' => false, 'message' => 'Only PDF, JPG and PNG files up to 5 MB are allowed.', 'status' => 422];
        }
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!in_array($mime, $allowedMimes, true)) {
            return ['success' => false, 'message' => 'The uploaded file content is not a supported document type.', 'status' => 422];
        }

        $moved = $this->moveUploadedFile($file, $params['requestId'], $fileExtension);
        if (isset($moved['error'])) {
            return ['success' => false, 'message' => $moved['error'], 'status' => 422];
        }

        $data = Request::all();
        $data['file_url'] = $moved['file_url'];
        $data['file_name'] = $file['name'];

        $result = $this->documentService->attach($params['requestId'], $data, $fileSize, $fileExtension);
        if (empty($result['success'])) $this->deleteStoredFile($moved['file_url']);
        return $result;
    }

    /** GET /leave/documents/{id}/download */
    public function download(array $params): string|array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        $document = (new LeaveRequestDocumentRepository())->findById($params['id']);
        if (!$document) return ['success' => false, 'message' => 'Document not found.', 'status' => 404];
        $request = (new LeaveRequestRepository())->findById($document['leave_request_id']);
        if (!$request || !$this->canViewRequest($auth['user'], $request)) {
            return ['success' => false, 'message' => 'You do not have permission to download this document.', 'status' => 403];
        }
        $path = $this->storedFilePath($document['file_url']);
        if (!$path || !is_file($path)) return ['success' => false, 'message' => 'Document file is unavailable.', 'status' => 404];
        header('Content-Type: ' . ((new \finfo(FILEINFO_MIME_TYPE))->file($path) ?: 'application/octet-stream'));
        header('Content-Length: ' . filesize($path));
        header('Content-Disposition: inline; filename="' . str_replace('"', '', basename((string) $document['file_name'])) . '"');
        return (string) file_get_contents($path);
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

        $document = (new LeaveRequestDocumentRepository())->findById($params['id']);
        if (!$document) return ['success' => false, 'message' => 'Document not found.', 'status' => 404];
        $request = (new LeaveRequestRepository())->findById($document['leave_request_id']);
        if (!$request || $this->employeeIdForUser($auth['user']) !== $request['employee_id']) {
            return ['success' => false, 'message' => 'Only the requesting employee can remove this document.', 'status' => 403];
        }
        $result = $this->documentService->remove($params['id']);
        if (!empty($result['success'])) $this->deleteStoredFile($document['file_url']);
        return $result;
    }

    private function canViewRequest(array $user, array $request): bool
    {
        if (in_array(strtoupper((string) ($user['role'] ?? '')), ['ADMIN', 'HR'], true)) return true;
        $employeeId = $this->employeeIdForUser($user);
        if ($employeeId === $request['employee_id']) return true;
        $stmt = Database::connection()->prepare('SELECT 1 FROM leave_approvals WHERE leave_request_id = ? AND approver_employee_id = ? LIMIT 1');
        $stmt->execute([$request['leave_request_id'], $employeeId ?? '']);
        return (bool) $stmt->fetchColumn();
    }

    private function storedFilePath(string $fileUrl): string|false
    {
        $storageRoot = realpath(rtrim((string) config('upload.path'), '/\\'));
        $relativePath = preg_replace('#^/uploads/#', '', $fileUrl) ?? '';
        $path = $storageRoot ? realpath($storageRoot . DIRECTORY_SEPARATOR . ltrim($relativePath, '/\\')) : false;
        return ($storageRoot && $path && str_starts_with($path, $storageRoot . DIRECTORY_SEPARATOR)) ? $path : false;
    }

    private function deleteStoredFile(string $fileUrl): void
    {
        $path = $this->storedFilePath($fileUrl);
        if ($path && is_file($path)) unlink($path);
    }

    private function employeeIdForUser(array $user): ?string
    {
        $email = trim((string) ($user['email'] ?? ''));
        if ($email !== '') {
            $stmt = Database::connection()->prepare('SELECT employee_id FROM employees WHERE email = ? LIMIT 1');
            $stmt->execute([$email]);
            $employeeId = $stmt->fetchColumn();
            if ($employeeId) return (string) $employeeId;
        }
        return !empty($user['employee_id']) ? (string) $user['employee_id'] : null;
    }
}
