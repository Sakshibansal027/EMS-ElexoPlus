import React, { useMemo, useState } from "react";
import { Download, Eye, LoaderCircle, X } from "lucide-react";
import PayslipModal from "./payslipModal.jsx";

const currency = (value) => "₹" + Number(value || 0).toLocaleString("en-IN");

const nextAction = (record, actions) => {
  if (record.status === "Draft" && actions.onProcess) return ["Process", () => actions.onProcess(record.id)];
  if (record.status === "Processing" && record.verificationStatus === "Pending" && actions.onVerify) {
    return ["Verify", () => actions.onVerify(record.id)];
  }
  if (record.status === "Processing" && record.verificationStatus === "Verified" && actions.onApprove) {
    return ["Approve", () => actions.onApprove(record.id)];
  }
  if (record.status === "Approved" && actions.onPay) return ["Mark Paid", () => actions.onPay(record.id)];
  return null;
};

export const PayrollModal = ({
  isOpen,
  onClose,
  records = [],
  onProcess,
  onVerify,
  onApprove,
  onPay,
  onViewRecord,
  onDownloadPayslip,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPayslipData, setSelectedPayslipData] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(records.map((record) => record.status).filter(Boolean)))],
    [records],
  );

  if (!isOpen) return null;

  const filteredRecords = records.filter((record) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      record.employeeName?.toLowerCase().includes(search) ||
      record.department?.toLowerCase().includes(search) ||
      record.employeeCode?.toLowerCase().includes(search);
    return matchesSearch && (statusFilter === "All" || record.status === statusFilter);
  });

  const openRecord = async (record) => {
    setBusyId(record.id);
    setError("");
    try {
      const detail = onViewRecord ? await onViewRecord(record.id) : { payslipData: record };
      setSelectedPayslipData(detail?.payslipData || detail?.payroll || record);
    } catch (requestError) {
      setError(requestError?.message || "Unable to load this payroll.");
    } finally {
      setBusyId(null);
    }
  };

  const download = async (record) => {
    setBusyId(record.id);
    setError("");
    try {
      let payload = record;
      if (!payload.payslipId && onViewRecord) {
        const detail = await onViewRecord(record.id);
        payload = detail?.payslip || detail?.payslipData || record;
      }
      await onDownloadPayslip?.(payload);
    } catch (requestError) {
      setError(requestError?.message || "No generated payslip is available for this payroll.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="card w-full max-w-5xl max-h-[90vh] flex flex-col bg-[var(--color-background-elevated)] border border-[var(--color-border)] shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-xl font-bold">All Payroll Records</h2>
            <p className="mt-0.5 text-xs text-[var(--color-foreground-muted)]">
              Search and act on live payroll records.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl bg-[var(--color-secondary)]">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 border-b border-[var(--color-border)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Search name, employee code, or department..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-xl bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={
                  "px-3 py-1.5 rounded-full text-xs font-semibold " +
                  (statusFilter === status
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-secondary)] text-[var(--color-foreground-muted)]")
                }
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mx-5 mt-4 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300">{error}</div>}

        <div className="overflow-y-auto flex-1 p-5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted-foreground)]">
                <th className="px-3 py-3 text-xs uppercase">Employee</th>
                <th className="px-3 py-3 text-xs uppercase">Period</th>
                <th className="px-3 py-3 text-xs uppercase">Net Pay</th>
                <th className="px-3 py-3 text-xs uppercase">Status</th>
                <th className="px-3 py-3 text-right text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 py-12 text-center text-sm text-[var(--color-foreground-muted)]">
                    No matching payroll records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const action = nextAction(record, { onProcess, onVerify, onApprove, onPay });
                  const busy = busyId === record.id;
                  return (
                    <tr key={record.id}>
                      <td className="px-3 py-3">
                        <p className="text-sm font-semibold">{record.employeeName}</p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">{record.employeeCode}</p>
                      </td>
                      <td className="px-3 py-3 text-sm">{record.payPeriod}</td>
                      <td className="px-3 py-3 text-sm font-bold">{currency(record.netPay)}</td>
                      <td className="px-3 py-3 text-xs">{record.status}</td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-2">
                          {action && (
                            <button type="button" onClick={action[1]} className="btn-primary px-2 py-1 text-xs">
                              {action[0]}
                            </button>
                          )}
                          <button type="button" onClick={() => openRecord(record)} disabled={busy} className="p-1.5 rounded bg-[var(--color-secondary)]">
                            {busy ? <LoaderCircle size={13} className="animate-spin" /> : <Eye size={13} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => download(record)}
                            disabled={busy || record.status !== "Paid"}
                            className="p-1.5 rounded bg-[var(--color-secondary)] disabled:opacity-40"
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

      {selectedPayslipData && <PayslipModal data={selectedPayslipData} onClose={() => setSelectedPayslipData(null)} />}
    </div>
  );
};

export default PayrollModal;
