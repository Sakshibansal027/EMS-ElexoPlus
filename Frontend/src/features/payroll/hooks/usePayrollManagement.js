import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { getPayrollPermissions } from "../config/permissions/payrollPermissions";
import payrollService from "../services/payrollService";
import { downloadFile, downloadPayrollHistory } from "../utils/payroll";

const normalizeRole = (role) => {
  const upper = String(role || "SALES_EXECUTIVE").toUpperCase();
  if (upper === "SE" || upper === "EMPLOYEE") return "SALES_EXECUTIVE";
  return upper;
};

const getCurrentUserFromStore = (outletContext, propsRole) => {
  const rawRole =
    propsRole ||
    outletContext?.role ||
    outletContext?.user?.role;

  if (rawRole) {
    const userObj = outletContext?.user || outletContext;
    return {
      id: userObj?.id || userObj?.empId || "EMP001",
      name: userObj?.name || "User",
      role: normalizeRole(rawRole),
    };
  }

  let rawUser = null;
  try {
    const sessionUserStr = sessionStorage.getItem("elexoplus_user") || sessionStorage.getItem("user");
    const localUserStr = localStorage.getItem("user") || localStorage.getItem("profile");
    const userStr = sessionUserStr || localUserStr;
    if (userStr) {
      rawUser = JSON.parse(userStr);
    }
  } catch (e) {
    // Ignore JSON errors
  }

  const role =
    rawUser?.role ||
    sessionStorage.getItem("role") ||
    sessionStorage.getItem("activeRole") ||
    localStorage.getItem("role") ||
    localStorage.getItem("activeRole") ||
    window.currentUser?.role ||
    window.activeRole ||
    "ADMIN";

  return {
    id: rawUser?.id || rawUser?.empId || "EMP001",
    name: rawUser?.name || "Harshit Goel",
    role: normalizeRole(role),
  };
};

export const usePayrollManagement = (propsRole) => {
  let outletContext = null;
  try {
    outletContext = useOutletContext();
  } catch (e) {
    // Graceful fallback if rendered outside router Outlet
  }

  const [currentUser, setCurrentUser] = useState(() =>
    getCurrentUserFromStore(outletContext, propsRole)
  );

  const [dashboardData, setDashboardData] = useState({
    permissions: getPayrollPermissions(currentUser.role),
    metrics: [],
    directory: [],
    teamData: null,
    personalPayroll: {},
    records: [],
    summary: null,
    salaryRevisions: [],
    lopCases: [],
    reports: [],
    bankTransfers: [],
    structures: [],
    stages: [],
    currentStage: 1,
    exceptions: [],
    complianceData: [],
    departmentLiability: [],
    joiningExitData: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab & Modal UI States
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployeeForHold, setSelectedEmployeeForHold] = useState(null);

  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isTeamIncentiveOpen, setIsTeamIncentiveOpen] = useState(false);
  const [isBankDrawerOpen, setIsBankDrawerOpen] = useState(false);

  // Poll or listen for role changes from Navbar / Profile switchers / Storage
  useEffect(() => {
    const handleRoleCheck = () => {
      const updatedUser = getCurrentUserFromStore(outletContext, propsRole);
      setCurrentUser((prev) => {
        if (prev.role !== updatedUser.role || prev.id !== updatedUser.id) {
          return updatedUser;
        }
        return prev;
      });
    };

    handleRoleCheck();

    window.addEventListener("storage", handleRoleCheck);
    window.addEventListener("roleChange", handleRoleCheck);
    window.addEventListener("userChange", handleRoleCheck);

    const intervalId = setInterval(handleRoleCheck, 500);

    return () => {
      window.removeEventListener("storage", handleRoleCheck);
      window.removeEventListener("roleChange", handleRoleCheck);
      window.removeEventListener("userChange", handleRoleCheck);
      clearInterval(intervalId);
    };
  }, [outletContext, propsRole]);

  // Fetch Dashboard Data whenever role or userId changes
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await payrollService.getPayrollDashboardData(currentUser.role, currentUser.id);
      setDashboardData((prev) => ({ ...prev, ...data }));
    } catch (err) {
      setError(err?.message || "Failed to load payroll management data.");
    } finally {
      setLoading(false);
    }
  }, [currentUser.role, currentUser.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Operations
  const handleProcessPayroll = async (payrollId) => {
    try {
      await payrollService.processPayroll(payrollId);
      fetchData();
    } catch (err) {
      console.error("Failed to process payroll:", err);
    }
  };

  const handleApproveRevision = async (revisionId) => {
    try {
      await payrollService.approveSalaryRevision(revisionId);
      fetchData();
    } catch (err) {
      console.error("Failed to approve salary revision:", err);
    }
  };

  const handleRejectRevision = async (revisionId) => {
    try {
      await payrollService.rejectSalaryRevision(revisionId);
      fetchData();
    } catch (err) {
      console.error("Failed to reject salary revision:", err);
    }
  };

  const handleResolveLopCase = async (caseId) => {
    try {
      await payrollService.resolveLopCase(caseId);
      fetchData();
    } catch (err) {
      console.error("Failed to resolve LOP case:", err);
    }
  };

  const handleFreezeAttendance = async () => {
    const result = await payrollService.freezeAttendance();
    if (result.success) {
      setDashboardData((prev) => ({ ...prev, isAttendanceFrozen: true }));
    }
  };

  const handleSubmitToFinance = async () => {
    setIsSubmitting(true);
    try {
      const result = await payrollService.submitToFinance();
      if (result.success) {
        setDashboardData((prev) => ({
          ...prev,
          currentStage: result.nextStage,
          isAttendanceFrozen: result.attendanceFrozen,
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHoldUpdated = async (payload) => {
    const updatedDirectory = await payrollService.updateSalaryHold(
      dashboardData.directory,
      payload
    );
    setDashboardData((prev) => ({ ...prev, directory: updatedDirectory }));
  };

  const permissions = getPayrollPermissions(currentUser.role);

  return {
    currentUser,
    role: currentUser.role,
    permissions,
    loading,
    error,
    metrics: dashboardData.metrics,
    directory: dashboardData.directory,
    teamData: dashboardData.teamData,
    personalPayroll: dashboardData.personalPayroll,
    records: dashboardData.records,
    summary: dashboardData.summary,
    salaryRevisions: dashboardData.salaryRevisions,
    lopCases: dashboardData.lopCases,
    reports: dashboardData.reports,
    bankTransfers: dashboardData.bankTransfers,
    structures: dashboardData.structures,
    stages: dashboardData.stages,
    currentStage: dashboardData.currentStage,
    exceptions: dashboardData.exceptions,
    complianceData: dashboardData.complianceData,
    departmentLiability: dashboardData.departmentLiability,
    joiningExitData: dashboardData.joiningExitData,
    isAttendanceFrozen: dashboardData.isAttendanceFrozen,

    // UI States & Setters
    activeTab,
    setActiveTab,
    isSubmitting,
    isHoldModalOpen: Boolean(selectedEmployeeForHold),
    selectedEmployeeForHold,
    isPayslipOpen,
    isHistoryOpen,
    isRevisionOpen,
    isTeamIncentiveOpen,
    isBankDrawerOpen,

    // Action Handlers
    openHoldModal: setSelectedEmployeeForHold,
    closeHoldModal: () => setSelectedEmployeeForHold(null),
    openPayslip: () => setIsPayslipOpen(true),
    closePayslip: () => setIsPayslipOpen(false),
    openHistory: () => setIsHistoryOpen(true),
    closeHistory: () => setIsHistoryOpen(false),
    openRevisions: () => setIsRevisionOpen(true),
    closeRevisions: () => setIsRevisionOpen(false),
    openTeamIncentive: () => setIsTeamIncentiveOpen(true),
    closeTeamIncentive: () => setIsTeamIncentiveOpen(false),
    openBankDrawer: () => setIsBankDrawerOpen(true),
    closeBankDrawer: () => setIsBankDrawerOpen(false),

    processPayroll: handleProcessPayroll,
    approveSalaryRevision: handleApproveRevision,
    rejectSalaryRevision: handleRejectRevision,
    resolveLopCase: handleResolveLopCase,
    handleFreezeAttendance,
    handleSubmitToFinance,
    handleHoldUpdated,
    downloadPayslip: () =>
      downloadFile(
        dashboardData.personalPayroll?.latestPayslip?.pdfUrl,
        `${dashboardData.personalPayroll?.latestPayslip?.month || "Payroll"}-Payslip.pdf`
      ),
    downloadHistory: (item) =>
      downloadPayrollHistory(
        item ? [item] : dashboardData.personalPayroll?.payrollHistory || []
      ),
    refetch: fetchData,
  };
};

export default usePayrollManagement;
