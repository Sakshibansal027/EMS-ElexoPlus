<?php

namespace Modules\Employee\Controllers;

use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Employee\Repositories\EmployeeRepository;
use Modules\Employee\Services\EmployeeService;
use Modules\Authentication\Support\Request;

class EmployeeController
{
    private EmployeeService $service;
    public function __construct() { $this->service = new EmployeeService(new EmployeeRepository()); }
    private function authorize(): ?array { $auth=RoleMiddleware::handle(['ADMIN','HR']); return isset($auth['error']) ? ['success'=>false,'message'=>$auth['error'],'status'=>$auth['status']] : null; }
    public function index(array $params): array { return $this->authorize() ?? $this->service->list(); }
    public function options(array $params): array { return $this->authorize() ?? $this->service->options(); }
    public function show(array $params): array { return $this->authorize() ?? $this->service->show($params['id']); }
    public function store(array $params): array { return $this->authorize() ?? $this->service->create(Request::input()); }
    public function update(array $params): array { return $this->authorize() ?? $this->service->update($params['id'], Request::input()); }
    public function destroy(array $params): array { return $this->authorize() ?? $this->service->delete($params['id']); }
}
