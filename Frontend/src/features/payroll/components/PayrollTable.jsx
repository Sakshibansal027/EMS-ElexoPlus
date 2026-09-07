import React, { useEffect, useMemo, useState } from "react";
import { Download, Eye, ArrowRight, LoaderCircle } from "lucide-react";
import { CustomDropdown } from "./ui/CustomDropdown";
import { PayrollModal } from "./PayrollModal";
import PayslipModal from "./PayslipModal";
import InlineLoader from "../../../components/common/InlineLoader";

const currency = (value) => "₹" + Number(value || 0).toLocaleString("en-IN");

const statusClass = (status) => {
  if (status === "Paid") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (status === "Approved") return "bg-sky-500/10 text-sky-400 border-sky-500/20";
  if (status === "Processing") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-zinc-500/10 text-zinc-300 border-zinc-500/20";
};

const actionFor = (record, actions = {}) => {
  if (record.status === "Draft" && actions.onProcess) {
    return { label: "Process", run: () => actions.onProcess(record.id) };
  }
  if (
    record.status === "Processing" &&
    record.verificationStatus === "Pending" &&
    actions.onVerify
  ) {
    return { label: "Verify", run: () => actions.onVerify(record.id) };
  }
  if (
    record.status === "Processing" &&
    record.verificationStatus === "Verified" &&
    actions.onApprove
  ) {
    return { label: "Approve", run: () => actions.onApprove(record.id) };
  }
  if (record.status === "Approved" && actions.onPay) {
    return { label: "Mark Paid", run: () => actions.onPay(record.id) };
  }
  return null;
};

const sortedPeriods = (records) =>
  Array.from(new Set(records.map((record) => record.payPeriod).filter(Boolean))).sort((left, right) => {
    const leftRecord = records.find((record) => record.payPeriod === left);
    const rightRecord = records.find((record) => record.payPeriod === right);
    return (
      (rightRecord?.payrollYear || 0) * 12 +
      (rightRecord?.payrollMonth || 0) -
      ((leftRecord?.payrollYear || 0) * 12 + (leftRecord?.payrollMonth || 0))
    );
  });

export const PayrollTable = ({
  records = [],
  loading = false,
  error = null,
  refetch,
  limit = 4,
  onProcess,
  onVerify,
  onApprove,
  onPay,
  onViewRecord,
  onDownloadPayslip,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("All periods");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayslipData, setSelectedPayslipData] = useState(null);
  const [viewLoadingId, setViewLoadingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const periods = useMemo(() => sortedPeriods(records), [records]);
  const periodOptions = useMemo(() => ["All periods", ...periods], [periods]);

  useEffect(() => {
    if (selectedPeriod !== "All periods" && !periods.includes(selectedPeriod)) {
      setSelectedPeriod("All periods");
    }
  }, [periods, selectedPeriod]);

  const periodFilteredRecords = records.filter(
    (record) => selectedPeriod === "All periods" || record.payPeriod === selectedPeriod,
  );
  const displayedRecords = limit ? periodFilteredRecords.slice(0, limit) : periodFilteredRecords;

  const openPayslip = async (record) => {
    setActionError("");
    setViewLoadingId(record.id);
    try {
      const detail = onViewRecord ? await onViewRecord(record.id) : { payslipData: record };
      setSelectedPayslipData(detail?.payslipData || detail?.payroll || record);
    } catch (requestError) {
      setActionError(requestError?.message || "Unable to load this payroll record.");
    } finally {
      setViewLoadingId(null);
    }
  };

  const downloadPayslip = async (record) => {
    setActionError("");
    setViewLoadingId(record.id);
    try {
      let payload = record;
      if (!payload.payslipId && onViewRecord) {
        const detail = await onViewRecord(record.id);
        payload = detail?.payslip || detail?.payslipData || record;
      }
      await onDownloadPayslip?.(payload);
    } catch (requestError) {
      setActionError(requestError?.message || "A payslip is available only after this payroll is paid.");
    } finally {
      setViewLoadingId(null);
    }
  };

  const runAction = async (action) => {
    setActionError("");
    try {
      await action.run();
    } catch (requestError) {
      setActionError(requestError?.message || "Unable to update this payroll.");
    }
  };

  if (loading) {
    return (
      <div className="card p-10">
        <InlineLoader message="Loading payroll records..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-5 flex items-center justify-between gap-4 border border-red-500/30 text-red-400">
        <span className="text-sm">{error}</span>
        {refetch && (
          <button type="button" onClick={refetch} className="btn-primary px-3 py-1.5 text-xs">
            Retry
          </button>
        )}
      </div>
    );
  }

  const actionProps = { onProcess, onVerify, onApprove, onPay, onViewRecord, onDownloadPayslip };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">Payroll Records</h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 inline-flex items-center gap-1 cursor-pointer"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <p className="mt-0.5 text-sm text-[var(--color-foreground-muted)]">
            Live payroll records from the selected period.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-44">
            <CustomDropdown
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={periodOptions}
              placeholder="Select period"
            />
          </div>
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
            {periodFilteredRecords.length} records
          </span>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
          {actionError}
        </div>
      )}

      <div className="card overflow-hidden border border-[var(--color-border)] rounded-2xl bg-[var(--color-background-elevated)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border)] text-[var(--color-muted-foreground)]">
                <th className="px-6 py-4 text-xs font-bold uppercase">Employee</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Department</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Pay Period</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Net Pay</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-[var(--color-foreground-muted)]">
                    No payroll records found for this selection.
                  </td>
                </tr>
              ) : (
                displayedRecords.map((record) => {
                  const initials = record.employeeName
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const action = actionFor(record, actionProps);
                  const isBusy = viewLoadingId === record.id;

                  return (
                    <tr key={record.id} className="hover:bg-[var(--color-card-hover)]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center">
                            {initials || "EM"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{record.employeeName}</p>
                            <p className="text-xs text-[var(--color-foreground-muted)]">{record.employeeCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-foreground-muted)]">{record.department}</td>
                      <td className="px-6 py-4 text-sm text-[var(--color-foreground-muted)]">{record.payPeriod}</td>
                      <td className="px-6 py-4 text-sm font-bold">{currency(record.netPay)}</td>
                      <td className="px-6 py-4">
                        <span className={"inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold " + statusClass(record.status)}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {action && (
                            <button
                              type="button"
                              onClick={() => runAction(action)}
                              className="btn-primary px-2.5 py-1.5 text-xs font-bold"
                            >
                              {action.label}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openPayslip(record)}
                            disabled={isBusy}
                            className="p-1.5 rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-border)] disabled:opacity-50"
                            title="View payroll"
                          >
                            {isBusy ? <LoaderCircle size={13} className="animate-spin" /> : <Eye size={13} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadPayslip(record)}
                            disabled={isBusy || record.status !== "Paid"}
                            className="p-1.5 rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-border)] disabled:cursor-not-allowed disabled:opacity-40"
                            title={record.status === "Paid" ? "Download payslip" : "Payslip is generated after payment"}
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

      <PayrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        records={periodFilteredRecords}
        {...actionProps}
      />

      {selectedPayslipData && (
        <PayslipModal data={selectedPayslipData} onClose={() => setSelectedPayslipData(null)} />
      )}
    </div>
  );
};

export default PayrollTable;
