<?php

namespace Modules\Leave\Controllers;

use Core\Database;
use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Leave\Repositories\LeaveRequestRepository;
use Modules\Leave\Repositories\LeaveApprovalRepository;
use Modules\Leave\Repositories\LeavePolicyRepository;
use Modules\Leave\Repositories\EmployeeLeaveBalanceRepository;
use Modules\Leave\Repositories\CompanyHolidayRepository;
use Modules\Leave\Services\LeaveRequestService;
use Modules\Authentication\Support\Request;

class LeaveRequestController
{
    private LeaveRequestService $requestService;
    private LeaveApprovalRepository $approvals;

    public function __construct()
    {
        $this->approvals = new LeaveApprovalRepository();

        $this->requestService = new LeaveRequestService(
            new LeaveRequestRepository(),
            $this->approvals,
            new LeavePolicyRepository(),
            new EmployeeLeaveBalanceRepository(),
            new CompanyHolidayRepository()
        );
    }

    /**
     * GET /leave/requests
     * "My leave history" — every request the logged-in employee has
     * ever submitted.
     */
    public function index(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $employeeId = $auth['user']['employee_id'];
        $requests = (new LeaveRequestRepository())->findAllByEmployee($employeeId);

        return ['success' => true, 'requests' => $requests];
    }

    /**
     * GET /leave/requests/pending-approvals
     * The logged-in ASM/HR's "waiting on me" queue.
     */
    public function pendingApprovals(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $employeeId = $auth['user']['employee_id'];

        return ['success' => true, 'pending' => $this->approvals->findAllPendingForApprover($employeeId)];
    }

    /**
     * GET /leave/requests/calendar?from=2026-08-01&to=2026-08-31
     * Powers the team calendar — see LeaveRequest::allBetween for the
     * role-scoping caveat.
     */
    public function calendar(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $from = (string) Request::input('from', date('Y-m-01'));
        $to = (string) Request::input('to', date('Y-m-t'));

        $requests = (new LeaveRequestRepository())->findAllBetween($from, $to);
        $visibleEmployeeIds = $this->visibleEmployeeIds($auth['user']);
        $requests = array_values(array_filter($requests, static fn(array $request): bool => in_array($request['employee_id'], $visibleEmployeeIds, true)));

        return ['success' => true, 'requests' => $requests];
    }

    /**
     * GET /leave/requests/{id}
     */
    public function show(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $request = (new LeaveRequestRepository())->findById($params['id']);
        if (!$request) {
            return ['success' => false, 'message' => 'Leave request not found.', 'status' => 404];
        }

        if (!$this->canAccessRequest($auth['user'], $request)) {
            return ['success' => false, 'message' => 'You do not have permission to view this leave request.', 'status' => 403];
        }

        $trail = $this->approvals->findAllByRequest($params['id']);

        return ['success' => true, 'request' => $request, 'approval_trail' => $trail];
    }

    /**
     * POST /leave/requests
     * Submits a new leave request for the logged-in employee.
     */
    public function store(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $employeeId = $auth['user']['employee_id'];
        $data = Request::all();
        $data['employee_id'] = $employeeId; // never trust a client-supplied employee_id

        $firstApprover = $this->resolveReportingManager($employeeId);
        if (!$firstApprover) {
            return ['success' => false, 'message' => 'No reporting manager configured for this employee.', 'status' => 422];
        }

        return $this->requestService->apply($data, $firstApprover, $this->resolveWorkingDays());
    }

    /**
     * POST /leave/requests/{id}/decision
     * Body: { "decision": "Approved"|"Rejected", "remarks": "...", "next_approver_employee_id": "..." }
     * next_approver_employee_id is only needed when approving at the
     * ASM stage (to hand off to HR) — see LeaveRequestService::processDecision.
     */
    public function decide(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $approvingEmployeeId = $auth['user']['employee_id'];
        $decision = (string) Request::input('decision', '');
        $remarks = Request::input('remarks', null);
        // Approval routing is server-owned. Never accept an approver id from
        // the browser: an ASM must not be able to route a request to an
        // arbitrary account. The service still verifies the current approver.
        $nextApprover = $decision === 'Approved' ? $this->resolveDefaultHrApprover() : null;

        return $this->requestService->processDecision(
            $params['id'],
            $approvingEmployeeId,
            $decision,
            $this->resolveWorkingDays(),
            $remarks,
            $nextApprover
        );
    }

    /**
     * POST /leave/requests/{id}/cancel
     */
    public function cancel(array $params): array
    {
        $auth = AuthMiddleware::handle();
        if (isset($auth['error'])) {
            return ['success' => false, 'message' => $auth['error'], 'status' => $auth['status']];
        }

        $employeeId = $auth['user']['employee_id'];

        return $this->requestService->cancel($params['id'], $employeeId, $this->resolveWorkingDays());
    }

    /**
     * Looks up an employee's ASM via employees.reporting_manager_id.
     *
     * STOP-GAP: this queries the Employee module's table directly
     * with raw SQL instead of going through a proper Employee
     * Repository/Service, because Leave module doesn't have visibility
     * into how the Employee module's own Models are structured (we've
     * only seen its migrations, not its PHP classes). Once Employee
     * module exposes something like EmployeeRepository::findById(),
     * this should call that instead — guessing at its API here would
     * risk being wrong. Flagging clearly rather than leaving this
     * silent.
     */
    private function resolveReportingManager(string $employeeId): ?string
    {
        $stmt = Database::connection()->prepare(
            'SELECT reporting_manager_id FROM employees WHERE employee_id = ?'
        );
        $stmt->execute([$employeeId]);
        $row = $stmt->fetch();

        $managerId = $row['reporting_manager_id'] ?? null;
        if ($managerId && $this->isActiveApproverAccount($managerId, 'ASM')) return $managerId;

        // Demo data can contain an old employee-manager reference with no
        // corresponding active login. Route to a real ASM account instead of
        // creating an approval that nobody can ever action.
        $stmt = Database::connection()->prepare(
            "SELECT u.employee_id FROM users u INNER JOIN employees e ON e.employee_id = u.employee_id AND e.email = u.email WHERE u.role = 'ASM' AND u.employee_id IS NOT NULL AND u.status IN ('Active', 'System Live') LIMIT 1"
        );
        $stmt->execute();
        return $stmt->fetchColumn() ?: null;
    }

    /**
     * Reads the working-days list from Settings' company_settings
     * table. Same stop-gap reasoning as resolveReportingManager()
     * above — direct query until Settings module exposes a proper
     * Repository call for Leave (or any module) to use.
     */
    private function resolveWorkingDays(): array
    {
        try {
            $stmt = Database::connection()->prepare('SELECT working_days FROM company_settings LIMIT 1');
            $stmt->execute();
            $row = $stmt->fetch();
            $days = $row ? json_decode($row['working_days'], true) : null;
            if (is_array($days) && $days) return $days;
        } catch (\Throwable) {
            // Settings module may not be migrated yet in a local demo setup.
        }

        return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    }

    private function resolveDefaultHrApprover(): ?string
    {
        $stmt = Database::connection()->prepare(
            "SELECT u.employee_id FROM users u INNER JOIN employees e ON e.employee_id = u.employee_id AND e.email = u.email WHERE u.role = 'HR' AND u.employee_id IS NOT NULL AND u.status IN ('Active', 'System Live') LIMIT 1"
        );
        $stmt->execute();
        return $stmt->fetchColumn() ?: null;
    }

    /** @return string[] Employee IDs visible to this user in the calendar. */
    private function visibleEmployeeIds(array $user): array
    {
        $employeeId = (string) ($user['employee_id'] ?? '');
        if ($employeeId === '') return [];
        if ($this->isLeaveAdministrator($user)) return array_column(
            Database::connection()->query('SELECT employee_id FROM employees')->fetchAll(),
            'employee_id'
        );

        if (strtoupper((string) ($user['role'] ?? '')) !== 'ASM') return [$employeeId];

        $stmt = Database::connection()->prepare('SELECT employee_id FROM employees WHERE reporting_manager_id = ?');
        $stmt->execute([$employeeId]);
        return array_values(array_unique(array_merge([$employeeId], array_column($stmt->fetchAll(), 'employee_id'))));
    }

    private function canAccessRequest(array $user, array $request): bool
    {
        if ($this->isLeaveAdministrator($user)) return true;
        if (($user['employee_id'] ?? null) === $request['employee_id']) return true;

        $stmt = Database::connection()->prepare(
            'SELECT 1 FROM leave_approvals WHERE leave_request_id = ? AND approver_employee_id = ? LIMIT 1'
        );
        $stmt->execute([$request['leave_request_id'], $user['employee_id'] ?? '']);
        return (bool) $stmt->fetchColumn();
    }

    private function isLeaveAdministrator(array $user): bool
    {
        return in_array(strtoupper((string) ($user['role'] ?? '')), ['ADMIN', 'HR'], true);
    }

    private function isActiveApproverAccount(string $employeeId, string $role): bool
    {
        $stmt = Database::connection()->prepare(
            "SELECT 1 FROM users u INNER JOIN employees e ON e.employee_id = u.employee_id AND e.email = u.email WHERE u.employee_id = ? AND u.role = ? AND u.status IN ('Active', 'System Live') LIMIT 1"
        );
        $stmt->execute([$employeeId, $role]);
        return (bool) $stmt->fetchColumn();
    }
}
