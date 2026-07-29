import React from "react";
import { X, CheckCircle2, Calendar, Award, ShieldAlert } from "lucide-react";

export const PayrollReviewModal = ({ isOpen, onClose, record, onConfirm }) => {
  if (!isOpen || !record) return null;

  // 1. Base Components
  const basic = record.basicSalary;
  const allowances = record.allowances ;
  
  // 2. Incentive Calculation
  const incentives = record.incentives;

  // 3. Attendance & LOP Sync
  const totalWorkingDays = record.totalWorkingDays;
  const daysWorked = record.daysWorked;
  const unpaidLeaves = totalWorkingDays - daysWorked; 
  
  // Gross Earnings = Basic + Allowances + Incentives
  const grossEarnings = basic + allowances + incentives;
  
  // LOP Deduction Calculation
  const perDaySalary = basic / totalWorkingDays;
  const lopDeduction = Math.round(unpaidLeaves * perDaySalary);
  
  // 4. Deduction Calculation (Taxes, PF, etc.)
  const standardTaxes = record.taxes;
  const providentFund = record.pf;
  const totalStandardDeductions = standardTaxes + providentFund;
  
  const totalDeductions = totalStandardDeductions + lopDeduction;
  
  // 5. Final Net Pay Generation
  const netPay = grossEarnings - totalDeductions;

  return (
    <div className="fixed inset-0 z-[10010] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel from Right */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[var(--color-card)] border-l border-[var(--color-border)] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background-secondary)]">
            <div>
              <h2 className="text-base font-bold text-[var(--color-primary)]">
                Payroll Generation & Review
              </h2>
              <p className="caption text-[var(--color-foreground-muted)] text-xs mt-0.5">
                {record.employeeName} • {record.payPeriod}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground)] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5 text-sm">
            
            {/* Employee Badge */}
            <div className="p-3.5 rounded-xl bg-[var(--color-background-secondary)] border border-[var(--color-border)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center border border-[var(--color-border-light)]">
                {record.employeeName?.split(" ").map(n => n[0]).join("").substring(0, 2)}
              </div>
              <div>
                <div className="font-bold text-xs text-[var(--color-foreground)]">{record.employeeName}</div>
                <div className="text-[11px] text-[var(--color-foreground-muted)]">{record.role} • {record.department}</div>
              </div>
            </div>

            {/* Attendance & Leave Sync (LOP) */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Attendance & Leave Sync
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[var(--color-background-secondary)] p-3 rounded-xl border border-[var(--color-border)] text-center">
                  <div className="text-[10px] text-[var(--color-foreground-muted)]">Working Days</div>
                  <div className="text-xs font-bold text-[var(--color-foreground)] mt-0.5">{totalWorkingDays} Days</div>
                </div>
                <div className="bg-[var(--color-background-secondary)] p-3 rounded-xl border border-[var(--color-border)] text-center">
                  <div className="text-[10px] text-[var(--color-foreground-muted)]">Days Worked</div>
                  <div className="text-xs font-bold text-[var(--color-success)] mt-0.5">{daysWorked} Days</div>
                </div>
                <div className="bg-[var(--color-background-secondary)] p-3 rounded-xl border border-[var(--color-border)] text-center">
                  <div className="text-[10px] text-[var(--color-foreground-muted)]">Unpaid (LOP)</div>
                  <div className="text-xs font-bold text-[var(--color-danger)] mt-0.5">{unpaidLeaves} Days</div>
                </div>
              </div>
            </div>

            {/* Earnings Calculation (Basic + Allowances + Incentives) */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Auto Salary & Incentive Calculation
              </span>
              <div className="flex justify-between items-center bg-[var(--color-background-secondary)] p-3 rounded-xl border border-[var(--color-border)]">
                <span className="text-[var(--color-foreground)] font-medium text-xs">Basic Salary</span>
                <span className="font-bold text-xs text-[var(--color-foreground)]">₹{basic.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-[var(--color-background-secondary)] p-3 rounded-xl border border-[var(--color-border)]">
                <span className="text-[var(--color-foreground)] font-medium text-xs">House Rent & Allowances</span>
                <span className="font-bold text-xs text-[var(--color-foreground)]">+ ₹{allowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-[var(--color-background-secondary)] p-3 rounded-xl border border-[var(--color-border)]">
                <span className="text-[var(--color-foreground)] font-medium text-xs flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[var(--color-success)]" />
                  Performance Incentives
                </span>
                <span className="font-bold text-xs text-[var(--color-success)]">+ ₹{incentives.toLocaleString()}</span>
              </div>
            </div>

            {/* Deduction Calculation (Taxes, PF & LOP) */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Deduction Calculation
              </span>
              <div className="flex justify-between items-center bg-[var(--color-background-secondary)] p-3 rounded-xl border border-[var(--color-border)]">
                <span className="text-[var(--color-foreground)] font-medium text-xs">Taxes (TDS) & PF</span>
                <span className="font-bold text-xs text-[var(--color-danger)]">- ₹{totalStandardDeductions.toLocaleString()}</span>
              </div>
              {unpaidLeaves > 0 && (
                <div className="flex justify-between items-center bg-[rgba(231,76,60,0.06)] p-3 rounded-xl border border-[var(--color-danger)]/30">
                  <span className="text-[var(--color-danger)] font-medium text-xs flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    LOP Deduction ({unpaidLeaves} days)
                  </span>
                  <span className="font-bold text-xs text-[var(--color-danger)]">- ₹{lopDeduction.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="border-t border-[var(--color-border)] my-1"></div>

            {/* Final Net Pay & Generation Box */}
            <div className="flex justify-between items-center bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 p-4 rounded-xl">
              <div>
                <div className="text-xs font-bold text-[var(--color-primary)] uppercase">Net Payable Salary</div>
                <div className="text-[10px] text-[var(--color-foreground-muted)]">Ready for final payroll generation</div>
              </div>
              <div className="text-lg font-extrabold text-[var(--color-primary)]">
                ₹{netPay.toLocaleString()}
              </div>
            </div>

          </div>

          {/* Footer Actions / Generate Payroll */}
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[var(--color-secondary)] text-[var(--color-foreground)] hover:bg-[var(--color-border)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(record.id);
                onClose();
              }}
              className="btn-primary px-5 py-2.5 text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Generate Payroll</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PayrollReviewModal;