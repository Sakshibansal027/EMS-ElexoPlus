import ROLES from "../../../config/roles";

const attendancePermissions = {
  [ROLES.ADMIN]: {
    showEmployeePanel: false,
    showCheckIn: false,
    showCalendar: false,
    showTimeline: false,
    showNotifications: false,

    showStats: true,
    showAnalytics: true,
    showDepartmentAnalytics: true,
    showAttendanceTable: true,
    showCorrections: true,
    showQuickActions: true,

    canApproveCorrections: true,
    canEditAttendance: true,
    canExport: true,
    canViewReports: true,
    canViewAllEmployees: true,
  },

  [ROLES.HR]: {
    showEmployeePanel: true,
    showCheckIn: true,
    showCalendar: true,
    showTimeline: true,
    showNotifications: true,

    showStats: true,
    showAnalytics: true,
    showDepartmentAnalytics: true,
    showAttendanceTable: true,
    showCorrections: true,
    showQuickActions: true,

    canApproveCorrections: true,
    canEditAttendance: true,
    canExport: true,
    canViewReports: true,
    canViewAllEmployees: true,
  },

  [ROLES.ASM]: {
    showEmployeePanel: true,
    showCheckIn: true,
    showCalendar: true,
    showTimeline: true,
    showNotifications: true,

    showStats: true,
    showAnalytics: true,
    showDepartmentAnalytics: false,
    showAttendanceTable: true,
    showCorrections: true,
    showQuickActions: true,

    canApproveCorrections: false,
    canEditAttendance: false,
    canExport: false,
    canViewReports: true,
    canViewAllEmployees: false,
  },

  [ROLES.SALES_EXECUTIVE]: {
    showEmployeePanel: true,
    showCheckIn: true,
    showCalendar: true,
    showTimeline: true,
    showNotifications: true,

    showStats: true,
    showAnalytics: false,
    showDepartmentAnalytics: false,
    showAttendanceTable: true,
    showCorrections: true,
    showQuickActions: true,

    canApproveCorrections: false,
    canEditAttendance: false,
    canExport: false,
    canViewReports: false,
    canViewAllEmployees: false,
  },
};

export default attendancePermissions;
