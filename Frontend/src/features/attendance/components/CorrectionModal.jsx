import { useState } from "react";
import { X } from "lucide-react";

const CorrectionModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    date: "",
    checkIn: "",
    checkOut: "",
    reason: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.checkIn >= form.checkOut) { setError("Check-out time must be after check-in time."); return; }
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } catch (requestError) { setError(requestError.message || "Unable to submit correction request."); } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-lg p-6 dropdown-enter">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="card-title">Request Attendance Correction</p>
            <p className="card-subtitle">Submit for HR / Manager approval</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:bg-background-elevated hover:text-primary"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date
            </label>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input w-full rounded-md px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Check In
              </label>
              <input
                required
                type="time"
                value={form.checkIn}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                className="input w-full rounded-md px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Check Out
              </label>
              <input
                required
                type="time"
                value={form.checkOut}
                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                className="input w-full rounded-md px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reason
            </label>
            <textarea
              required
              rows={4}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Explain the correction request…"
              className="input w-full rounded-md px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border bg-background-elevated px-4 py-2 text-sm font-semibold text-foreground hover:border-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-5 py-2 text-sm font-semibold transition-all hover:scale-105"
            >
              {submitting ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CorrectionModal;
