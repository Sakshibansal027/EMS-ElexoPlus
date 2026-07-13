import { Check, X } from "lucide-react";
import { CORRECTION_STATUS } from "../config/attendanceStatus";

const STATUS_TONE = {
  [CORRECTION_STATUS.PENDING]:
    "bg-[#ffbf00]/10 text-[#ffbf00] border-[#ffbf00]/30",
  [CORRECTION_STATUS.APPROVED]:
    "bg-[#2ecc71]/10 text-[#2ecc71] border-[#2ecc71]/30",
  [CORRECTION_STATUS.REJECTED]:
    "bg-[#e74c3c]/10 text-[#e74c3c] border-[#e74c3c]/30",
};

const CorrectionsTable = ({ requests, canApprove = false, onApprove, onReject }) => (
  <div className="card overflow-hidden">
    <div className="custom-scrollbar overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-background-elevated/60 text-[11px] uppercase tracking-wider text-muted-foreground">
            {["Request", "Employee", "Date", "Check In", "Check Out", "Reason", "Status"].map(
              (h) => (
                <th key={h} className="whitespace-nowrap px-4 py-4 font-semibold">
                  {h}
                </th>
              ),
            )}
            {canApprove && (
              <th className="px-4 py-4 text-right font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 && (
            <tr>
              <td
                colSpan={canApprove ? 8 : 7}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No correction requests.
              </td>
            </tr>
          )}
          {requests.map((r) => (
            <tr
              key={r.id}
              className="border-b border-border/60 transition-colors hover:bg-background-elevated/40"
            >
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {r.id}
              </td>
              <td className="px-4 py-3">
                <p className="font-semibold text-foreground">{r.employeeName}</p>
                <p className="text-xs text-muted-foreground">{r.department}</p>
              </td>
              <td className="whitespace-nowrap px-4 py-3">{r.date}</td>
              <td className="px-4 py-3">{r.requestedCheckIn}</td>
              <td className="px-4 py-3">{r.requestedCheckOut}</td>
              <td className="max-w-[280px] truncate px-4 py-3 text-xs text-muted-foreground">
                {r.reason}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_TONE[r.status]}`}
                >
                  {r.status}
                </span>
              </td>
              {canApprove && (
                <td className="px-4 py-3 text-right">
                  {r.status === CORRECTION_STATUS.PENDING ? (
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => onApprove?.(r)}
                        className="rounded-md p-2 text-muted-foreground hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => onReject?.(r)}
                        className="rounded-md p-2 text-muted-foreground hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default CorrectionsTable;
