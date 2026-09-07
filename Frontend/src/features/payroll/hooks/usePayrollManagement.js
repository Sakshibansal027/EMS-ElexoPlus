import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { getPayrollPermissions } from "../config/permissions/payrollPermissions";
import payrollService from "../services/payrollService";

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
      id: userObj?.id || userObj?.user_id || userObj?.employee_id || userObj?.empId || "EMP001",
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
    id: rawUser?.id || rawUser?.user_id || rawUser?.employee_id || rawUser?.empId || "EMP001",
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
    reimbursements: [],
    stages: [],
    currentStage: 1,
    exceptions: [],
    complianceData: [],
    departmentLiability: [],
    joiningExitData: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationError, setOperationError] = useState(null);

  // Tab & Modal UI States
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFreezing, setIsFreezing] = useState(false);
  const [dispatchingPayrollId, setDispatchingPayrollId] = useState(null);
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

    return () => {
      window.removeEventListener("storage", handleRoleCheck);
      window.removeEventListener("roleChange", handleRoleCheck);
      window.removeEventListener("userChange", handleRoleCheck);
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
      setError(payrollService.getErrorMessage(err, "Failed to load payroll management data."));
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
      setOperationError(null);
      await payrollService.processPayroll(payrollId);
      await fetchData();
    } catch (err) {
      console.error("Failed to process payroll:", err);
      setOperationError(payrollService.getErrorMessage(err, "Unable to process this payroll."));
    }
  };

  const handleVerifyPayroll = async (payrollId) => {
    try {
      setOperationError(null);
      await payrollService.verifyPayroll(payrollId);
      await fetchData();
    } catch (err) {
      setOperationError(payrollService.getErrorMessage(err, "Unable to verify this payroll."));
    }
  };

  const handleRejectPayroll = async (payrollId) => {
    try {
      setOperationError(null);
      await payrollService.rejectPayroll(payrollId);
      await fetchData();
    } catch (err) {
      setOperationError(payrollService.getErrorMessage(err, "Unable to reject this payroll."));
    }
  };

  const handleApprovePayroll = async (payrollId) => {
    try {
      setOperationError(null);
      await payrollService.approvePayroll(payrollId);
      await fetchData();
    } catch (err) {
      setOperationError(payrollService.getErrorMessage(err, "Unable to approve this payroll."));
    }
  };

  const handlePayPayroll = async (payrollId) => {
    try {
      setOperationError(null);
      await payrollService.payPayroll(payrollId);
      await fetchData();
    } catch (err) {
      setOperationError(payrollService.getErrorMessage(err, "Unable to mark this payroll as paid."));
    }
  };

  const handleApproveRevision = async (revisionId) => {
    try {
      setOperationError(null);
      await payrollService.approveSalaryRevision(revisionId);
      await fetchData();
    } catch (err) {
      console.error("Failed to approve salary revision:", err);
      setOperationError(payrollService.getErrorMessage(err, "Unable to approve this salary revision."));
    }
  };

  const handleRejectRevision = async (revisionId) => {
    try {
      setOperationError(null);
      await payrollService.rejectSalaryRevision(revisionId);
      await fetchData();
    } catch (err) {
      console.error("Failed to reject salary revision:", err);
      setOperationError(payrollService.getErrorMessage(err, "Unable to reject this salary revision."));
    }
  };

  const handleResolveLopCase = async (caseId) => {
    try {
      setOperationError(null);
      await payrollService.resolveLopCase(caseId);
      await fetchData();
    } catch (err) {
      console.error("Failed to resolve LOP case:", err);
      setOperationError(payrollService.getErrorMessage(err, "Unable to resolve this LOP case."));
    }
  };

  const handleFreezeAttendance = async () => {
    setIsFreezing(true);
    try {
      setOperationError(null);
      await payrollService.freezeAttendance(dashboardData.currentPeriodId);
      await fetchData();
    } catch (err) {
      setOperationError(payrollService.getErrorMessage(err, "Unable to freeze attendance."));
    } finally {
      setIsFreezing(false);
    }
  };

  const handleSubmitToFinance = async () => {
    setIsSubmitting(true);
    try {
      setOperationError(null);
      await payrollService.submitToFinance(dashboardData.currentPeriodId);
      await fetchData();
    } catch (err) {
      setOperationError(payrollService.getErrorMessage(err, "Unable to submit this payroll period for verification."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHoldUpdated = async (payload) => {
    try {
      setOperationError(null);
      await payrollService.updateSalaryHold(payload);
      await fetchData();
    } catch (err) {
      const message = payrollService.getErrorMessage(err, "Unable to update the salary hold.");
      setOperationError(message);
      throw new Error(message);
    }
  };

  const handleReviewReimbursement = async (reimbursementId, status) => {
    try {
      setOperationError(null);
      await payrollService.reviewReimbursement(reimbursementId, status);
      await fetchData();
    } catch (err) {
      const message = payrollService.getErrorMessage(err, "Unable to review this reimbursement.");
      setOperationError(message);
      throw new Error(message);
    }
  };

  const handleApplyReimbursement = async (reimbursementId, payrollId) => {
    try {
      setOperationError(null);
      await payrollService.applyReimbursement(reimbursementId, payrollId);
      await fetchData();
    } catch (err) {
      const message = payrollService.getErrorMessage(err, "Unable to apply this reimbursement to payroll.");
      setOperationError(message);
      throw new Error(message);
    }
  };

  const handleCreateReimbursement = async (payload) => {
    try {
      setOperationError(null);
      await payrollService.createReimbursement(payload);
      await fetchData();
    } catch (err) {
      const message = payrollService.getErrorMessage(err, "Unable to submit this reimbursement claim.");
      setOperationError(message);
      throw new Error(message);
    }
  };

  const handleDispatchBankTransfer = async (payrollId, transactionReference) => {
    setDispatchingPayrollId(payrollId);
    try {
      setOperationError(null);
      await payrollService.dispatchBankTransfer(payrollId, transactionReference);
      await fetchData();
    } catch (err) {
      const message = payrollService.getErrorMessage(err, "Unable to dispatch this bank transfer.");
      setOperationError(message);
      throw new Error(message);
    } finally {
      setDispatchingPayrollId(null);
    }
  };

  const handleDownloadPayslip = async (payslip) => {
    const payload = typeof payslip === "object"
      ? payslip
      : dashboardData.personalPayroll?.latestPayslip;
    const payslipId = payload?.payslipId || payload?.id || payslip;
    const fileName = (payload?.month || "Payroll") + "-Payslip.pdf";

    try {
      setOperationError(null);
      await payrollService.downloadPayslip(payslipId, fileName);
    } catch (err) {
      const message = payrollService.getErrorMessage(err, "Unable to download this payslip.");
      setOperationError(message);
      throw new Error(message);
    }
  };

  const viewPayroll = (payrollId) => payrollService.getPayrollDetail(payrollId);

  const permissions = getPayrollPermissions(currentUser.role);

  return {
    currentUser,
    role: currentUser.role,
    permissions,
    loading,
    error,
    operationError,
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
    reimbursements: dashboardData.reimbursements,
    structures: dashboardData.structures,
    stages: dashboardData.stages,
    currentStage: dashboardData.currentStage,
    exceptions: dashboardData.exceptions,
    complianceData: dashboardData.complianceData,
    departmentLiability: dashboardData.departmentLiability,
    joiningExitData: dashboardData.joiningExitData,
    isAttendanceFrozen: dashboardData.isAttendanceFrozen,
    currentPeriodLabel: dashboardData.currentPeriodLabel,
    currentPeriodId: dashboardData.currentPeriodId,

    // UI States & Setters
    activeTab,
    setActiveTab,
    isSubmitting,
    isFreezing,
    dispatchingPayrollId,
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
    verifyPayroll: handleVerifyPayroll,
    rejectPayroll: handleRejectPayroll,
    approvePayroll: handleApprovePayroll,
    payPayroll: handlePayPayroll,
    approveSalaryRevision: handleApproveRevision,
    rejectSalaryRevision: handleRejectRevision,
    resolveLopCase: handleResolveLopCase,
    handleFreezeAttendance,
    handleSubmitToFinance,
    handleHoldUpdated,
    reviewReimbursement: handleReviewReimbursement,
    applyReimbursement: handleApplyReimbursement,
    createReimbursement: handleCreateReimbursement,
    dispatchBankTransfer: handleDispatchBankTransfer,
    viewPayroll,
    downloadPayslip: handleDownloadPayslip,
    downloadHistory: handleDownloadPayslip,
    refetch: fetchData,
  };
};

export default usePayrollManagement;
