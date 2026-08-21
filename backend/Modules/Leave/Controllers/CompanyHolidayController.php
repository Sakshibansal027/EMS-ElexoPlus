<?php

namespace Modules\Leave\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Leave\Repositories\CompanyHolidayRepository;
use Modules\Leave\Services\CompanyHolidayService;
use Modules\Leave\Support\Request;

class CompanyHolidayController
{
    private CompanyHolidayService $holidayService;

    public function __construct()
    {
        $this->holidayService = new CompanyHolidayService(new CompanyHolidayRepository());
    }

    /**
     * GET /leave/holidays?year=2026&location=Delhi
     * Just needs login — every employee can view the holiday calendar.
     */
    public function index(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $year = (int) Request::input('year', date('Y'));
        $location = Request::input('location', null);

        return $this->holidayService->listForYear($year, $location);
    }

    /**
     * GET /leave/holidays/{id}
     */
    public function show(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->holidayService->getById($params['id']);
    }

    /**
     * POST /leave/holidays
     * Admin/HR only, enforced by RoleMiddleware.
     */
    public function store(array $params): array
    {
        $auth = RoleMiddleware::handle(['Admin', 'HR']);
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->holidayService->create(Request::input());
    }

    /**
     * PUT /leave/holidays/{id}
     */
    public function update(array $params): array
    {
        $auth = RoleMiddleware::handle(['Admin', 'HR']);
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->holidayService->update($params['id'], Request::input());
    }

    /**
     * DELETE /leave/holidays/{id}
     */
    public function destroy(array $params): array
    {
        $auth = RoleMiddleware::handle(['Admin', 'HR']);
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        return $this->holidayService->delete($params['id']);
    }
}