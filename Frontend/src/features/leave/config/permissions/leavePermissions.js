import { ROLES } from "../roles.js";

export const LEAVE_PERMISSIONS = Object.freeze({
    [ROLES.ADMIN]: {
        showApplyLeave: false,
        showLeaveStats: true,
        showTeamLeaves: true,
        showLeaveBalance: false,
        showLeaveHistory: false,
        showUpcomingLeaves: false,
        showLeaveAnalytics: false,
        canReviewLeaves: true,
    },

    [ROLES.HR]: {
        showApplyLeave: true,
        showLeaveStats: true,
        showTeamLeaves: true,
        showLeaveBalance: false,
        showLeaveHistory: false,
        showUpcomingLeaves: false,
        showLeaveAnalytics: false,
        canReviewLeaves: true,
    },

    [ROLES.ASM]: {
        showApplyLeave: true,
        showLeaveStats: true,
        showTeamLeaves: true,
        showLeaveBalance: false,
        showLeaveHistory: false,
        showUpcomingLeaves: false,
        showLeaveAnalytics: false,
        canReviewLeaves: true,
    },

    [ROLES.SALES_EXECUTIVE]: {
        showApplyLeave: true,
        showLeaveStats: true,
        showTeamLeaves: false,
        showLeaveBalance: true,
        showLeaveHistory: true,
        showUpcomingLeaves: true,
        showLeaveAnalytics: true,
        canReviewLeaves: false,
    },
});

export const getLeavePermissions = (role) =>
    LEAVE_PERMISSIONS[role] ?? LEAVE_PERMISSIONS[ROLES.SALES_EXECUTIVE];
