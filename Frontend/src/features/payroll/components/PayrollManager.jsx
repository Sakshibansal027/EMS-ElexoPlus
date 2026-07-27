import React, { useState, useMemo } from "react";
import { Calendar, DollarSign, Users, CheckCircle2, Download, AlertTriangle } from "lucide-react";
import { calculateEmployeePayroll } from "../utils/payroll";
import { PayrollPreviewTable } from "./PayrollPreviewTable";

export const PayrollManager = ({ employees = [] }) => {
  // Payroll State
  const [selectedMonth, setSelectedMonth] = useState("2026-07"); // YYYY-MM
  const [overrides, setOverrides] = useState({}); // Stores per-employee UI edits
  const [payrollStatus, setPayrollStatus] = useState("DRAFT"); // DRAFT | GENERATED | LOCKED

  // Days in selected month calculation
  const monthConfig = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    return { year, month, daysInMonth };
  }, [selectedMonth]);

  // Handle Input Changes from Table
  const handleOverrideChange = (empId, field, value) => {
    setOverrides((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [field]: value,
      },
    }));
  };

  // Re-calculate all rows dynamically on any override or month change
  const payrollRows = useMemo(() => {
    return employees.map((emp) => {
      const empOverrides = overrides[emp.id] || {};
      return calculateEmployeePayroll(emp, null, monthConfig, empOverrides);
    });
  }, [employees, monthConfig, overrides]);

  // Aggregate Executive Summaries
  const summary = useMemo(() => {
    return payrollRows.reduce(
      (acc, row) => {
        if (!row.isOnHold) {
          acc.totalGross += row.baseGross;
          acc.totalLopDeduction += row.lopDeduction;
          acc.totalIncentives += row.totalIncentives;
          acc.totalDeductions += row.totalDeductions;
          acc.totalNetPayable += row.netSalary;
          acc.activePayrolls += 1;
        } else {
          acc.onHoldPayrolls += 1;
        }
        return acc;
      },
      {
        totalGross: 0,
        totalLopDeduction: 0,
        totalIncentives: 0,
        totalDeductions: 0,
        totalNetPayable: 0,
        activePayrolls: 0,
        onHoldPayrolls: 0,
      }
    );
  }, [payrollRows]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const handleGeneratePayroll = () => {
    setPayrollStatus("LOCKED");
    // API Call: POST /api/payroll/lock { month: selectedMonth, rows: payrollRows }
  };

  return (
    <div className="space-y-6">
      {/* TOP BAR & MONTH SELECTOR */}
      <div className="card p-5 border border-[var(--color-border)] rounded-2xl bg-[var(--color-background-elevated)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Monthly Payroll Execution
          </h2>
          <p className="text-xs text-[var(--color-foreground-muted)] mt-1 font-medium">
            Review auto-synced attendance, apply ad-hoc adjustments, and lock monthly payout.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Month Picker */}
          <input
            type="month"
            value={selectedMonth}
            disabled={payrollStatus === "LOCKED"}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-xs font-bold focus:outline-none focus:border-[var(--color-primary)]"
          />

          {/* Action Button */}
          {payrollStatus === "LOCKED" ? (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/10 text-emerald-600 border border-emerald-600/20 text-xs font-bold rounded-xl"
            >
              <CheckCircle2 className="w-4 h-4" /> Payroll Locked
            </button>
          ) : (
            <button
              onClick={handleGeneratePayroll}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-[var(--color-primary)]/20"
            >
              Generate & Lock Payroll
            </button>
          )}
        </div>
      </div>

      {/* EXECUTIVE SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-elevated)]">
          <span className="text-[10px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider block mb-1">
            Total Net Payout
          </span>
          <span className="text-lg font-extrabold text-[var(--color-primary)]">
            {formatCurrency(summary.totalNetPayable)}
          </span>
          <span className="text-[10px] text-[var(--color-foreground-muted)] block mt-1">
            {summary.activePayrolls} Employees Active
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-elevated)]">
          <span className="text-[10px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider block mb-1">
            Total LOP Loss
          </span>
          <span className="text-lg font-extrabold text-red-500">
            -{formatCurrency(summary.totalLopDeduction)}
          </span>
          <span className="text-[10px] text-[var(--color-foreground-muted)] block mt-1">
            Deducted from Base Gross
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-elevated)]">
          <span className="text-[10px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider block mb-1">
            Statutory Deductions
          </span>
          <span className="text-lg font-extrabold text-[var(--color-foreground)]">
            {formatCurrency(summary.totalDeductions)}
          </span>
          <span className="text-[10px] text-[var(--color-foreground-muted)] block mt-1">
            PF + PT + Taxes
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-elevated)]">
          <span className="text-[10px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider block mb-1">
            Salaries On Hold
          </span>
          <span className="text-lg font-extrabold text-amber-500">
            {summary.onHoldPayrolls}
          </span>
          <span className="text-[10px] text-[var(--color-foreground-muted)] block mt-1">
            Requires Manual Approval
          </span>
        </div>
      </div>

      {/* PREVIEW & OVERRIDE GRID */}
      <PayrollPreviewTable
        payrollRows={payrollRows}
        onOverrideChange={handleOverrideChange}
        isLocked={payrollStatus === "LOCKED"}
      />
    </div>
  );
};