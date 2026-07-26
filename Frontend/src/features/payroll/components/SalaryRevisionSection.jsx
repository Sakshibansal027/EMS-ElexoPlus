import React, { useState } from "react";
import { Check, User, ChevronRight, X, Search, ArrowRight } from "lucide-react";

export const SalaryRevisionSection = ({ requests = [], onApprove, onReject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const displayedRequests = requests.slice(0, 3);

  // Filter requests based on search input inside the modal
  const filteredRequests = requests.filter(
    (req) =>
      req.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-primary">
              Salary Revision Requests
            </h2>
            {requests.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm("");
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
            Review and manage pending employee salary hike and promotion requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            {requests.length} Pending
          </span>
        </div>
      </div>

      <div className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {requests.length === 0 ? (
            <div className="col-span-full p-12 text-center text-[var(--color-foreground-muted)] font-medium bg-[var(--color-muted)]/20 rounded-xl border border-dashed border-[var(--color-border)]">
              No pending salary revision requests found.
            </div>
          ) : (
            displayedRequests.map((req) => (
              <RequestCard key={req.id} req={req} onApprove={onApprove} onReject={onReject} />
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
                  All Salary Revision Requests ({requests.length})
                </h3>
                <p className="text-xs text-[var(--color-foreground-muted)]">
                  Review and manage all pending employee requests in one place
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
                    className="bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-xs rounded-xl pl-9 pr-4 py-2 text-[var(--color-foreground)] focus:outline-none focus:border-purple-500 w-full sm:w-64"
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
              {filteredRequests.length === 0 ? (
                <div className="col-span-full p-12 text-center text-[var(--color-foreground-muted)] font-medium bg-[var(--color-muted)]/20 rounded-xl border border-dashed border-[var(--color-border)]">
                  No matching salary revision requests found.
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <RequestCard key={req.id} req={req} onApprove={onApprove} onReject={onReject} />
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

const RequestCard = ({ req, onApprove, onReject }) => (
  <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-purple-500/40 transition space-y-3 flex flex-col justify-between">
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] text-purple-400 font-bold flex items-center justify-center text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--color-foreground)]">{req.employeeName}</h4>
            <p className="text-[10px] text-[var(--color-foreground-muted)]">{req.department} • {req.requestedDate}</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-[var(--color-warning)]/10 text-[var(--color-warning)] font-semibold text-[10px] border border-[var(--color-warning)]/20">
          {req.reason}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[var(--color-muted)]/30 border border-[var(--color-border)]/50">
        <div>
          <span className="text-[10px] text-[var(--color-foreground-muted)] block font-semibold uppercase">Current</span>
          <span className="font-bold text-xs text-[var(--color-foreground)]">₹{req.currentSalary?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10px] text-[var(--color-foreground-muted)] block font-semibold uppercase">Requested</span>
          <span className="font-bold text-xs text-purple-400">₹{req.requestedSalary?.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]/50">
      <button
        onClick={() => onReject(req.id)}
        className="px-3 py-1.5 rounded-lg bg-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-500 font-bold transition cursor-pointer text-[var(--color-foreground)]"
      >
        Reject
      </button>
      <button
        onClick={() => onApprove(req.id)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white font-bold hover:bg-purple-700 transition cursor-pointer shadow-sm shadow-purple-500/20"
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" /> Approve
      </button>
    </div>
  </div>
);

export default SalaryRevisionSection;