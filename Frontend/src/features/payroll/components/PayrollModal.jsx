import React, { useState } from "react";
import { Eye, Download, X } from "lucide-react";
import PayslipModal from "./PayslipModal";

export const PayrollModal = ({ isOpen, onClose, records = [], processPayroll }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPayslipRecord, setSelectedPayslipRecord] = useState(null); // <-- State for Payslip Modal inside View All

  if (!isOpen) return null;

  const filteredRecords = records.filter((record) => {
    const matchesSearch = 
      record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="card w-full max-w-5xl max-h-[90vh] flex flex-col bg-[var(--color-background-elevated)] border border-[var(--color-border)] shadow-2xl rounded-2xl overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">
              All Payroll Records
            </h2>
            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
              Complete disbursement list with search and filter controls
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-6 border-b border-[var(--color-border)] flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 px-4 py-2 rounded-xl bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-sm text-[var(--color-foreground)] focus:outline-none transition"
          />

          <div className="flex items-center gap-2 w-full md:w-auto">
            {["All", "Processed", "Pending"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  statusFilter === status
                    ? "bg-[var(--color-primary)] text-white font-bold shadow-md"
                    : "bg-[var(--color-secondary)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-border)]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="overflow-y-auto flex-1 custom-scrollbar p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted-foreground)]">
                <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider">Pay Period</th>
                <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider">Net Pay</th>
                <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-[var(--color-muted-foreground)] text-sm">
                    No matching payroll records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const initials = record.employeeName
                    ? record.employeeName.split(" ").map((n) => n[0]).join("").substring(0, 2)
                    : "EM";

                  return (
                    <tr key={record.id} className="hover:bg-[var(--color-card-hover)] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-light)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[var(--color-foreground)]">
                              {record.employeeName}
                            </div>
                            <div className="text-xs text-[var(--color-foreground-muted)]">
                              {record.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[var(--color-foreground-muted)]">
                        {record.department}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[var(--color-foreground-muted)]">
                        {record.payPeriod}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold text-[var(--color-foreground)]">
                        ₹{record.netPay?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        {record.status === "Processed" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                            Processed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            Pending
                          </span>
                        )}
                      </td>
                      
                      {/* ACTION BUTTONS (View, Download, Process) */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {record.status === "Pending" && (
                            <button
                              onClick={() => processPayroll(record.id)}
                              className="px-2.5 py-1 text-xs font-bold rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 transition cursor-pointer"
                            >
                              Process
                            </button>
                          )}

                          {/* View Payslip Button */}
                          <button
                            onClick={() => setSelectedPayslipRecord(record)}
                            className="px-2.5 py-1 text-xs font-bold rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] transition cursor-pointer flex items-center gap-1"
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

      {/* Nested Payslip Letterhead Modal */}
      {selectedPayslipRecord && (
        <PayslipModal
          data={selectedPayslipRecord}
          onClose={() => setSelectedPayslipRecord(null)}
        />
      )}
    </div>
  );
};