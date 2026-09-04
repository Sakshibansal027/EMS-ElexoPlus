<?php

namespace Modules\Settings\Controllers;

use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Authentication\Support\Request;
use Modules\Settings\Repositories\CompanySettingsRepository;
use Modules\Settings\Repositories\DepartmentRepository;
use Modules\Settings\Repositories\DesignationRepository;
use Modules\Settings\Repositories\EmploymentTypeRepository;
use Modules\Settings\Repositories\EmployeeStatusRepository;
use Modules\Settings\Repositories\UserPreferenceRepository;
use Modules\Settings\Services\CompanySettingsService;
use Modules\Settings\Services\DepartmentService;
use Modules\Settings\Services\DesignationService;
use Modules\Settings\Services\EmploymentTypeService;
use Modules\Settings\Services\EmployeeStatusService;
use Modules\Settings\Services\UserPreferenceService;

class SettingsController
{
    private CompanySettingsService $companyService;
    private DepartmentService $departmentService;
    private DesignationService $designationService;
    private EmploymentTypeService $employmentTypeService;
    private EmployeeStatusService $employeeStatusService;
    private UserPreferenceService $userPreferenceService;

    public function __construct()
    {
        $this->companyService = new CompanySettingsService(new CompanySettingsRepository());
        $this->departmentService = new DepartmentService(new DepartmentRepository());
        $this->designationService = new DesignationService(new DesignationRepository());
        $this->employmentTypeService = new EmploymentTypeService(new EmploymentTypeRepository());
        $this->employeeStatusService = new EmployeeStatusService(new EmployeeStatusRepository());
        $this->userPreferenceService = new UserPreferenceService(new UserPreferenceRepository());
    }

    // ─── Company Settings ─────────────────────────────────────────

    public function getCompanySettings(array $params): array
    {
        if ($denied = $this->adminOnly()) return $denied;
        return $this->companyService->get();
    }

    public function updateCompanySettings(array $params): array
    {
        if ($denied = $this->adminOnly()) return $denied;
        return $this->companyService->update(Request::all());
    }

    // ─── Departments ──────────────────────────────────────────────

    public function listDepartments(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->departmentService->list();
    }

    public function createDepartment(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->departmentService->create(Request::all());
    }

    public function updateDepartment(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->departmentService->update($params['id'], Request::all());
    }

    public function deleteDepartment(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->departmentService->delete($params['id']);
    }

    // ─── Designations ─────────────────────────────────────────────

    public function listDesignations(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->designationService->list();
    }

    public function createDesignation(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->designationService->create(Request::all());
    }

    public function updateDesignation(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->designationService->update($params['id'], Request::all());
    }

    public function deleteDesignation(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->designationService->delete($params['id']);
    }

    // ─── Employment Types ─────────────────────────────────────────

    public function listEmploymentTypes(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->employmentTypeService->list();
    }

    public function createEmploymentType(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->employmentTypeService->create(Request::all());
    }

    public function updateEmploymentType(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->employmentTypeService->update($params['id'], Request::all());
    }

    public function deleteEmploymentType(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->employmentTypeService->delete($params['id']);
    }

    // ─── Employee Statuses ────────────────────────────────────────

    public function listEmployeeStatuses(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->employeeStatusService->list();
    }

    public function createEmployeeStatus(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->employeeStatusService->create(Request::all());
    }

    public function updateEmployeeStatus(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->employeeStatusService->update($params['id'], Request::all());
    }

    public function deleteEmployeeStatus(array $params): array
    {
        if ($denied = $this->settingsAllowed()) return $denied;
        return $this->employeeStatusService->delete($params['id']);
    }

    // ─── User Preferences ─────────────────────────────────────────

    public function getPreferences(array $params): array
    {
        $auth = RoleMiddleware::handle([]);
        if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        $userId = $auth['user']['user_id'] ?? $auth['user']['id'];
        return $this->userPreferenceService->get((string) $userId);
    }

    public function updatePreferences(array $params): array
    {
        $auth = RoleMiddleware::handle([]);
        if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        $userId = $auth['user']['user_id'] ?? $auth['user']['id'];
        return $this->userPreferenceService->update((string) $userId, Request::all());
    }

    // ─── Authorization Helpers ────────────────────────────────────

    private function adminOnly(): ?array
    {
        $auth = RoleMiddleware::handle(['ADMIN']);
        return isset($auth['error']) ? ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']] : null;
    }

    private function settingsAllowed(): ?array
    {
        $auth = RoleMiddleware::handle(['ADMIN', 'HR']);
        return isset($auth['error']) ? ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']] : null;
    }
}
