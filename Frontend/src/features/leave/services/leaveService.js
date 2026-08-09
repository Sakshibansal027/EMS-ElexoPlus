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
};

export const updateLeaveApplicationStatus = async (
    leaveId,
    status
) => {
    applicationsStore = applicationsStore.map(leave =>
        leave.id === leaveId ? { ...leave, status } : leave
    );

    leaveHistoryStore = leaveHistoryStore.map(leave =>
        leave.id === leaveId ? { ...leave, status } : leave
    );

    return { leaveId, status };
};

export const cancelLeaveApplication = async leaveId => {
    leaveHistoryStore = leaveHistoryStore.filter(
        leave => leave.id !== leaveId
    );

    applicationsStore = applicationsStore.filter(
        leave => leave.id !== leaveId
    );

    return leaveId;
};




// ===========================
// Leave Policy APIs
// ===========================

export const getLeavePolicies = async () => [
    ...leavePoliciesStore,
];

export const updateLeavePolicy = async updatedPolicy => {

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
};

export const createLeavePolicy = async newPolicy => {

    leavePoliciesStore.push({
        ...newPolicy,
        id: `pol_${Date.now()}`,
    });

    return {
        success: true,
        data: leavePoliciesStore,
    };
};

export const deleteLeavePolicy = async policyId => {

    leavePoliciesStore =
        leavePoliciesStore.filter(
            policy => policy.id !== policyId
        );

    return {
        success: true,
        data: leavePoliciesStore,
    };
};