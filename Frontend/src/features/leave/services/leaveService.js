import { BadgeCheck, CalendarCheck, ClipboardList, Clock3, Tags, XCircle } from "lucide-react";
import client from "../../../api/client.js";

const asBoolean = (value) => value === true || value === 1 || value === "1";

const mapPolicy = (policy) => ({
    id: policy.leave_policy_id,
    leaveTypeName: policy.leave_policy_name,
    leaveTypeCode: policy.leave_policy_code,
    annualQuota: Number(policy.annual_quota),
    accrualFrequency: policy.accrual_frequency,
    accrualMethod: policy.accrual_method,
    carryForwardAllowed: asBoolean(policy.carry_forward_allowed),
    maxCarryForwardDays: Number(policy.max_carry_forward_days),
    allowHalfDay: asBoolean(policy.allow_half_day),
    requiresDocument: asBoolean(policy.requires_document),
    isPaid: asBoolean(policy.is_paid),
    description: policy.description || "",
    status: policy.status,
});

const requestToHistory = (request, policies) => ({
    id: request.leave_request_id,
    leaveType: policies[request.leave_policy_id]?.leaveTypeCode || "Leave",
    fromDate: request.start_date,
    toDate: request.end_date,
    date: request.applied_at,
    duration: request.day_type === "Full Day" ? "Full Day" : "0.5 Day",
    dayType: request.day_type,
    reason: request.reason,
    emergencyContact: request.emergency_contact,
    status: request.status,
    document: "Not Attached",
});

export const getLeaveDashboard = async () => {
    const year = new Date().getFullYear();
    const [requestsResponse, balancesResponse, policiesResponse, holidaysResponse, pendingResponse, calendarResponse] = await Promise.all([
        client.get("/leave/requests"), client.get(`/leave/balances?year=${year}`), client.get("/leave/policies"),
        client.get(`/leave/holidays?year=${year}`), client.get("/leave/requests/pending-approvals"),
        client.get(`/leave/requests/calendar?from=${year}-01-01&to=${year}-12-31`),
    ]);
    const policies = (policiesResponse.data.policies || []).map(mapPolicy);
    const policyById = Object.fromEntries(policies.map((policy) => [policy.id, policy]));
    const history = (requestsResponse.data.requests || []).map((request) => requestToHistory(request, policyById));
    const balances = (balancesResponse.data.balances || []).map((balance) => ({ title: policyById[balance.leave_policy_id]?.leaveTypeName || "Leave", available: Number(balance.remaining_days), total: Number(balance.allocated_days), color: "bg-primary" }));
    const teamLeaves = (pendingResponse.data.pending || []).map((approval) => ({
        id: approval.leave_request_id, employeeName: approval.employee_name, employeeId: approval.employee_code,
        designation: approval.designation_name || "Employee", initials: (approval.employee_name || "?").split(" ").map((part) => part[0]).join("").slice(0, 2),
        leaveType: approval.leave_policy_code, fromDate: approval.start_date, toDate: approval.end_date,
        duration: approval.day_type === "Full Day" ? "Full Day" : "0.5 Day", reason: approval.reason,
        appliedOn: approval.applied_at, approvedBy: "Pending your decision", approverRole: approval.approval_level,
        status: approval.request_status, dayType: approval.day_type,
    }));
    return {
        managementCards: [
            { icon: ClipboardList, title: "Waiting on You", value: teamLeaves.length, description: "Approval queue" },
            { icon: CalendarCheck, title: "Approved Requests", value: history.filter((item) => item.status === "Approved").length, description: "Your approved requests" },
            { icon: Tags, title: "Leave Types", value: policies.length, description: "Active leave policies" },
        ],
        summaryCards: [
            { title: "Available Leaves", value: balances.reduce((total, item) => total + item.available, 0), description: "Total remaining leaves", icon: CalendarCheck },
            { title: "Pending Requests", value: history.filter((item) => ["Pending", "Under Review"].includes(item.status)).length, description: "Your open requests", icon: Clock3 },
            { title: "Approved This Year", value: history.filter((item) => item.status === "Approved").length, description: "Your approved requests", icon: BadgeCheck },
            { title: "Rejected", value: history.filter((item) => item.status === "Rejected").length, description: "Your rejected requests", icon: XCircle },
        ],
        leaveBalanceData: balances, leavePolicies: policies, teamLeaves, leaveHistory: history,
        calendarData: {
            events: (calendarResponse.data.requests || []).map((request) => ({ id: request.leave_request_id, employeeName: request.employee_name || request.employee_code || "Employee", leaveType: request.leave_policy_code || "Leave", startDate: request.start_date, endDate: request.end_date, status: request.status })),
            holidays: (holidaysResponse.data.holidays || []).map((holiday) => ({ id: holiday.holiday_id, title: holiday.title, date: holiday.holiday_date })),
        },
    };
};

export const submitLeaveApplication = async ({ leaveType, dayType, fromDate, toDate, reason, emergencyContact, document }) => {
    if (!leaveType?.id) throw new Error("Select a valid leave policy.");
    const { data } = await client.post("/leave/requests", { leave_policy_id: leaveType.id, start_date: fromDate, end_date: toDate, day_type: dayType, reason, emergency_contact: emergencyContact, has_document: Boolean(document) });
    if (!data.success) throw new Error(data.message || "Unable to submit leave request.");
    if (document) {
        const form = new FormData(); form.append("document", document); form.append("document_type", "Supporting Document");
        try {
            const upload = await client.post(`/leave/requests/${data.request.leave_request_id}/documents`, form, { headers: { "Content-Type": "multipart/form-data" } });
            if (!upload.data?.success) throw new Error(upload.data?.message || "Supporting document could not be uploaded.");
        } catch (error) {
            await client.post(`/leave/requests/${data.request.leave_request_id}/cancel`);
            throw error;
        }
    }
    return data.request;
};

export const updateLeaveApplicationStatus = async (leaveId, status) => {
    const { data } = await client.post(`/leave/requests/${leaveId}/decision`, { decision: status === "Approved" ? "Approved" : "Rejected" });
    if (!data.success) throw new Error(data.message || "Unable to update leave request.");
    return data;
};

export const cancelLeaveApplication = async (leaveId) => {
    const { data } = await client.post(`/leave/requests/${leaveId}/cancel`);
    if (!data.success) throw new Error(data.message || "Unable to cancel leave request.");
    return data;
};

export const getLeaveRequestDocuments = async (leaveId) => {
    const { data } = await client.get(`/leave/requests/${leaveId}/documents`);
    if (!data.success) throw new Error(data.message || "Unable to load leave documents.");
    return (data.documents || []).map((document) => ({ id: document.document_id, name: document.file_name, type: document.document_type }));
};

export const openLeaveDocument = async (documentId) => {
    const response = await client.get(`/leave/documents/${documentId}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

export const getLeavePolicies = async () => {
    const { data } = await client.get("/leave/policies?all=1");
    return (data.policies || []).map(mapPolicy);
};

const policyPayload = (policy) => ({
    leave_policy_name: policy.leaveTypeName.trim(), leave_policy_code: policy.leaveTypeCode.trim().toUpperCase(), annual_quota: Number(policy.annualQuota),
    accrual_frequency: policy.accrualFrequency, accrual_method: policy.accrualMethod, carry_forward_allowed: Boolean(policy.carryForwardAllowed),
    max_carry_forward_days: policy.carryForwardAllowed ? Number(policy.maxCarryForwardDays) : 0, allow_half_day: Boolean(policy.allowHalfDay),
    requires_document: Boolean(policy.requiresDocument), is_paid: Boolean(policy.isPaid), description: policy.description?.trim() || null,
});

export const updateLeavePolicy = async (policy) => {
    const { data } = await client.put(`/leave/policies/${policy.id}`, policyPayload(policy));
    if (!data.success) throw new Error(data.message || "Unable to update policy.");
    return mapPolicy(data.policy);
};

export const createLeavePolicy = async (policy) => {
    const { data } = await client.post("/leave/policies", policyPayload(policy));
    if (!data.success) throw new Error(data.message || "Unable to create policy.");
    return mapPolicy(data.policy);
};

export const deleteLeavePolicy = async (policyId) => {
    const { data } = await client.delete(`/leave/policies/${policyId}`);
    if (!data.success) throw new Error(data.message || "Unable to deactivate policy.");
    return data;
};
