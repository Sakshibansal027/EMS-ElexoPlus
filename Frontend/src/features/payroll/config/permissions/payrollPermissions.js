export const PAYROLL_PERMISSIONS = {
  ADMIN: {
    showDashboardMetrics: true,
    showFullPayrollControl: true,
    showSalaryStructureManagement: true,
    showPayrollProcessing: true,
    showVerificationDesk: true,
    showMasterDirectory: true,
    showMyPayroll: true,
    canProcessPayroll: true,
    showTeamOperations: false,
    showTeamIncentives: false,
  },
  HR: {
    showDashboardMetrics: true,
    showFullPayrollControl: false,
    showVerificationDesk: true,
    showMasterDirectory: true,
    showMyPayroll: true,
    canProcessPayroll: false,
    showSalaryStructureManagement: false,
    showPayrollProcessing: false,
    showTeamOperations: true,
    showTeamIncentives: false,
  },
  ASM: {
    showDashboardMetrics: true,
    showTeamIncentives: true,
    showTeamOperations: true,
    showMyPayroll: true,
    canProcessPayroll: false,
    showFullPayrollControl: false,
    showSalaryStructureManagement: false,
    showVerificationDesk: false,
    showMasterDirectory: false,
  },
  SALES_EXECUTIVE: {
    showDashboardMetrics: false,
    showTeamOperations: false,
    showMyPayroll: true,
    canProcessPayroll: false,
    showFullPayrollControl: false,
    showSalaryStructureManagement: false,
    showVerificationDesk: false,
    showMasterDirectory: false,
    showTeamIncentives: false,
  },
};

export const getPayrollPermissions = (role) => {
  let normalizedRole = (role || "SALES_EXECUTIVE").toUpperCase();
  if (normalizedRole === "SE" || normalizedRole === "EMPLOYEE") {
    normalizedRole = "SALES_EXECUTIVE";
  }
  return PAYROLL_PERMISSIONS[normalizedRole] || PAYROLL_PERMISSIONS.SALES_EXECUTIVE;
};
