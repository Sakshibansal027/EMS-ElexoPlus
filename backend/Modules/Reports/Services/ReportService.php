<?php

namespace Modules\Reports\Services;

use Modules\Reports\Repositories\ReportRepository;

class ReportService
{
    public function __construct(
        private ReportRepository $repository
    ) {
    }

    public function getAttendanceReports(array $filters = []): array
    {
        return $this->repository->getAttendanceReports($filters);
    }

    public function getSalesReports(array $filters = []): array
    {
        return $this->repository->getSalesReports($filters);
    }

    public function getEmployeeReports(array $filters = []): array
    {
        return $this->repository->getEmployeeReports($filters);
    }

    public function getAsmReports(array $filters = []): array
{
    return $this->repository->getAsmReports($filters);
}

    public function getCompanyMetrics(array $filters = []): array
    {
        return $this->repository->getCompanyMetrics($filters);
    }

    public function getChartData(array $filters = []): array
{
    return $this->repository->getChartData($filters);
}

    public function employeeIdByEmail(string $email): ?string
    {
        return $this->repository->employeeIdByEmail($email);
    }
}
