import React, { useState, useEffect } from "react";
import { PayrollModal } from "./PayrollModal";
import { CustomDropdown } from "./ui/CustomDropdown"; 
import { PayrollReviewModal } from "./PayrollReviewModal";
import PayslipModal from "./PayslipModal";
import { Eye, Download, ArrowRight } from "lucide-react";
import payrollService from "../services/payrollService";

export const PayrollTable = ({
  records: propRecords,
  loading: propLoading = false,
  error: propError = null,
  processPayroll: propProcessPayroll,
  refetch: propRefetch,
  limit = 4,
}) => {
  const loading = propLoading;
  const error = propError;
  const refetch = propRefetch;
  const [internalRecords, setInternalRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("July 2026");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecordForReview, setSelectedRecordForReview] = useState(null);
  const [selectedPayslipRecord, setSelectedPayslipRecord] = useState(null);

  useEffect(() => {
    if (!propRecords || propRecords.length === 0) {
      payrollService.getPayrollRecords().then((res) => {
        setInternalRecords(res.data || res || []);
      });
    }
  }, [propRecords]);

  const records = (propRecords && propRecords.length > 0) ? propRecords : internalRecords;
  const processPayroll = propProcessPayroll || ((id) => {
    payrollService.processPayroll(id);
    setInternalRecords((prev) => prev.map((r) => r.id === id ? { ...r, status: "Processed" } : r));
  });

  const months = ["June 2026", "July 2026", "August 2026"];

  const monthFilteredRecords = records.filter(
    (record) => record.payPeriod === selectedMonth
  );

  const displayedRecords = limit
    ? monthFilteredRecords.slice(0, limit)
    : monthFilteredRecords;

  if (loading) {
    return (
      <div className="card p-10 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="caption text-[var(--color-foreground-muted)] font-medium">
          Loading payroll records...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-5 bg-[rgba(231,76,60,0.08)] border border-[var(--color-danger)] text-[var(--color-danger)] rounded-[var(--radius-lg)] flex justify-between items-center">
        <span>Failed to load records: {error}</span>
        <button onClick={refetch} className="px-4 py-1.5 bg-[var(--color-danger)] text-white text-xs font-bold rounded-[var(--radius-sm)]">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* HEADER SECTION (Matching Bank Transfer layout style) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">Payroll Records</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center gap-1 cursor-pointer transition-all hover:bg-[var(--color-primary)]/20"
              >
                <span>View All</span>
                <ArrowRight size={12} />
              </button>
            </div>
            <p className="text-sm text-[var(--color-foreground-muted)] mt-0.5">
              Manage and track salary disbursement records for {selectedMonth}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-40">
            <CustomDropdown
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val)}
              options={months}
              placeholder="Select Month"
            />
          </div>

          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
            {monthFilteredRecords.length} Records Found
          </span>
        </div>
      </div>

      {/* TABLE CARD CONTAINER */}
      <div className="card overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-md)] rounded-2xl bg-[var(--color-background-elevated)]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-background-secondary,#171717)] border-b border-[var(--color-border)] text-[var(--color-muted-foreground)]">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Pay Period</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Net Pay</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-card)]">
              {displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[var(--color-muted-foreground)] caption">
                    No payroll records found for {selectedMonth}.
                  </td>
                </tr>
              ) : (
                displayedRecords.map((record) => {
                  const initials = record.employeeName
                    ? record.employeeName.split(" ").map((n) => n[0]).join("").substring(0, 2)
                    : "EM";

                  return (
                    <tr key={record.id} className="hover:bg-[var(--color-card-hover)] transition-colors duration-150 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-light)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                              {record.employeeName}
                            </div>
                            <div className="caption text-xs text-[var(--color-foreground-muted)]">
                              {record.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[var(--color-foreground-muted)]">
                        {record.department}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[var(--color-foreground-muted)]">
                        {record.payPeriod}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[var(--color-foreground)]">
                        ₹{record.netPay?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {record.status === "Processed" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(46,204,113,0.12)] text-[var(--color-success)] border border-[rgba(46,204,113,0.25)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]"></span>
                            Processed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(255,191,0,0.12)] text-[var(--color-warning)] border border-[rgba(255,191,0,0.25)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]"></span>
                            Pending
                          </span>
                        )}
                      </td>
                      
                      {/* Action Column with Process, View, and Download options */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {record.status === "Pending" && (
                            <button
                              onClick={() => setSelectedRecordForReview(record)}
                              className="btn-primary px-2.5 py-1.5 text-xs font-bold shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-primary)] active:scale-95 transition-all duration-200 cursor-pointer"
                            >
                              Review & Process
                            </button>
                          )}

                          {/* View Payslip Button */}
                          <button
                            onClick={() => setSelectedPayslipRecord(record)}
                            className="px-2.5 py-1.5 text-xs font-bold rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] transition cursor-pointer flex items-center gap-1"
                            title="View Payslip Letterhead"
                          >
                            <Eye size={13} /> View
                          </button>

                          {/* Download Button */}
                          <button
                            onClick={() => alert(`Downloading payslip for ${record.employeeName}`)}
                            className="p-1.5 text-xs font-bold rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] transition cursor-pointer flex items-center justify-center"
                            title="Download Payslip"
                          >
                            <Download size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full View All Modal */}
      <PayrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        records={monthFilteredRecords}
        processPayroll={processPayroll}
      />

      {/* Salary Breakdown Review Modal */}
      <PayrollReviewModal
        isOpen={!!selectedRecordForReview}
        onClose={() => setSelectedRecordForReview(null)}
        record={selectedRecordForReview}
        onConfirm={(id) => {
          processPayroll(id);
          setSelectedRecordForReview(null);
        }}
      />

      {/* Payslip Letterhead Modal */}
      <PayslipModal
        data={selectedPayslipRecord}
        onClose={() => setSelectedPayslipRecord(null)}
      />
    </div>
  );
};

export default PayrollTable;