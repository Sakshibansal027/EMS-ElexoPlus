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
        canManageLeavePolicies: true,
        showTeamCalendar: true
    },

    [ROLES.HR]: {
        showApplyLeave: true,
        showLeaveStats: true,
        showTeamLeaves: true,
        showLeaveBalance: false,
        showLeaveHistory: true,
        showUpcomingLeaves: true,
        showLeaveAnalytics: true,
        canReviewLeaves: true,
        canManageLeavePolicies: false,
        showTeamCalendar: true
    },

    [ROLES.ASM]: {
        showApplyLeave: true,
        showLeaveStats: true,
        showTeamLeaves: true,
        showLeaveBalance: false,
        showLeaveHistory: true,
        showUpcomingLeaves: true,
        showLeaveAnalytics: true,
        canReviewLeaves: true,
        canManageLeavePolicies: false,
        showTeamCalendar: true
    },

    [ROLES.SALES_EXECUTIVE]: {
        showApplyLeave: true,
        showLeaveStats: false,
        showTeamLeaves: false,
        showLeaveBalance: true,
        showLeaveHistory: true,
        showUpcomingLeaves: true,
        showLeaveAnalytics: true,
        canReviewLeaves: false,
        canManageLeavePolicies: false,
        showTeamCalendar: true
    },
});

export const getLeavePermissions = (role) =>
    LEAVE_PERMISSIONS[role] ?? LEAVE_PERMISSIONS[ROLES.SALES_EXECUTIVE];
