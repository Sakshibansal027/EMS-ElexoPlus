import {
    LeaveApplicationsData,
    LeaveCardsData,
} from "../mock/leaveData.js";
import {
    leaveBalanceData,
    leaveHistory,
    summaryCards,
} from "../mock/employeeLeaveData.js";
import { ROLES } from "../config/roles.js";

// Replace only these functions with API requests when the backend is available.
const roleScopedApplications = {
    [ROLES.ADMIN]: () => LeaveApplicationsData,
    [ROLES.HR]: () =>
        LeaveApplicationsData.filter(
            (leave) => leave.designation !== "Admin"
        ),
    [ROLES.ASM]: () =>
        LeaveApplicationsData.filter(
            (leave) => leave.approverRole === "ASM"
        ),
    [ROLES.SALES_EXECUTIVE]: ({ userId }) =>
        LeaveApplicationsData.filter(
            (leave) => leave.employeeId === userId
        ),
};

export const getLeavesByRole = async ({ role, userId, asmId }) => {
    const resolver =
        roleScopedApplications[role] ?? roleScopedApplications[ROLES.SALES_EXECUTIVE];

    return resolver({ userId, asmId });
};

export const getLeaveDashboard = async ({ role, userId, asmId }) => ({
    managementCards: LeaveCardsData,
    teamLeaves: await getLeavesByRole({ role, userId, asmId }),
    summaryCards,
    leaveBalanceData,
    leaveHistory:
        role === ROLES.SALES_EXECUTIVE
            ? leaveHistory.filter((leave) => leave.employeeId === userId)
            : leaveHistory,
});

export const submitLeaveApplication = async (application) => application;
export const updateLeaveApplicationStatus = async (employeeId, status) => ({ employeeId, status });
export const cancelLeaveApplication = async (leaveId) => leaveId;
