import { PAYROLL_DATE_LOCALE } from "../constants/payroll";

export const getCurrentPayrollMonth = () => new Date().toLocaleDateString(PAYROLL_DATE_LOCALE, { month: "long", year: "numeric" });

export const calculatePayrollTotals = ({ salaryBreakup = {}, deductions = {} } = {}, { includeIncentive = true } = {}) => {
  const earnings = includeIncentive ? salaryBreakup : Object.fromEntries(Object.entries(salaryBreakup).filter(([key]) => key !== "incentive"));
  const grossEarnings = Object.values(earnings || {}).reduce((total, value) => total + (Number(value) || 0), 0);
  const totalDeductions = typeof deductions === "number"
    ? deductions
    : Object.values(deductions || {}).reduce((total, value) => total + (Number(value) || 0), 0);
  return { grossEarnings, totalDeductions, netPay: grossEarnings - totalDeductions };
};

export const createPayrollView = (payroll = {}, options) => {
  const totals = calculatePayrollTotals(payroll.payroll || {}, options);
  const payrollData = {
    ...payroll.payroll,
    ...totals,
  };

  const synchronizedStats = (payroll.payroll?.stats || []).map((stat) => {
    if (stat.title === "CURRENT MONTH NET PAY") {
      return { ...stat, value: formatCurrency(totals.netPay) };
    }
    if (stat.title === "TOTAL DEDUCTIONS") {
      return { ...stat, value: formatCurrency(totals.totalDeductions) };
    }
    return stat;
  });

  const synchronizedPayslip = payroll.latestPayslip ? {
    ...payroll.latestPayslip,
    basicSalary: payroll.latestPayslip.basicSalary ?? payrollData.salaryBreakup?.basicSalary,
    hra: payroll.latestPayslip.hra ?? payrollData.salaryBreakup?.hra,
    allowances: payroll.latestPayslip.allowances ?? payrollData.salaryBreakup?.allowances,
    incentive: payroll.latestPayslip.incentive ?? payroll.latestPayslip.incentives ?? payrollData.salaryBreakup?.incentive,
    incentives: payroll.latestPayslip.incentives ?? payroll.latestPayslip.incentive ?? payrollData.salaryBreakup?.incentive,
    salaryBreakup: payrollData.salaryBreakup,
    deductions: payrollData.deductions,
    grossEarnings: totals.grossEarnings,
    netPay: totals.netPay,
  } : null;

  return {
    ...payroll,
    currentMonth: getCurrentPayrollMonth(),
    stats: synchronizedStats,
    payrollData,
    payrollHistory: payroll.history || [],
    salaryRevisions: payroll.revisions || [],
    latestPayslip: synchronizedPayslip,
    payslipData: synchronizedPayslip,
  };
};

export const createMockResponse = (data, delay = 150) => new Promise((resolve) => {
  window.setTimeout(() => resolve(structuredClone(data)), delay);
});

export const downloadFile = (href, filename) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadTextFile = (filename, content, type = "text/plain;charset=utf-8") => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const downloadPayrollHistory = (history) => {
  const headers = "Month,Net Pay,Status,Deductions";
  const rows = history.map((item) => [item.month, item.netPay, item.status, item.deductions].join(","));
  downloadTextFile("Payroll-History.csv", [headers, ...rows].join("\n"), "text/csv;charset=utf-8");
};

// Formatting & Currency Helpers
export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "₹0";
  if (typeof value === "string" && value.includes("₹")) return value;
  
  const numericVal = typeof value === "string" ? Number(value.replace(/[^0-9.-]+/g, "")) : Number(value);
  return isNaN(numericVal) ? value : `₹${numericVal.toLocaleString("en-IN")}`;
};

export const formatAmount = (amt) => {
  const num = Number(amt) || 0;
  return num.toLocaleString("en-IN");
};

export const formatLakhs = (value) => `₹${Number(value || 0) / 100000}L`;

// Employee Data Helpers
export const getEmployeeInitials = (name) => {
  if (!name) return "EM";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export const isEmployeeOnHold = (emp) => {
  if (!emp) return false;
  return Boolean(emp.isHold || emp.status === "On Hold" || emp.status === "HOLD");
};

// Expense & Claim Helpers
export const calculateApprovedExpensesTotal = (expensesList = []) => {
  return expensesList
    ?.filter((item) => {
      const status = item.status?.toLowerCase();
      return status === "approved" || status === "disbursed";
    })
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
};

export const getExpenseStatusStyle = (status) => {
  switch (status) {
    case "Approved": return "bg-green-500/15 text-green-400 border-green-500/20";
    case "Pending": return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    case "Disbursed": return "bg-blue-500/15 text-blue-400 border-blue-500/20";
    default: return "bg-gray-500/15 text-gray-400 border-gray-500/20";
  }
};

export const createExpenseClaim = (type, amount, date, currentCount = 0) => {
  return {
    id: `CLM${String(currentCount + 1).padStart(3, '0')}`,
    type,
    amount: parseFloat(amount),
    date,
    status: "Pending"
  };
};

export const getLopImpactTextColor = (lopImpact) => {
  return lopImpact?.includes("-")
    ? "text-[var(--color-danger)]"
    : "text-[var(--color-foreground-muted)]";
};

export const getLogStatusStyle = (status) => {
  return status === "Critical"
    ? "bg-red-500/10 text-red-400 border border-red-500/20"
    : "bg-amber-500/10 text-amber-400 border border-amber-500/20";
};

export const getHoldButtonClass = (isOnHold) => {
  return isOnHold
    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
    : "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20";
};

