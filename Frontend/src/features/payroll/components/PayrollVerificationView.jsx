import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ArrowRight,
  X
} from "lucide-react";
import payrollService from "../services/payrollService";

export const PayrollVerificationView = ({
  pendingRecords: propPendingRecords,
  handleFinalProcess: propHandleFinalProcess,
}) => {
  const [internalPendingRecords, setInternalPendingRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (!propPendingRecords) {
      payrollService.getPayrollRecords().then((res) => {
        const records = res.data || res || [];
        const pending = records.filter(
          (rec) => String(rec.status).toLowerCase() !== "processed"
        );
        setInternalPendingRecords(pending);
      });
    }
  }, [propPendingRecords]);

  const pendingRecords = (propPendingRecords && propPendingRecords.length > 0) ? propPendingRecords : internalPendingRecords;
  const handleFinalProcess = propHandleFinalProcess || ((id) => {
    payrollService.processPayroll(id);
    setInternalPendingRecords((prev) => prev.filter((r) => r.id !== id));
    setSelectedRecord(null);
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");

  const displayedRecords = pendingRecords.slice(0, 3);

  const filteredModalRecords = pendingRecords.filter(
    (record) =>
      record.employeeName?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      record.department?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      record.role?.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Component Internal Header with ShieldCheck */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-primary">
          	  Payroll Verification & Lock Desk
            </h2>
            {pendingRecords.length > 0 && (
              <button
                onClick={() => {
                  setModalSearchTerm("");
                  setIsModalOpen(true);
                }}
                className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center gap-1 cursor-pointer transition-all hover:bg-[var(--color-primary)]/20"
              >
                <span>View All</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
          <p className="text-sm text-[var(--color-foreground-muted)] mt-0.5">
            Verify employee salaries, review LOP/deductions, and lock cycles for final payout disbursement.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" />
            <input 
              type="text"
              placeholder="Search employee or dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-xs rounded-xl pl-9 pr-4 py-2 text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] w-64"
            />
          </div>
        </div>
      </div>

      {/* Main Content Table Container */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm w-full">
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-background-secondary)] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground-muted)]">
            Pending Verification Queue ({pendingRecords.length})
          </span>
          <span className="text-xs text-[var(--color-warning)] font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Action Required Before Final Lock
          </span>
        </div>

        {pendingRecords.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-[var(--color-success)] opacity-80" />
            <div className="text-sm font-bold text-[var(--color-foreground)]">All Payrolls Verified!</div>
            <p className="text-xs text-[var(--color-foreground-muted)]">No pending payroll records left for verification in this cycle.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)] overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-background-secondary)]/50 text-[11px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Pay Period</th>
                  <th className="p-4">Gross Earnings</th>
                  <th className="p-4">Net Payable</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-xs">
                {displayedRecords.map((record) => {
                  const gross = (record.basicSalary || 0) + (record.allowances || 0) + (record.incentives || 0);
                  return (
                    <tr key={record.id} className="hover:bg-[var(--color-background-secondary)]/30 transition">
                      <td className="p-4">
                        <div className="font-bold text-[var(--color-foreground)]">{record.employeeName}</div>
                        <div className="text-[10px] text-[var(--color-foreground-muted)]">{record.role}</div>
                      </td>
                      <td className="p-4 text-[var(--color-foreground-muted)] font-medium">{record.department}</td>
                      <td className="p-4 text-[var(--color-foreground)] font-medium">{record.payPeriod}</td>
                      <td className="p-4 text-[var(--color-foreground)] font-semibold">₹{gross.toLocaleString()}</td>
                      <td className="p-4 text-[var(--color-primary)] font-extrabold">₹{(record.netPay || 0).toLocaleString()}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20">
                          {record.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="btn-primary px-3 py-1.5 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>Verify & Lock</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {/* VIEW ALL POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-background-secondary)]">
              <div>
                <h3 className="text-base font-bold text-[var(--color-foreground)]">
                  All Pending Verification Queue ({pendingRecords.length})
                </h3>
                <p className="text-xs text-[var(--color-foreground-muted)]">
                  Review and manage all pending payroll records in one place
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" />
                  <input 
                    type="text"
                    placeholder="Search employee or dept..."
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    className="bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-xs rounded-xl pl-9 pr-4 py-2 text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-64"
                  />
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg bg-[var(--color-muted)]/50 hover:bg-[var(--color-muted)] text-[var(--color-foreground)] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable Table) */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {filteredModalRecords.length === 0 ? (
                <div className="p-12 text-center text-[var(--color-foreground-muted)] font-medium bg-[var(--color-muted)]/20 rounded-xl border border-dashed border-[var(--color-border)] text-xs">
                  No matching payroll verification records found.
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)] overflow-x-auto w-full border border-[var(--color-border)] rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--color-background-secondary)]/50 text-[11px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider">
                        <th className="p-4">Employee</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Pay Period</th>
                        <th className="p-4">Gross Earnings</th>
                        <th className="p-4">Net Payable</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-xs">
                      {filteredModalRecords.map((record) => {
                        const gross = (record.basicSalary || 0) + (record.allowances || 0) + (record.incentives || 0);
                        return (
                          <tr key={record.id} className="hover:bg-[var(--color-background-secondary)]/30 transition">
                            <td className="p-4">
                              <div className="font-bold text-[var(--color-foreground)]">{record.employeeName}</div>
                              <div className="text-[10px] text-[var(--color-foreground-muted)]">{record.role}</div>
                            </td>
                            <td className="p-4 text-[var(--color-foreground-muted)] font-medium">{record.department}</td>
                            <td className="p-4 text-[var(--color-foreground)] font-medium">{record.payPeriod}</td>
                            <td className="p-4 text-[var(--color-foreground)] font-semibold">₹{gross.toLocaleString()}</td>
                            <td className="p-4 text-[var(--color-primary)] font-extrabold">₹{(record.netPay || 0).toLocaleString()}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20">
                                {record.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setIsModalOpen(false);
                                }}
                                className="btn-primary px-3 py-1.5 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <span>Verify & Lock</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)] flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-secondary)] text-[var(--color-foreground)] font-bold text-xs hover:bg-[var(--color-border)] transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Verification & Lock Modal Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[10020] overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedRecord(null)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[var(--color-card)] border-l border-[var(--color-border)] shadow-2xl flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background-secondary)]">
                <div>
                  <h2 className="text-base font-bold text-[var(--color-primary)] flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Salary Lock & Verification
                  </h2>
                  <p className="text-[11px] text-[var(--color-foreground-muted)] mt-0.5">
                    {selectedRecord.employeeName} • ID: {selectedRecord.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-foreground)] hover:bg-[var(--color-border)] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--color-background-secondary)] border border-[var(--color-border)] flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-foreground-muted)]">Basic Salary</span>
                    <span className="font-bold text-[var(--color-foreground)]">₹{selectedRecord.basicSalary?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-foreground-muted)]">Allowances</span>
                    <span className="font-bold text-[var(--color-foreground)]">+ ₹{selectedRecord.allowances?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-foreground-muted)]">Incentives</span>
                    <span className="font-bold text-[var(--color-success)]">+ ₹{selectedRecord.incentives?.toLocaleString() || 0}</span>
                  </div>
                  <div className="border-t border-[var(--color-border)] my-1"></div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-foreground-muted)]">Working Days / Worked</span>
                    <span className="font-bold text-[var(--color-foreground)]">{selectedRecord.daysWorked || 20} / {selectedRecord.totalWorkingDays || 22} Days</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[var(--color-primary)] uppercase">Final Net Payout</div>
                    <div className="text-[10px] text-[var(--color-foreground-muted)]">Verified & Ready to Lock</div>
                  </div>
                  <div className="text-base font-extrabold text-[var(--color-primary)]">
                    ₹{selectedRecord.netPay?.toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 flex gap-3 text-[11px] text-[var(--color-warning)]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Locking this payroll will freeze calculations and move the record to the final payout queue. This action cannot be undone easily.</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)] flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[var(--color-secondary)] text-[var(--color-foreground)] hover:bg-[var(--color-border)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleFinalProcess(selectedRecord.id)}
                  className="btn-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock & Final Process</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PayrollVerificationView;