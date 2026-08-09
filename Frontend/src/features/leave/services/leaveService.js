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

let leavePoliciesStore = [...initialLeavePolicies];
let calendarEventsStore = [...teamLeaveCalendarEvents];
let holidaysStore = [...companyHolidaysData];


// ===========================
// Leave Applications
// ===========================

const roleScopedApplications = {
    [ROLES.ADMIN]: () =>
        LeaveApplicationsData,

    [ROLES.HR]: () =>
        LeaveApplicationsData.filter(
            leave => leave.designation !== "Admin"
        ),

    [ROLES.ASM]: ({ userId }) =>
        LeaveApplicationsData.filter(
            leave => leave.asmId === userId
        ),

    [ROLES.SALES_EXECUTIVE]: ({ userId }) =>
        LeaveApplicationsData.filter(
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
                events: calendarEventsStore.filter(
                    event => event.asmId === userId
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

        leaveHistory:
            role === ROLES.SALES_EXECUTIVE
                ? leaveHistory.filter(
                      history => history.employeeId === userId
                  )
                : leaveHistory,

        calendarData: await getTeamLeaveCalendar({
            role,
            userId,
        }),
    };
};



// ===========================
// Leave APIs
// ===========================

export const submitLeaveApplication = async application => application;

export const updateLeaveApplicationStatus = async (
    leaveId,
    status
) => ({
    leaveId,
    status,
});

export const cancelLeaveApplication = async leaveId =>
    leaveId;




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