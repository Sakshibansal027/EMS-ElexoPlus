import React, { useState } from "react";
import { CalendarX, CheckCircle, Search, X, ArrowRight } from "lucide-react";

export const LopCases = ({ lopCases = [], onResolve, sectionRef }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  // Filter for main view (only top 3)
  const displayedCases = lopCases.slice(0, 3);

  // Filter for modal view based on modal search query
  const filteredModalCases = lopCases.filter((item) =>
    item.employeeName.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    item.reason.toLowerCase().includes(modalSearchQuery.toLowerCase())
  );

  return (
    <div ref={sectionRef} className="space-y-5">
      
      {/* HEADER SECTION (Matching target layout reference) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-primary">
              Loss of Pay (LOP) Desk
            </h2>
            {lopCases.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center gap-1 cursor-pointer transition-all hover:bg-[var(--color-primary)]/20"
              >
                <span>View All</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
          <p className="text-sm text-[var(--color-foreground-muted)] mt-0.5">
            Review and resolve employee attendance penalty overrides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/20 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--color-danger)] animate-pulse"></span>
            {lopCases.length} Active Overrides
          </span>
        </div>
      </div>

      {/* Main Grid (Shows max 3 items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lopCases.length === 0 ? (
          <div className="col-span-full py-10 text-center card bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl space-y-2">
            <CalendarX size={32} className="mx-auto text-[var(--color-foreground-muted)] opacity-50" />
            <p className="text-sm font-medium text-[var(--color-foreground)]">No active LOP cases to resolve.</p>
          </div>
        ) : (
          displayedCases.map((item) => (
            <div
              key={item.id}
              className="card p-5 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl space-y-4 flex flex-col justify-between hover:border-[var(--color-primary)] transition-all shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-[var(--color-foreground)]">{item.employeeName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-secondary)] text-[var(--color-foreground-muted)]">
                    {item.department}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--color-secondary)]/50 p-3 rounded-xl space-y-1.5 text-xs border border-[var(--color-border)]/50">
                <div className="flex justify-between">
                  <span className="text-[var(--color-foreground-muted)]">Days Missed:</span>
                  <span className="font-bold text-[var(--color-danger)]">{item.daysMissed} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-foreground-muted)]">Deduction:</span>
                  <span className="font-bold text-[var(--color-foreground)]">₹{item.deductionAmount}</span>
                </div>
              </div>

              <p className="text-xs text-[var(--color-foreground-muted)] line-clamp-2">
                <strong className="text-[var(--color-foreground)]">Reason:</strong> {item.reason}
              </p>

              <div className="pt-2 border-t border-[var(--color-border)] flex justify-end">
                <button
                  onClick={() => onResolve(item.id)}
                  className="w-full py-2 text-xs font-bold rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <CheckCircle size={14} /> Resolve Case
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* VIEW ALL POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-secondary)]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-danger)]/10 text-[var(--color-danger)] flex items-center justify-center font-bold">
                  <CalendarX size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--color-foreground)]">All LOP Cases</h3>
                  <p className="text-xs text-[var(--color-foreground-muted)]">Manage and resolve all active attendance penalty cases.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--color-secondary)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] flex items-center justify-center transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Search Toolbar */}
            <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-background)]">
              <div className="flex items-center gap-3 bg-[var(--color-background-elevated)] px-3 py-2 rounded-xl border border-[var(--color-border)]">
                <Search size={16} className="text-[var(--color-foreground-muted)]" />
                <input
                  type="text"
                  placeholder="Search by employee name, department, or reason..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-[var(--color-foreground)] focus:outline-none placeholder:text-[var(--color-foreground-muted)]"
                />
                {modalSearchQuery && (
                  <button
                    onClick={() => setModalSearchQuery("")}
                    className="text-[10px] font-bold px-2 py-1 rounded-md bg-[var(--color-secondary)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Modal Scrollable List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1 divide-y divide-[var(--color-border)]/50">
              {filteredModalCases.length === 0 ? (
                <p className="text-center py-8 text-xs text-[var(--color-foreground-muted)]">No matching LOP cases found.</p>
              ) : (
                filteredModalCases.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[var(--color-foreground)]">{item.employeeName}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-secondary)] text-[var(--color-foreground-muted)]">
                          {item.department}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-foreground-muted)]">
                        <strong>Reason:</strong> {item.reason} ({item.daysMissed} Days Missed)
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-xs font-bold text-[var(--color-foreground)]">₹{item.deductionAmount}</span>
                      <button
                        onClick={() => {
                          onResolve(item.id);
                          if (lopCases.length <= 1) setIsModalOpen(false);
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--color-primary)] text-white hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <CheckCircle size={13} /> Resolve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-secondary)]/20 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--color-secondary)] text-[var(--color-foreground)] hover:border-[var(--color-primary)] border border-[var(--color-border)] transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LopCases;