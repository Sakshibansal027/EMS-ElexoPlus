import React from "react";
import { Wallet, Send, CheckCircle2, ArrowRight } from "lucide-react";

export const BankTransfers = ({ transfers = [], sectionRef, onViewAll }) => {
  const handleTransfer = (name) => {
    alert(`Initiating bank transfer batch for ${name}`);
  };

  return (
    <div ref={sectionRef} className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                Bank Transfer Dispach
              </h2>
              <button
                onClick={onViewAll}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-lg border border-[var(--color-primary)]/20 transition-all hover:bg-[var(--color-primary)]/20"
              >
                <span>View All</span>
                <ArrowRight size={12} />
              </button>
            </div>
            <p className="text-sm text-[var(--color-foreground-muted)] mt-0.5">
              Process and dispatch approved salary batches directly to bank accounts.
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
          {transfers.length} Batches Ready
        </span>
      </div>

      {/* Main Card Container */}
      <div className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-foreground-muted)] bg-[var(--color-secondary)]/40">
                <th className="p-4 pl-6">Employee</th>
                <th className="p-4">Account No</th>
                <th className="p-4">IFSC</th>
                <th className="p-4">Amount</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-sm">
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 rounded-full bg-[var(--color-secondary)]/50 text-[var(--color-foreground-muted)]">
                        <CheckCircle2 size={24} />
                      </div>
                      <p className="text-sm font-bold text-[var(--color-foreground)]">All dispatches completed</p>
                      <p className="text-xs text-[var(--color-foreground-muted)]">No pending bank transfers available right now.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transfers.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-[var(--color-secondary)]/20 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-[var(--color-foreground)] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-black uppercase">
                        {t.name ? t.name.charAt(0) : "E"}
                      </div>
                      <span>{t.name}</span>
                    </td>
                    <td className="p-4 font-mono text-xs text-[var(--color-foreground-muted)] tracking-wider">
                      {t.account}
                    </td>
                    <td className="p-4 font-mono text-xs text-[var(--color-foreground-muted)] tracking-wider">
                      {t.ifsc}
                    </td>
                    <td className="p-4 font-extrabold text-[var(--color-success)] text-base">
                      ₹{t.amount}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => alert(`Initiating bank transfer batch for ${t.name}`)}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--color-primary)] text-primary-foreground hover:opacity-90 active:scale-95 transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send size={13} />
                        <span>Dispatch</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BankTransfers;