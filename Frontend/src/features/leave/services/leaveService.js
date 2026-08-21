import {
    LeaveApplicationsData,
    LeaveCardsData,
    initialLeavePolicies,
    teamLeaveCalendarEvents,
    companyHolidaysData,
} from "../mock/leaveData.js";

import {
    leaveBalanceData,
    leaveHistory,
    summaryCards,
} from "../mock/employeeLeaveData.js";
import client from "../../../api/client.js";
import { CalendarCheck, ClipboardList, Tags } from "lucide-react";

const USE_MOCK_LEAVE_DATA = false;

import { ROLES } from "../config/roles.js";
import { getTodayInputValue } from "../shared/utils/date.js";

let leavePoliciesStore = [...initialLeavePolicies];
let calendarEventsStore = [...teamLeaveCalendarEvents];
let holidaysStore = [...companyHolidaysData];

// Mutable stores so newly submitted/updated leaves actually persist and
// flow back through the dashboard instead of only living in the static
// mock arrays.
let applicationsStore = [...LeaveApplicationsData];
let leaveHistoryStore = [...leaveHistory];

// Map of employeeId -> the ASM (manager) who should see that employee's
// requests. Mirrors reportingManager in the calendar mock. In a real
// backend this would come from the org chart / employee record.
const EMPLOYEE_TO_ASM = {
    EMP001: "EMP005",
    EMP003: "EMP005",
    EMP004: "EMP005",
    EMP007: "EMP005",
};


// ===========================
// Leave Applications
// ===========================

const roleScopedApplications = {
    [ROLES.ADMIN]: () =>
        applicationsStore,

    [ROLES.HR]: () =>
        applicationsStore.filter(
            leave => leave.designation !== "Admin"
        ),

    [ROLES.ASM]: ({ userId }) =>
        applicationsStore.filter(
            leave => leave.asmId === userId
        ),

    [ROLES.SALES_EXECUTIVE]: ({ userId }) =>
        applicationsStore.filter(
            leave => leave.employeeId === userId
        ),
};

export const getLeavesByRole = async ({ role, userId }) => {
    const resolver =
        roleScopedApplications[role] ??
        roleScopedApplications[ROLES.SALES_EXECUTIVE];

    return resolver({ userId });
};



// ===========================
// Calendar
// ===========================

export const getTeamLeaveCalendar = async ({ role, userId }) => {

    switch (role) {

        case ROLES.ADMIN:
        case ROLES.HR:
            return {
                events: calendarEventsStore,
                holidays: holidaysStore,
            };

        case ROLES.ASM:
            return {
                // calendar events store the manager on `reportingManager`,
                // not `asmId` — match on the field that actually exists.
                events: calendarEventsStore.filter(
                    event => event.reportingManager === userId
                ),
                holidays: holidaysStore,
            };

        case ROLES.SALES_EXECUTIVE:
            return {
                events: calendarEventsStore.filter(
                    event => event.teamId === userId ||
                             event.employeeId === userId
                ),
                holidays: holidaysStore,
            };

        default:
            return {
                events: [],
                holidays: [],
            };
    }
};



// ===========================
// Dashboard
// ===========================

export const getLeaveDashboard = async ({ role, userId }) => {
    const year = new Date().getFullYear();
    const [requestsResponse, balancesResponse, policiesResponse, holidaysResponse] = await Promise.all([
        client.get("/leave/requests"),
        client.get(`/leave/balances?year=${year}`),
        client.get("/leave/policies"),
        client.get(`/leave/holidays?year=${year}`),
    ]);
    const policies = policiesResponse.data.policies || [];
    const policyById = Object.fromEntries(policies.map((policy) => [policy.leave_policy_id, policy]));
    const history = (requestsResponse.data.requests || []).map((request) => ({
        id: request.leave_request_id,
        employeeId: request.employee_code || "",
        leaveType: policyById[request.leave_policy_id]?.leave_policy_code || "Leave",
        fromDate: request.start_date,
        toDate: request.end_date,
        date: request.applied_at,
        duration: request.day_type === "Full Day" ? "Full Day" : "0.5 Day",
        dayType: request.day_type,
        reason: request.reason,
        status: request.status,
    }));
    const balances = (balancesResponse.data.balances || []).map((balance) => ({
        title: policyById[balance.leave_policy_id]?.leave_policy_name || "Leave",
        available: Number(balance.remaining_days),
        total: Number(balance.allocated_days),
        color: "bg-primary",
    }));

    if (!USE_MOCK_LEAVE_DATA) return {
        managementCards: [
            {
                icon: ClipboardList,
                title: "Pending Requests",
                value: history.filter((item) => item.status === "Pending").length,
                description: "Awaiting action",
            },
            {
                icon: CalendarCheck,
                title: "Approved Requests",
                value: history.filter((item) => item.status === "Approved").length,
                description: "Processed requests",
            },
            {
                icon: Tags,
                title: "Leave Types",
                value: policies.length,
                description: "Active leave policies",
            },
        ],
        summaryCards,
        leaveBalanceData: balances,
        leavePolicies: policies,
        teamLeaves: history,
        leaveHistory: history,
        calendarData: { events: history, holidays: holidaysResponse.data.holidays || [] },
    };

    return {

        managementCards: LeaveCardsData,

        summaryCards,

        leaveBalanceData,

        leavePolicies: leavePoliciesStore,

        teamLeaves: await getLeavesByRole({
            role,
            userId,
        }),

        // "My Leave History" should always be scoped to the logged-in
        // employee, regardless of role — not just Sales Executives.
        // Previously Admin/HR/ASM would see Sneha Gupta's (EMP004) full
        // history unfiltered whenever this section was shown to them.
        leaveHistory: leaveHistoryStore.filter(
            history => history.employeeId === userId
        ),

        calendarData: await getTeamLeaveCalendar({
            role,
            userId,
        }),
    };
};



// ===========================
// Leave APIs
// ===========================

const formatDisplayDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getDurationLabel = (fromDate, toDate, dayType) => {
    if (dayType === "Half Day") return "0.5 Day";
    if (!fromDate || !toDate) return "1 Day";

    const days =
        Math.round(
            (new Date(toDate) - new Date(fromDate)) /
                (1000 * 60 * 60 * 24)
        ) + 1;

    return `${days} Day${days > 1 ? "s" : ""}`;
};

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .map(part => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

// Pushes a newly submitted application into BOTH the employee's own
// "My Leave History" list and the reviewers' "Leave Applications" list,
// so it actually shows up in the UI instead of vanishing after submit.
export const submitLeaveApplication = async ({
    leaveType,
    dayType,
    fromDate,
    toDate,
    reason,
    emergencyContact,
    document,
    employee,
}) => {
    const { data: policiesData } = await client.get("/leave/policies");
    const policy = (policiesData.policies || []).find(
        (item) => item.leave_policy_code === (leaveType?.value ?? leaveType?.label),
    );
    if (!policy) throw new Error("Selected leave policy is not available.");

    const { data } = await client.post("/leave/requests", {
        leave_policy_id: policy.leave_policy_id,
        start_date: fromDate,
        end_date: toDate,
        day_type: dayType,
        reason,
        emergency_contact: emergencyContact,
        has_document: Boolean(document),
    });
    if (!data.success) throw new Error(data.message || "Unable to submit leave request.");
    if (!USE_MOCK_LEAVE_DATA) return { success: true, data: data.request };

    /* Legacy mock code below is intentionally unreachable. */
    if (USE_MOCK_LEAVE_DATA) {
    const employeeId =
        employee?.employeeId ?? employee?.id ?? "EMP000";
    const employeeName = employee?.name ?? "Unknown Employee";
    const designation =
        employee?.designation ?? employee?.role ?? "Employee";

    const duration = getDurationLabel(fromDate, toDate, dayType);
    const id = Date.now();

    const historyEntry = {
        id,
        employeeId,
        date: fromDate,
        leaveType: leaveType?.label ?? leaveType?.value ?? "",
        fromDate,
        toDate,
        duration,
        dayType,
        reason,
        emergencyContact,
        phone: emergencyContact,
        document: document?.name ?? "Not Attached",
        status: "Pending",
    };

    const applicationEntry = {
        id,
        employeeName,
        employeeId,
        asmId: EMPLOYEE_TO_ASM[employeeId],
        designation,
        initials: getInitials(employeeName),
        leaveType: leaveType?.value ?? "",
        fromDate: formatDisplayDate(fromDate),
        toDate: formatDisplayDate(toDate),
        duration,
        reason,
        appliedOn: formatDisplayDate(getTodayInputValue()),
        approvedBy: "—",
        approverRole: "Pending Review",
        status: "Pending",
        dayType,
    };

    leaveHistoryStore = [historyEntry, ...leaveHistoryStore];
    applicationsStore = [applicationEntry, ...applicationsStore];

    return { success: true, data: historyEntry };
    }
};

export const updateLeaveApplicationStatus = async (
    leaveId,
    status
) => {
    const decision = status === "Approved" ? "Approved" : "Rejected";
    const { data } = await client.post(`/leave/requests/${leaveId}/decision`, { decision });
    if (!data.success) throw new Error(data.message || "Unable to update leave request.");
    if (!USE_MOCK_LEAVE_DATA) return { leaveId, status };

    /* Mock path retained for isolated UI demonstrations. */
    applicationsStore = applicationsStore.map(leave =>
        leave.id === leaveId ? { ...leave, status } : leave
    );

    leaveHistoryStore = leaveHistoryStore.map(leave =>
        leave.id === leaveId ? { ...leave, status } : leave
    );

    return { leaveId, status };
};

export const cancelLeaveApplication = async leaveId => {
    const { data } = await client.post(`/leave/requests/${leaveId}/cancel`);
    if (!data.success) throw new Error(data.message || "Unable to cancel leave request.");
    if (!USE_MOCK_LEAVE_DATA) return leaveId;

    /* Legacy mock code below is intentionally unreachable. */
    if (USE_MOCK_LEAVE_DATA) {
    leaveHistoryStore = leaveHistoryStore.filter(
        leave => leave.id !== leaveId
    );

    applicationsStore = applicationsStore.filter(
        leave => leave.id !== leaveId
    );

    return leaveId;
    }
};




// ===========================
// Leave Policy APIs
// ===========================

export const getLeavePolicies = async () => {
    const { data } = await client.get("/leave/policies?all=1");
    return (data.policies || []).map((policy) => ({
        id: policy.leave_policy_id,
        leaveTypeName: policy.leave_policy_name,
        leaveTypeCode: policy.leave_policy_code,
        annualQuota: Number(policy.annual_quota),
        accrualFrequency: policy.accrual_frequency,
        accrualMethod: policy.accrual_method,
        carryForwardAllowed: Boolean(policy.carry_forward_allowed),
        maxCarryForwardDays: Number(policy.max_carry_forward_days),
        description: policy.description || "",
    }));
};

export const updateLeavePolicy = async updatedPolicy => {
    const { id, leaveTypeName, leaveTypeCode, annualQuota, accrualFrequency, accrualMethod, carryForwardAllowed, maxCarryForwardDays, description } = updatedPolicy;
    const { data } = await client.put(`/leave/policies/${id}`, {
        leave_policy_name: leaveTypeName,
        leave_policy_code: leaveTypeCode,
        annual_quota: annualQuota,
        accrual_frequency: accrualFrequency,
        accrual_method: accrualMethod,
        carry_forward_allowed: carryForwardAllowed,
        max_carry_forward_days: maxCarryForwardDays,
        description,
    });
    if (!data.success) throw new Error(data.message || "Unable to update policy.");
    if (!USE_MOCK_LEAVE_DATA) return data.policy;

    if (USE_MOCK_LEAVE_DATA) {
    leavePoliciesStore = leavePoliciesStore.map(policy =>
        policy.id === updatedPolicy.id
            ? {
                  ...policy,
                  ...updatedPolicy,
              }
            : policy
    );

    return {
        success: true,
        data: leavePoliciesStore,
    };
    }
};

export const createLeavePolicy = async newPolicy => {
    const { data } = await client.post("/leave/policies", {
        leave_policy_name: newPolicy.leaveTypeName,
        leave_policy_code: newPolicy.leaveTypeCode,
        annual_quota: newPolicy.annualQuota,
        accrual_frequency: newPolicy.accrualFrequency,
        accrual_method: newPolicy.accrualMethod,
        carry_forward_allowed: newPolicy.carryForwardAllowed,
        max_carry_forward_days: newPolicy.maxCarryForwardDays,
        description: newPolicy.description,
        allow_half_day: true,
        requires_document: false,
        is_paid: true,
    });
    if (!data.success) throw new Error(data.message || "Unable to create policy.");
    if (!USE_MOCK_LEAVE_DATA) return data.policy;

    if (USE_MOCK_LEAVE_DATA) {
    leavePoliciesStore.push({
        ...newPolicy,
        id: `pol_${Date.now()}`,
    });

    return {
        success: true,
        data: leavePoliciesStore,
    };
    }
};

export const deleteLeavePolicy = async policyId => {
    const { data } = await client.delete(`/leave/policies/${policyId}`);
    if (!data.success) throw new Error(data.message || "Unable to delete policy.");
    if (!USE_MOCK_LEAVE_DATA) return policyId;

    if (USE_MOCK_LEAVE_DATA) {
    leavePoliciesStore =
        leavePoliciesStore.filter(
            policy => policy.id !== policyId
        );

    return {
        success: true,
        data: leavePoliciesStore,
    };
    }
};
