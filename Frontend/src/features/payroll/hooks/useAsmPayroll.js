import { useEffect, useState } from "react";
import { asmPayrollService } from "../services/asmPayrollService";
import { PAYROLL_TABS } from "../constants/payroll";
import { downloadFile, downloadPayrollHistory } from "../utils/payroll";

const emptyPayroll = { team: {}, stats: [], payrollData: {}, payrollHistory: [], salaryRevisions: [] };

export const useAsmPayroll = () => {
  const [payroll, setPayroll] = useState(emptyPayroll);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(PAYROLL_TABS.TEAM);
  const [isTeamIncentiveOpen, setIsTeamIncentiveOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);

  useEffect(() => {
    asmPayrollService.getPayroll().then(setPayroll)
      .catch((requestError) => setError(requestError?.message || "Failed to load payroll data."))
      .finally(() => setLoading(false));
  }, []);

  return {
    ...payroll,
    loading,
    error,
    activeTab,
    isTeamIncentiveOpen,
    isPayslipOpen,
    isHistoryOpen,
    isRevisionOpen,
    setActiveTab,
    openTeamIncentive: () => setIsTeamIncentiveOpen(true),
    closeTeamIncentive: () => setIsTeamIncentiveOpen(false),
    openPayslip: () => setIsPayslipOpen(true),
    closePayslip: () => setIsPayslipOpen(false),
    openHistory: () => setIsHistoryOpen(true),
    closeHistory: () => setIsHistoryOpen(false),
    openRevisions: () => setIsRevisionOpen(true),
    closeRevisions: () => setIsRevisionOpen(false),
    downloadPayslip: () => downloadFile(payroll.latestPayslip?.pdfUrl, `${payroll.latestPayslip?.month || "Payroll"}-Payslip.pdf`),
    downloadHistory: (item) => downloadPayrollHistory(item ? [item] : payroll.payrollHistory),
  };
};
