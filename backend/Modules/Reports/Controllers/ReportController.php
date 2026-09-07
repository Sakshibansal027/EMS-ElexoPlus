<?php

namespace Modules\Reports\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Reports\Services\ReportService;

class ReportController
{
    private ReportService $service;

    public function __construct()
    {
        $this->service = new ReportService(
            new \Modules\Reports\Repositories\ReportRepository()
        );
    }

    public function attendance(array $params = []): array
    {
        if ($error = $this->authorize()) return $error;
        return [
            'success' => true,
            'data' => $this->service->getAttendanceReports(
                $this->filters()
            ),
        ];
    }

    public function sales(array $params = []): array
    {
        if ($error = $this->authorize()) return $error;
        return [
            'success' => true,
            'data' => $this->service->getSalesReports(
                $this->filters()
            ),
        ];
    }

    public function employees(array $params = []): array
    {
        if ($error = $this->authorize()) return $error;
        return [
            'success' => true,
            'data' => $this->service->getEmployeeReports(
                $this->filters()
            ),
        ];
    }

    public function asm(array $params = []): array
{
    $auth = AuthMiddleware::handle();
    if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];

    $role = strtoupper((string) ($auth['user']['role'] ?? ''));
    $filters = $this->filters();

    if (in_array($role, ['ADMIN', 'HR'], true)) {
        return ['success' => true, 'data' => $this->service->getAsmReports($filters)];
    }

    // ASM users can only view their own report — scope by employee_id.
    $employeeId = $this->service->employeeIdByEmail((string) ($auth['user']['email'] ?? ''));
    if (!$employeeId) return ['success' => false, 'message' => 'Authenticated user is not linked to an employee.', 'status' => 422];
    $filters['employee_id'] = $employeeId;

    return ['success' => true, 'data' => $this->service->getAsmReports($filters)];
}

    public function metrics(array $params = []): array
    {
        if ($error = $this->authorize(true)) return $error;
        return [
            'success' => true,
            'data' => $this->service->getCompanyMetrics(
                $this->filters()
            ),
        ];
    }

    public function charts(array $params = []): array
{
    if ($error = $this->authorize(true)) return $error;
    return [
        'success' => true,
        'data' => $this->service->getChartData(
            $this->filters()
        ),
    ];
}

    private function filters(): array
    {
        $filters = [
            'date_from' => $_GET['date_from'] ?? null,
            'date_to' => $_GET['date_to'] ?? null,
            'employee_id' => $_GET['employee_id'] ?? null,
            'department_id' => $_GET['department_id'] ?? null,
            'territory_id' => $_GET['territory_id'] ?? null,
            'status' => $_GET['status'] ?? null,
            'search' => $_GET['search'] ?? null,
        ];

        $auth = AuthMiddleware::handle();
        if (!isset($auth['error'])) {
            $role = strtoupper((string) ($auth['user']['role'] ?? ''));
            $isCompanyReader = in_array($role, ['ADMIN', 'HR'], true);
            if (!$isCompanyReader) {
                $employeeId = $this->service->employeeIdByEmail((string) ($auth['user']['email'] ?? ''));
                if ($employeeId) $filters['employee_id'] = $employeeId;
            }
        }

        return $filters;
    }

    private function authorize(bool $companyOnly = false): ?array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        $role = strtoupper((string) ($auth['user']['role'] ?? ''));
        $isCompanyReader = in_array($role, ['ADMIN', 'HR'], true);
        if ($companyOnly && !$isCompanyReader) return ['success' => false, 'message' => 'You do not have permission to view company-wide reports.', 'status' => 403];
        return null;
    }
}
