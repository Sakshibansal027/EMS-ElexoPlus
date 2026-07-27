import React, { useState } from "react";
import { FileText, Download, Eye } from "lucide-react";
import { ReportPreviewModal } from "./reports/ReportPreviewModal";

export const PayrollReports = ({ records = [] }) => {
  const [selectedPreviewReport, setSelectedPreviewReport] = useState(null);

  const reportsList = [
    {
      id: "monthly",
      title: "Monthly Payroll Report",
      type: "monthly_trend",
      desc: "Consolidated summary of all employee earnings, net pay, and historical trends.",
      data: {
        month: "July 2026",
        employeeName: "Harshit Goel",
        employeeId: "EMP001",
        designation: "Sales Executive",
        department: "Sales",
        trendData: [
          { month: "Jan", netPay: 78000, gross: 88000 },
          { month: "Feb", netPay: 82000, gross: 92000 },
          { month: "Mar", netPay: 80000, gross: 90000 },
          { month: "Apr", netPay: 85000, gross: 95000 },
          { month: "May", netPay: 87000, gross: 97000 },
          { month: "Jun", netPay: 89900, gross: 99500 },
        ],
      },
    },
    {
      id: "department",
      title: "Department-wise Report",
      type: "target_achievement",
      desc: "Breakdown of salary disbursements and target achievements grouped by departments.",
      data: {
        month: "July 2026",
        employeeName: "All Departments",
        employeeId: "DEPT-SUMMARY",
        designation: "Department Overview",
        department: "Management",
        targetData: [
          { name: "Engineering", target: 4500000, achieved: 4200000, percentage: 93 },
          { name: "Sales", target: 3000000, achieved: 3150000, percentage: 105 },
          { name: "Operations", target: 1500000, achieved: 1400000, percentage: 93 },
        ],
      },
    },
    {
      id: "register",
      title: "Salary Register",
      type: "team_incentive",
      desc: "Detailed ledger of basic salary, allowances, incentives, and deductions.",
      data: {
        month: "July 2026",
        employeeName: "Harshit Goel",
        employeeId: "EMP001",
        designation: "Sales Executive",
        department: "Sales",
        incentives: [
          { name: "Quarterly Sales Target", amount: "₹15,000", status: "Approved" },
          { name: "Key Account Bonus", amount: "₹9,500", status: "Disbursed" },
        ],
      },
    },
    {
      id: "deduction",
      title: "Deduction Report",
      type: "perf_vs_inc",
      desc: "Summary of PF, professional tax, TDS, and statutory deduction cuts.",
      data: {
        month: "July 2026",
        employeeName: "Harshit Goel",
        employeeId: "EMP001",
        designation: "Sales Executive",
        department: "Sales",
        performanceData: [
          { month: "Jul 2026", performance: 92, incentive: 24500 },
        ],
      },
    },
    {
      id: "incentive",
      title: "Incentive Report",
      type: "team_incentive",
      desc: "Bonuses and performance incentives awarded to sales workforce this period.",
      data: {
        month: "July 2026",
        employeeName: "Sales Team",
        employeeId: "TEAM-SALES",
        designation: "Sales Force",
        department: "Sales",
        incentives: [
          { name: "Volume Sales Bonus", amount: "₹45,000", status: "Approved" },
          { name: "New Lead Conversion", amount: "₹28,000", status: "Approved" },
        ],
      },
    },
    {
      id: "lop",
      title: "LOP Report",
      type: "monthly_trend",
      desc: "Loss of Pay tracking and salary deductions due to unapproved leaves.",
      data: {
        month: "July 2026",
        employeeName: "LOP Exception Summary",
        employeeId: "LOP-JUL26",
        designation: "Compliance",
        department: "HR / Operations",
        trendData: [
          { month: "May", netPay: 12000, gross: 14000 },
          { month: "Jun", netPay: 8000, gross: 10000 },
          { month: "Jul", netPay: 9600, gross: 12000 },
        ],
      },
    },
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
            Generate, preview, analyze, and export comprehensive financial and compliance reports.
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

            <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedPreviewReport(report)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--color-secondary)] text-[var(--color-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-border)] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Eye size={13} /> Preview
              </button>

              <button
                type="button"
                onClick={() => handleDownloadReport(report.title)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} /> Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {selectedPreviewReport && (
        <ReportPreviewModal
          report={selectedPreviewReport}
          onClose={() => setSelectedPreviewReport(null)}
        />
      )}
    </div>
  );
};

export default PayrollReports;