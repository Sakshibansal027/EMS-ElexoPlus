import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Send, Wallet, X } from "lucide-react";

const currency = (value) => "₹" + Number(value || 0).toLocaleString("en-IN");

export const BankTransfers = ({
  transfers = [],
  sectionRef,
  onViewAll,
  onDispatch,
  dispatchingPayrollId,
}) => {
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [transactionReference, setTransactionReference] = useState("");
  const [error, setError] = useState("");

  const readyTransfers = transfers.filter(
    (transfer) => transfer.transferStatus === "Ready" && !transfer.isOnHold,
  );

  const openDispatch = (transfer) => {
    setError("");
    if (transfer.isOnHold) {
      setError("This employee has an active salary hold. Release it before dispatching a payout.");
      return;
    }
    if (transfer.transferStatus !== "Ready") {
      setError("This payroll transfer has already been dispatched.");
      return;
    }
    setSelectedTransfer(transfer);
    setTransactionReference("");
  };

  const dispatch = async (event) => {
    event.preventDefault();
    const reference = transactionReference.trim();
    if (!reference) {
      setError("Transaction reference is required for the payout audit trail.");
      return;
    }

    try {
      setError("");
      await onDispatch?.(selectedTransfer.payrollId, reference);
      setSelectedTransfer(null);
      setTransactionReference("");
    } catch (requestError) {
      setError(requestError?.message || "Unable to dispatch this bank transfer.");
    }
  };

  return (
    <>
      <div ref={sectionRef} className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                <Wallet size={19} /> Bank Transfer Dispatch
              </h2>
              {onViewAll && (
                <button
                  type="button"
                  onClick={onViewAll}
                  className="text-xs font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
                >
                  View all <ArrowRight size={12} />
                </button>
              )}
            </div>
            <p className="mt-0.5 text-sm text-[var(--color-foreground-muted)]">
              Dispatch approved salary payments using masked bank details only.
            </p>
          </div>
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
            {readyTransfers.length} batch{readyTransfers.length === 1 ? "" : "es"} ready
          </span>
        </div>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">{error}</div>}

        <div className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-foreground-muted)] bg-[var(--color-secondary)]/40">
                  <th className="p-4 pl-6">Employee</th>
                  <th className="p-4">Account No.</th>
                  <th className="p-4">IFSC</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-sm">
                {transfers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <CheckCircle2 size={24} className="text-[var(--color-success)]" />
                        <p className="text-sm font-bold">No approved payroll batches are waiting for bank dispatch.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transfers.slice(0, 5).map((transfer) => {
                    const dispatching = dispatchingPayrollId === transfer.payrollId;
                    const disabled = dispatching || transfer.isOnHold || transfer.transferStatus !== "Ready";

                    return (
                      <tr key={transfer.id} className="hover:bg-[var(--color-secondary)]/20">
                        <td className="p-4 pl-6">
                          <p className="font-bold">{transfer.name}</p>
                          <p className="text-xs text-[var(--color-foreground-muted)]">{transfer.employeeCode}</p>
                        </td>
                        <td className="p-4 font-mono text-xs text-[var(--color-foreground-muted)]">{transfer.account}</td>
                        <td className="p-4 font-mono text-xs text-[var(--color-foreground-muted)]">{transfer.ifsc}</td>
                        <td className="p-4 font-extrabold text-[var(--color-success)]">{currency(transfer.amount)}</td>
                        <td className="p-4">
                          <span className={transfer.isOnHold ? "text-xs text-red-400" : "text-xs text-[var(--color-foreground-muted)]"}>
                            {transfer.isOnHold ? "Salary hold" : transfer.transferStatus}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            type="button"
                            onClick={() => openDispatch(transfer)}
                            disabled={disabled}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--color-primary)] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 inline-flex items-center gap-1.5"
                          >
                            <Send size={13} />
                            {dispatching ? "Dispatching..." : "Dispatch"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={dispatch} className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-elevated)] p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">Dispatch payroll payout</h3>
                <p className="mt-1 text-xs text-[var(--color-foreground-muted)]">
                  {selectedTransfer.name} · {currency(selectedTransfer.amount)}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedTransfer(null)} className="p-1.5 rounded-lg bg-[var(--color-secondary)]">
                <X size={16} />
              </button>
            </div>
            <label className="block text-xs font-semibold mb-1.5">Bank transaction reference</label>
            <input
              required
              value={transactionReference}
              onChange={(event) => setTransactionReference(event.target.value)}
              placeholder="e.g. UTR / bank reference"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedTransfer(null)} className="px-4 py-2 text-xs font-semibold text-[var(--color-foreground-muted)]">
                Cancel
              </button>
              <button type="submit" className="btn-primary px-4 py-2 text-xs font-bold">
                Confirm dispatch
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default BankTransfers;
