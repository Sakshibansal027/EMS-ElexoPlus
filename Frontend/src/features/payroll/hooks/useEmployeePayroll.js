import { useEffect, useState } from "react";
import { employeePayrollService } from "../services/employeePayrollService";
import { downloadFile, downloadPayrollHistory } from "../utils/payroll";

const emptyPayroll = { 
  stats: [], 
  payrollData: {}, 
  payrollHistory: [], 
  salaryRevisions: [], 
  expenseReimbursements: [],
  latestPayslip: null,
  payslipData: null
};

export const useEmployeePayroll = () => {
  const [payroll, setPayroll] = useState(emptyPayroll);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);

  useEffect(() => {
    employeePayrollService.getPayroll()
      .then((data) => {
        // Fallback safety taaki agar API se data mein kuch missing ho toh manage ho jaye
        setPayroll({
          ...emptyPayroll,
          ...data,
          // Agar API/Mock mein payslipData alag se nahi hai, toh latestPayslip ko hi payslipData maan lo
          payslipData: data?.payslipData || data?.latestPayslip || {
            employeeName: "Harshit Goel",
            employeeId: "EMP001",
            designation: "Sales Executive",
            department: "Sales",
            month: "July 2026",
            basicSalary: 45000,
            hra: 18000,
            allowances: 12000,
            incentives: 24500,
            deductions: {
              pf: 5400,
              professionalTax: 200,
              tds: 3600,
              other: 400
            },
            netPay: 89900
          }
        });
      })
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