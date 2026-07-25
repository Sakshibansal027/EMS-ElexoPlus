import { useEffect, useState } from "react";
import { employeePayrollService } from "../services/employeePayrollService";
import { downloadFile, downloadPayrollHistory } from "../utils/payroll";

const emptyPayroll = { stats: [], payrollData: {}, payrollHistory: [], salaryRevisions: [], expenseReimbursements: [] };

export const useEmployeePayroll = () => {
  const [payroll, setPayroll] = useState(emptyPayroll);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);

  useEffect(() => {
    employeePayrollService.getPayroll()
      .then(setPayroll)
      .catch((requestError) => setError(requestError?.message || "Failed to load payroll data."))
      .finally(() => setLoading(false));
  }, []);

  return {
    ...payroll,
    loading,
    error,
    isPayslipOpen,
    isHistoryOpen,
    isRevisionOpen,
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
