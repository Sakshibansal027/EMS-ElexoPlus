import { useState } from "react";
import { AlertTriangle, Lock, Unlock, X } from "lucide-react";

export const SalaryHoldModal = ({
  isOpen,
  onClose,
  employee,
  onHoldUpdated,
  reasonsOptions = [
    "Notice Period Audit Pending",
    "Missing / Unverified Bank Details",
    "Disciplinary / Performance Review",
    "Pending Exit Asset Clearance",
    "Compliance Document Missing",
  ],
}) => {
  const isCurrentlyOnHold =
    employee?.status === "On Hold" || employee?.status === "HOLD";

  const [reason, setReason] = useState(employee?.holdReason || reasonsOptions[0] || "");
  const [customNotes, setCustomNotes] = useState(employee?.holdNotes || "");
  const [loading, setLoading] = useState(false);



  if (!isOpen || !employee) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      empId: employee.id || employee.empId,
      isHold: !isCurrentlyOnHold,
      reason: !isCurrentlyOnHold ? reason : null,
      notes: !isCurrentlyOnHold ? customNotes : "Hold Released by HR",
      updatedAt: new Date().toISOString(),
    };

    try {
      if (onHoldUpdated) {
        await onHoldUpdated(payload);
      }
      onClose();
    } catch (err) {
      console.error("Failed to update salary hold state:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border ${
                isCurrentlyOnHold
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-500"
              }`}
            >
              {isCurrentlyOnHold ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                {isCurrentlyOnHold ? "Release Salary Hold" : "Place Salary on Hold"}
              </h3>
              <p className="text-xs text-zinc-400">
                {employee.name || employee.employeeName || "Employee"} (
                {employee.id || employee.empId || "N/A"})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {!isCurrentlyOnHold ? (
            <>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  Holding salary will exclude this employee from the current bank disbursal batch. Dues will carry forward to the next cycle.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Reason Code <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-400/50"
                  required
                >
                  {reasonsOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Audit Remarks / Notes
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Add details regarding why this salary is put on hold..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-400/50 h-20 resize-none"
                />
              </div>
            </>
          ) : (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <p className="text-xs text-zinc-400">Current Hold Reason:</p>
              <p className="text-xs font-semibold text-amber-400">
                {employee.holdReason || "Audit Pending"}
              </p>
              <p className="text-xs text-zinc-300 italic">
                "{employee.holdNotes || "N/A"}"
              </p>
              <p className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60">
                Releasing hold will include this employee's accumulated net pay in the active payout run.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
                isCurrentlyOnHold
                  ? "bg-emerald-500 hover:bg-emerald-600 text-zinc-950"
                  : "bg-rose-500 hover:bg-rose-600 text-white"
              }`}
            >
              {loading
                ? "Updating..."
                : isCurrentlyOnHold
                ? "Release Hold Now"
                : "Confirm Hold"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
