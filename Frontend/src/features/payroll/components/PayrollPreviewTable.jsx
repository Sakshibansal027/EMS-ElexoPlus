import React from "react";
import { Lock, Unlock, PauseCircle, PlayCircle, AlertCircle } from "lucide-react";

export const PayrollPreviewTable = ({
  payrollRows,
  onOverrideChange,
  isLocked,
}) => {
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="overflow-x-auto border border-[var(--color-border)] rounded-2xl bg-[var(--color-background-elevated)] shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/40 text-[var(--color-foreground-muted)] font-semibold uppercase tracking-wider text-[10px]">
            <th className="p-3">Employee</th>
            <th className="p-3 text-center">Payable / LOP Days</th>
            <th className="p-3 text-right">Base Gross</th>
            <th className="p-3 text-right">LOP Deduction</th>
            <th className="p-3 text-right">Incentives (₹)</th>
            <th className="p-3 text-right">Deductions (PF/Tax/Other)</th>
            <th className="p-3 text-right">Net Payable</th>
            <th className="p-3 text-center">Hold Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]/50 font-medium">
          {payrollRows.map((row) => {
            const isHold = row.isOnHold;

            return (
              <tr
                key={row.employeeId}
                className={`transition-colors hover:bg-[var(--color-card-hover)]/50 ${
                  isHold ? "bg-red-500/5" : ""
                }`}
              >
                {/* Employee Info */}
                <td className="p-3">
                  <div className="font-bold text-[var(--color-foreground)]">{row.name}</div>
                  <div className="text-[10px] text-[var(--color-foreground-muted)]">
                    {row.department} • {row.designation}
                  </div>
                </td>

                {/* Payable Days / LOP Override Input */}
                <td className="p-3 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <input
                      type="number"
                      disabled={isLocked}
                      min="0"
                      max={row.daysInMonth}
                      value={row.payableDays}
                      onChange={(e) =>
                        onOverrideChange(row.employeeId, "presentDays", Number(e.target.value))
                      }
                      className="w-12 p-1 text-center font-bold rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-50"
                    />
                    <span className="text-[var(--color-foreground-muted)]">/ {row.daysInMonth}</span>
                  </div>
                  {row.lopDays > 0 && (
                    <div className="text-[10px] text-red-500 font-semibold mt-0.5">
                      {row.lopDays} Days LOP
                    </div>
                  )}
                </td>

                {/* Base Monthly Gross */}
                <td className="p-3 text-right font-semibold text-[var(--color-foreground)]">
                  {formatCurrency(row.baseGross)}
                </td>

                {/* LOP Amount Deduction */}
                <td className="p-3 text-right text-red-500 font-semibold">
                  -{formatCurrency(row.lopDeduction)}
                </td>

                {/* Ad-hoc Incentive Editable Input */}
                <td className="p-3 text-right">
                  <input
                    type="number"
                    disabled={isLocked}
                    placeholder="0"
                    value={row.adhocIncentive || ""}
                    onChange={(e) =>
                      onOverrideChange(row.employeeId, "adhocIncentive", e.target.value)
                    }
                    className="w-20 p-1 text-right font-bold text-emerald-600 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-50"
                  />
                </td>

                {/* Total Statutory & Manual Deductions */}
                <td className="p-3 text-right">
                  <div className="text-red-500 font-semibold">
                    -{formatCurrency(row.totalDeductions)}
                  </div>
                  <div className="text-[9px] text-[var(--color-foreground-muted)]">
                    PF: ₹{row.pfDeduction} | PT: ₹{row.professionalTax}
                  </div>
                </td>

                {/* Final Net Payable */}
                <td className="p-3 text-right font-bold text-sm text-[var(--color-primary)]">
                  {formatCurrency(row.netSalary)}
                </td>

                {/* Hold Salary Action Toggle */}
                <td className="p-3 text-center">
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => onOverrideChange(row.employeeId, "isOnHold", !isHold)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer disabled:opacity-50 ${
                      isHold
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-card-hover)]"
                    }`}
                  >
                    {isHold ? (
                      <>
                        <PauseCircle className="w-3.5 h-3.5" /> On Hold
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5" /> Active
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};