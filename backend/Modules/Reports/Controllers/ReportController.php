<?php

namespace Modules\Reports\Controllers;

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
        return [
            'success' => true,
            'data' => $this->service->getAttendanceReports(
                $this->filters()
            ),
        ];
    }

    public function sales(array $params = []): array
    {
        return [
            'success' => true,
            'data' => $this->service->getSalesReports(
                $this->filters()
            ),
        ];
    }

    public function employees(array $params = []): array
    {
        return [
            'success' => true,
            'data' => $this->service->getEmployeeReports(
                $this->filters()
            ),
        ];
    }

    public function asm(array $params = []): array
{
    return [
        'success' => true,
        'data' => $this->service->getAsmReports(
            $this->filters()
        ),
    ];
}

    public function metrics(array $params = []): array
    {
        return [
            'success' => true,
            'data' => $this->service->getCompanyMetrics(
                $this->filters()
            ),
        ];
    }

    public function charts(array $params = []): array
{
    return [
        'success' => true,
        'data' => $this->service->getChartData(
            $this->filters()
        ),
    ];
}

    private function filters(): array
    {
        return [
            'date_from' => $_GET['date_from'] ?? null,
            'date_to' => $_GET['date_to'] ?? null,
            'employee_id' => $_GET['employee_id'] ?? null,
            'department_id' => $_GET['department_id'] ?? null,
            'territory_id' => $_GET['territory_id'] ?? null,
            'status' => $_GET['status'] ?? null,
            'search' => $_GET['search'] ?? null,
        ];
    }
}