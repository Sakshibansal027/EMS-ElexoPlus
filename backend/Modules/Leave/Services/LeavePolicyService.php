<?php

namespace Modules\Leave\Services;

use Modules\Leave\Repositories\LeavePolicyRepository;

class LeavePolicyService
{
    public function __construct(
        private LeavePolicyRepository $policies
    ) {
    }

    /**
     * For screens where an employee is choosing a policy to apply
     * leave against (e.g. a dropdown) — only Active ones should be
     * selectable.
     */
    public function listActive(): array
    {
        return ['success' => true, 'policies' => $this->policies->all(true)];
    }

    /**
     * For the admin policy-management screen — Inactive ones need
     * to stay visible too, so they can be edited or reactivated.
     */
    public function listAll(): array
    {
        return ['success' => true, 'policies' => $this->policies->all(false)];
    }

    public function getById(string $id): array
    {
        $policy = $this->policies->findById($id);

        if (!$policy) {
            return ['success' => false, 'message' => 'Leave policy not found.', 'status' => 404];
        }

        return ['success' => true, 'policy' => $policy];
    }

    /**
     * Creating a policy has real rules behind it — this is the
     * kind of thing that belongs in a Service, not the Model:
     *  - the code (e.g. "SL") must be unique, since employees and
     *    reports will refer to policies by code
     *  - if carry_forward is off, max_carry_forward_days must be 0
     *    (doesn't make sense to allow carrying forward 5 days of a
     *    policy that doesn't allow carry-forward at all)
     *  - you can't carry forward more days than the annual quota
     */
    public function create(array $data): array
    {
        if (empty($data['leave_policy_code']) || empty($data['leave_policy_name'])) {
            return ['success' => false, 'message' => 'Policy code and name are required.', 'status' => 422];
        }

        if ($this->policies->findByCode($data['leave_policy_code'])) {
            return ['success' => false, 'message' => 'A policy with this code already exists.', 'status' => 409];
        }

        $carryForwardAllowed = $data['carry_forward_allowed'] ?? false;
        $maxCarryForward = $data['max_carry_forward_days'] ?? 0;

        if (!$carryForwardAllowed && $maxCarryForward > 0) {
            return [
                'success' => false,
                'message' => 'max_carry_forward_days must be 0 when carry_forward_allowed is false.',
                'status' => 422,
            ];
        }

        if ($carryForwardAllowed && $maxCarryForward > ($data['annual_quota'] ?? 0)) {
            return [
                'success' => false,
                'message' => 'max_carry_forward_days cannot exceed the annual quota.',
                'status' => 422,
            ];
        }

        $policy = $this->policies->create($data);

        return ['success' => true, 'message' => 'Leave policy created.', 'policy' => $policy];
    }

    /**
     * Same carry-forward consistency rules apply on update. We
     * merge onto the existing row first so a partial update (e.g.
     * just flipping carry_forward_allowed off) is still checked
     * against the policy's actual current max_carry_forward_days,
     * not just whatever happens to be in this particular request.
     */
    public function update(string $id, array $data): array
    {
        $existing = $this->policies->findById($id);

        if (!$existing) {
            return ['success' => false, 'message' => 'Leave policy not found.', 'status' => 404];
        }

        if (!empty($data['leave_policy_code']) && $data['leave_policy_code'] !== $existing['leave_policy_code']) {
            $clash = $this->policies->findByCode($data['leave_policy_code']);
            if ($clash) {
                return ['success' => false, 'message' => 'A policy with this code already exists.', 'status' => 409];
            }
        }

        $merged = array_merge($existing, $data);

        if (!$merged['carry_forward_allowed'] && $merged['max_carry_forward_days'] > 0) {
            return [
                'success' => false,
                'message' => 'max_carry_forward_days must be 0 when carry_forward_allowed is false.',
                'status' => 422,
            ];
        }

        if ($merged['carry_forward_allowed'] && $merged['max_carry_forward_days'] > $merged['annual_quota']) {
            return [
                'success' => false,
                'message' => 'max_carry_forward_days cannot exceed the annual quota.',
                'status' => 422,
            ];
        }

        $policy = $this->policies->update($id, $data);

        return ['success' => true, 'message' => 'Leave policy updated.', 'policy' => $policy];
    }

    /**
     * "Delete" here means deactivate (see LeavePolicy::delete — it's
     * a soft delete under the hood). Exposed under a clearer name at
     * this layer since, from the caller's perspective, this isn't
     * really a destructive delete.
     */
    public function deactivate(string $id): array
    {
        $existing = $this->policies->findById($id);

        if (!$existing) {
            return ['success' => false, 'message' => 'Leave policy not found.', 'status' => 404];
        }

        $this->policies->delete($id);

        return ['success' => true, 'message' => 'Leave policy deactivated.'];
    }
}