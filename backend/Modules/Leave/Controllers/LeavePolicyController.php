<?php

namespace Modules\Leave\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Leave\Repositories\LeavePolicyRepository;
use Modules\Leave\Services\LeavePolicyService;
use Modules\Leave\Support\Request;

class LeavePolicyController
{
    private LeavePolicyService $policyService;

    public function __construct()
    {
        $this->policyService = new LeavePolicyService(new LeavePolicyRepository());
    }

    /**
     * GET /leave/policies
     * Employees browsing the "apply leave" dropdown only need Active
     * policies; admins managing policies pass ?all=1 to also see
     * Inactive ones. Either way, this only requires being logged in
     * — no role restriction on reading.
     */
    public function index(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $includeInactive = Request::input('all', '0') === '1';

        return $includeInactive
            ? $this->policyService->listAll()
            : $this->policyService->listActive();
    }

    /**
     * GET /leave/policies/{id}
     */
    public function show(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->policyService->getById($params['id']);
    }

    /**
     * POST /leave/policies
     * Admin/HR only, enforced by RoleMiddleware.
    */
    public function store(array $params): array
    {
        $auth = RoleMiddleware::handle(['Admin', 'HR']);
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $data = Request::input();

        return $this->policyService->create($data);
    }

    /**
     * PUT /leave/policies/{id}
     * Admin/HR only, enforced by RoleMiddleware.
    */
    public function update(array $params): array
    {
        $auth = RoleMiddleware::handle(['Admin', 'HR']);
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $data = Request::input();

        return $this->policyService->update($params['id'], $data);
    }

    /**
     * DELETE /leave/policies/{id}
     * Admin/HR only, enforced by RoleMiddleware. (Actually
     * deactivates rather than hard-deleting — see
     * LeavePolicyService::deactivate.)
    */
    public function destroy(array $params): array
    {
        $auth = RoleMiddleware::handle(['Admin', 'HR']);
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->policyService->deactivate($params['id']);
    }
}