import { useEffect, useState } from "react";
import { PAYROLL_TABS } from "../constants/payroll";
import { hrPayrollService } from "../services/hrPayrollService";
import { downloadFile, downloadPayrollHistory } from "../utils/payroll";

const emptyManagement = { statsData: [], stages: [], exceptions: [], complianceData: [], directoryEmployees: [], departmentLiability: [], joiningExitData: { newJoinees: { count: 0, amount: 0 }, exits: { count: 0, amount: 0 } } };
const emptyPersonalPayroll = { stats: [], payrollData: {}, payrollHistory: [], salaryRevisions: [] };

export const useHRPayroll = () => {
  const [management, setManagement] = useState(emptyManagement);
  const [employee, setEmployee] = useState(emptyPersonalPayroll);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(PAYROLL_TABS.MANAGEMENT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployeeForHold, setSelectedEmployeeForHold] = useState(null);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);

  useEffect(() => {
    Promise.all([hrPayrollService.getPayroll(), hrPayrollService.getPersonalPayroll()])
      .then(([managementData, employeeData]) => { setManagement(managementData); setEmployee(employeeData); })
      .catch((requestError) => setError(requestError?.message || "Failed to load HR payroll data."))
      .finally(() => setLoading(false));
  }, []);

  const handleFreezeAttendance = async () => {
    const result = await hrPayrollService.freezeAttendance();
    if (result.success) setManagement((current) => ({ ...current, isAttendanceFrozen: result.attendanceFrozen }));
  };
  const handleSubmitToFinance = async () => {
    setIsSubmitting(true);
    try {
      const result = await hrPayrollService.submitToFinance();
      if (result.success) setManagement((current) => ({ ...current, currentStage: result.nextStage, isAttendanceFrozen: result.attendanceFrozen }));
    } finally { setIsSubmitting(false); }
  };
  const handleHoldUpdated = async (payload) => {
    const directoryEmployees = await hrPayrollService.updateSalaryHold(management.directoryEmployees, payload);
    setManagement((current) => ({ ...current, directoryEmployees }));
  };

  const employeePayroll = {
    ...employee,
    isPayslipOpen,
    isHistoryOpen,
    isRevisionOpen,
    openPayslip: () => setIsPayslipOpen(true),
    closePayslip: () => setIsPayslipOpen(false),
    openHistory: () => setIsHistoryOpen(true),
    closeHistory: () => setIsHistoryOpen(false),
    openRevisions: () => setIsRevisionOpen(true),
    closeRevisions: () => setIsRevisionOpen(false),
    downloadPayslip: () => downloadFile(employee.latestPayslip?.pdfUrl, `${employee.latestPayslip?.month || "Payroll"}-Payslip.pdf`),
    downloadHistory: (item) => downloadPayrollHistory(item ? [item] : employee.payrollHistory),
  };

  return {
    ...management,
    employee: employeePayroll,
    loading,
    error,
    activeTab,
    isSubmitting,
    isHoldModalOpen: Boolean(selectedEmployeeForHold),
    selectedEmployeeForHold,
    isPayslipOpen,
    isHistoryOpen,
    isRevisionOpen,
    setActiveTab,
    openHoldModal: setSelectedEmployeeForHold,
    closeHoldModal: () => setSelectedEmployeeForHold(null),
    handleFreezeAttendance,
    handleSubmitToFinance,
    handleHoldUpdated,
    ...employeePayroll,
  };
};
