<?php

namespace Modules\Employee\Controllers;

use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Employee\Repositories\EmployeeRepository;
use Modules\Employee\Services\EmployeeService;
use Modules\Employee\Support\Uuid;
use Modules\Authentication\Support\Request;

class EmployeeController
{
    private EmployeeService $service;
    public function __construct() { $this->service = new EmployeeService(new EmployeeRepository()); }
    private function authorize(): ?array { $auth=RoleMiddleware::handle(['ADMIN','HR']); return isset($auth['error']) ? ['success'=>false,'message'=>$auth['error'],'status'=>$auth['status']] : null; }
    public function index(array $params): array { return $this->authorize() ?? $this->service->list(); }
    public function options(array $params): array { return $this->authorize() ?? $this->service->options(); }
    public function show(array $params): array { return $this->authorize() ?? $this->service->show($params['id']); }
    public function store(array $params): array { return $this->authorize() ?? $this->service->create(Request::all()); }
    public function update(array $params): array { return $this->authorize() ?? $this->service->update($params['id'], Request::all()); }
    public function destroy(array $params): array { return $this->authorize() ?? $this->service->delete($params['id']); }

    public function uploadDocument(array $params): array
    {
        if ($denied = $this->authorize()) return $denied;
        $employee = (new EmployeeRepository())->find($params['id']);
        if (!$employee) return ['success'=>false, 'message'=>'Employee not found.', 'status'=>404];
        $file = $_FILES['document'] ?? null;
        $type = trim((string) ($_POST['documentType'] ?? 'Document'));
        if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) return ['success'=>false, 'message'=>'Select a document to upload.', 'status'=>422];
        if ($file['size'] > (int) config('upload.max_size', 10485760)) return ['success'=>false, 'message'=>'Document must be 10 MB or smaller.', 'status'=>422];
        $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, ['pdf','jpg','jpeg','png'], true)) return ['success'=>false, 'message'=>'Only PDF, JPG, JPEG, and PNG documents are allowed.', 'status'=>422];
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        if (!in_array($mime, ['application/pdf','image/jpeg','image/png'], true)) return ['success'=>false, 'message'=>'The uploaded file content is not an allowed document type.', 'status'=>422];
        $directory = rtrim((string) config('upload.path'), '/\\') . '/employee-documents/' . $employee['employee_id'];
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) return ['success'=>false, 'message'=>'Unable to prepare document storage.', 'status'=>500];
        $stored = Uuid::generate() . '.' . $extension;
        if (!move_uploaded_file($file['tmp_name'], $directory . '/' . $stored)) return ['success'=>false, 'message'=>'Unable to store document.', 'status'=>500];
        $document = (new EmployeeRepository())->addDocument($employee['employee_id'], $type, basename((string) $file['name']), 'employee-documents/' . $employee['employee_id'] . '/' . $stored);
        return ['success'=>true, 'message'=>'Document uploaded.', 'document'=>['id'=>$document['document_id'], 'name'=>$document['document_name'], 'type'=>$document['document_type'], 'status'=>'Pending']];
    }

    public function downloadDocument(array $params): string|array
    {
        if ($denied = $this->authorize()) return $denied;
        $repository = new EmployeeRepository();
        $employee = $repository->find($params['id']);
        $document = $employee ? $repository->findDocument($employee['employee_id'], $params['documentId']) : null;
        if (!$document) return ['success'=>false, 'message'=>'Document not found.', 'status'=>404];
        $path = rtrim((string) config('upload.path'), '/\\') . '/' . ltrim($document['document_url'], '/\\');
        $storageRoot = realpath(rtrim((string) config('upload.path'), '/\\'));
        $realPath = realpath($path);
        if (!$storageRoot || !$realPath || !str_starts_with($realPath, $storageRoot . DIRECTORY_SEPARATOR)) return ['success'=>false, 'message'=>'Document file is unavailable.', 'status'=>404];
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($realPath) ?: 'application/octet-stream';
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($realPath));
        header('Content-Disposition: inline; filename="' . str_replace('"', '', $document['document_name']) . '"');
        return (string) file_get_contents($realPath);
    }
}
