import React from "react";
import { TrendingUp, Check, X } from "lucide-react";

export const SalaryRevisions = ({ revisions = [], onApprove, onReject, sectionRef }) => {
  return (
    <div ref={sectionRef} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[var(--color-foreground)] flex items-center gap-2">
          <TrendingUp className="text-purple-400" size={22} /> Salary Revision Requests
        </h2>
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {revisions.length} Pending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revisions.length === 0 ? (
          <p className="text-sm text-[var(--color-foreground-muted)] col-span-2 py-6 text-center card bg-[var(--color-background-elevated)] rounded-2xl">
            No pending salary revision requests.
          </p>
        ) : (
          revisions.map((item) => (
            <div key={item.id} className="card p-5 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[var(--color-foreground)]">{item.employeeName}</h3>
                  <p className="text-xs text-[var(--color-foreground-muted)]">{item.department}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-[var(--color-secondary)] rounded-md font-medium text-[var(--color-foreground-muted)]">
                  {item.requestedDate}
                </span>
              </div>

              <div className="flex items-center justify-between bg-[var(--color-secondary)]/50 p-3 rounded-xl text-sm">
                <div>
                  <span className="text-xs text-[var(--color-foreground-muted)] block">Current</span>
                  <span className="font-semibold text-[var(--color-foreground)]">₹{item.currentSalary}</span>
                </div>
                <span className="text-[var(--color-primary)] font-bold">➔</span>
                <div>
                  <span className="text-xs text-[var(--color-foreground-muted)] block">Requested</span>
                  <span className="font-semibold text-purple-400">₹{item.requestedSalary}</span>
                </div>
              </div>

              <p className="text-xs text-[var(--color-foreground-muted)]">
                <strong className="text-[var(--color-foreground)]">Reason:</strong> {item.reason}
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                <button
                  onClick={() => onReject(item.id)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[var(--color-danger)]/30 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition flex items-center gap-1 cursor-pointer"
                >
                  <X size={14} /> Reject
                </button>
                <button
                  onClick={() => onApprove(item.id)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--color-success)] text-white hover:opacity-90 transition flex items-center gap-1 cursor-pointer"
                >
                  <Check size={14} /> Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SalaryRevisions;