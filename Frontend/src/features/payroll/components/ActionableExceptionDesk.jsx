import { useState, useEffect } from "react";
import { Check, X, ArrowRight, X as CloseIcon } from "lucide-react";
import { getLopImpactTextColor } from "../utils/payroll";

const ActionableExceptionsDesk = ({ items = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Main Dashboard Table only shows top 3 items
  const mainDashboardItems = items.slice(0, 3);

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      {/* 1. MAIN CARD (In Dashboard Layout) */}
      <div className="card p-5 shadow-md space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              ACTIONABLE EXCEPTION VERIFICATION DESK
            </h3>
            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
              Disputed LOP, Incentive Overlaps, and Prorated Overrides
            </p>
          </div>

          {/* Trigger Pop-Up Modal */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer"
          >
            View All {items.length} Items <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dashboard Compact Table (Only 3 rows) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/50 border-y border-[var(--color-border)] text-[10px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider">
                <th className="py-2.5 px-3">EMPLOYEE</th>
                <th className="py-2.5 px-3">DEPT</th>
                <th className="py-2.5 px-3">ISSUE DESCRIPTION</th>
                <th className="py-2.5 px-3">BASE PAY</th>
                <th className="py-2.5 px-3">LOP IMPACT</th>
                <th className="py-2.5 px-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/60 text-xs">
              {mainDashboardItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[var(--color-card-hover)] transition-colors group"
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-[var(--color-foreground)]">
                      {item.employeeName}
                    </div>
                    <div className="text-[10px] text-[var(--color-foreground-muted)] font-mono">
                      {item.empId}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[var(--color-foreground-muted)]">
                    {item.dept}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[var(--color-primary)]">
                    {item.issueDescription}
                  </td>
                  <td className="py-3 px-3 text-[var(--color-foreground)] font-medium">
                    {item.basePay}
                  </td>
                  <td className={`py-3 px-3 font-bold ${getLopImpactTextColor(item.lopImpact)}`}>
                    {item.lopImpact}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        disabled
                        className="p-1.5 rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-[var(--color-success)] opacity-80 cursor-default"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled
                        className="p-1.5 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)] opacity-80 cursor-default"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. POP-UP MODAL FOR ALL ITEMS */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-base font-bold text-[var(--color-primary)] uppercase tracking-wider">
                  ALL ACTIONABLE EXCEPTIONS ({items.length})
                </h2>
                <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
                  Complete list of payroll verification items for July 2026.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card-hover)] transition-colors cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Table Body */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[var(--color-background-elevated)] z-10">
                  <tr className="border-b border-[var(--color-border)] text-[10px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider">
                    <th className="py-2.5 px-3">EMPLOYEE</th>
                    <th className="py-2.5 px-3">DEPT</th>
                    <th className="py-2.5 px-3">ISSUE DESCRIPTION</th>
                    <th className="py-2.5 px-3">BASE PAY</th>
                    <th className="py-2.5 px-3">LOP IMPACT</th>
                    <th className="py-2.5 px-3 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/60 text-xs">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[var(--color-card-hover)] transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-[var(--color-foreground)]">
                          {item.employeeName}
                        </div>
                        <div className="text-[10px] text-[var(--color-foreground-muted)] font-mono">
                          {item.empId}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[var(--color-foreground-muted)]">
                        {item.dept}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[var(--color-primary)]">
                        {item.issueDescription}
                      </td>
                      <td className="py-3 px-3 text-[var(--color-foreground)] font-medium">
                        {item.basePay}
                      </td>
                      <td className={`py-3 px-3 font-bold ${getLopImpactTextColor(item.lopImpact)}`}>
                        {item.lopImpact}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            disabled
                            className="p-1.5 rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-[var(--color-success)] opacity-80 cursor-default"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled
                            className="p-1.5 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)] opacity-80 cursor-default"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--color-border)] flex justify-end bg-[var(--color-muted)]/30">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="input hover:bg-[var(--color-card-hover)] px-4 py-2 text-xs font-semibold text-[var(--color-foreground)] rounded-xl transition-all cursor-pointer"
              >
                Close Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionableExceptionsDesk;
