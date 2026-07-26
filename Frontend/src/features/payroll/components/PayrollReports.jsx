import React, { useState } from "react";
import { FileText, Download, Filter } from "lucide-react";

export const PayrollReports = ({ records = [] }) => {
  const reportsList = [
    { id: "monthly", title: "Monthly Payroll Report", desc: "Consolidated summary of all employee earnings and net pay." },
    { id: "department", title: "Department-wise Report", desc: "Breakdown of salary disbursements grouped by departments." },
    { id: "register", title: "Salary Register", desc: "Detailed ledger of basic salary, allowances, and deductions." },
    { id: "deduction", title: "Deduction Report", desc: "Summary of PF, professional tax, TDS, and other cuts." },
    { id: "incentive", title: "Incentive Report", desc: "Bonuses and performance incentives awarded this period." },
    { id: "lop", title: "LOP Report", desc: "Loss of Pay tracking and deductions due to leaves." },
  ];

  const handleDownloadReport = (title) => {
    alert(`Downloading ${title} as CSV/PDF...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
            Payroll Reports
          </h2>
          <p className="text-sm text-[var(--color-foreground-muted)] mt-0.5">
            Generate, analyze, and export comprehensive financial and compliance reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportsList.map((report) => (
          <div 
            key={report.id} 
            className="card p-5 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl flex flex-col justify-between hover:border-[var(--color-primary)] transition-all shadow-sm"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)] text-[var(--color-primary)] flex items-center justify-center font-bold mb-4">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-base text-[var(--color-foreground)] mb-1">
                {report.title}
              </h3>
              <p className="text-xs text-[var(--color-foreground-muted)] leading-relaxed">
                {report.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-foreground-muted)]">
                Format: CSV / PDF
              </span>
              <button
                onClick={() => handleDownloadReport(report.title)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} /> Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayrollReports;