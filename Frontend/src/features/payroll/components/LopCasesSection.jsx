import React, { useState } from "react";
import { CheckCircle, User, ChevronRight, X, Search } from "lucide-react";

export const LopCasesSection = ({ lopCases = [], onResolve }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const displayedCases = lopCases.slice(0, 3);

  // Filter LOP cases based on search input inside the modal
  const filteredCases = lopCases.filter(
    (item) =>
      item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center pb-4">
        <div>
          <h3 className="text-base font-bold text-primary tracking-wide">
            Loss of Pay (LOP) Cases
          </h3>
          <p className="text-xs text-[var(--color-foreground-muted)]">
            Manage attendance overrides, unapproved absences, and deduction adjustments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-[var(--color-danger)] border border-red-500/20">
            {lopCases.length} Employees
          </span>
          {lopCases.length > 3 && (
            <button
              onClick={() => {
                setSearchTerm("");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--color-warning)] text-black hover:opacity-90 transition cursor-pointer shadow-sm"
            >
              View All <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {lopCases.length === 0 ? (
            <div className="col-span-full p-12 text-center text-[var(--color-foreground-muted)] font-medium bg-[var(--color-muted)]/20 rounded-xl border border-dashed border-[var(--color-border)]">
              No active LOP cases found.
            </div>
          ) : (
            displayedCases.map((item) => (
              <LopCard key={item.id} item={item} onResolve={onResolve} />
            ))
          )}
        </div>
      </div>

      {/* VIEW ALL POPUP MODAL WITH SEARCH BAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-card)]">
              <div>
                <h3 className="text-base font-bold text-[var(--color-foreground)]">
                  All Loss of Pay (LOP) Cases ({lopCases.length})
                </h3>
                <p className="text-xs text-[var(--color-foreground-muted)]">
                  Review and manage all attendance overrides and deduction adjustments
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" />
                  <input 
                    type="text"
                    placeholder="Search employee or dept..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-xs rounded-xl pl-9 pr-4 py-2 text-[var(--color-foreground)] focus:outline-none focus:border-red-500 w-full sm:w-64"
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

            {/* Modal Body (Scrollable Grid) */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {filteredCases.length === 0 ? (
                <div className="col-span-full p-12 text-center text-[var(--color-foreground-muted)] font-medium bg-[var(--color-muted)]/20 rounded-xl border border-dashed border-[var(--color-border)]">
                  No matching LOP cases found.
                </div>
              ) : (
                filteredCases.map((item) => (
                  <LopCard key={item.id} item={item} onResolve={onResolve} />
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[var(--color-border)] bg-[var(--color-card)] flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground)] font-bold text-xs hover:opacity-80 transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

const LopCard = ({ item, onResolve }) => (
  <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-red-500/40 transition space-y-3 flex flex-col justify-between">
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] text-[var(--color-danger)] font-bold flex items-center justify-center text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--color-foreground)]">{item.employeeName}</h4>
            <p className="text-[10px] text-[var(--color-foreground-muted)]">{item.department}</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-[var(--color-danger)] font-semibold text-[10px] border border-red-500/20">
          {item.daysMissed} Days Missed
        </span>
      </div>

      <div className="p-2.5 rounded-lg bg-[var(--color-muted)]/30 border border-[var(--color-border)]/50 space-y-1.5">
        <div className="flex justify-between">
          <span className="text-[10px] text-[var(--color-foreground-muted)]">Reason:</span>
          <span className="font-medium text-[var(--color-foreground)]">{item.reason}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-[var(--color-foreground-muted)]">Deduction:</span>
          <span className="font-bold text-[var(--color-danger)]">₹{item.deductionAmount?.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div className="flex justify-end pt-2 border-t border-[var(--color-border)]/50">
      <button
        onClick={() => onResolve(item.id)}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-danger)] text-white font-bold hover:opacity-90 transition cursor-pointer shadow-sm text-xs"
      >
        <CheckCircle className="w-3.5 h-3.5" /> Resolve / Override
      </button>
    </div>
  </div>
);

export default LopCasesSection;