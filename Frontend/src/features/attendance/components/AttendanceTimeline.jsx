import StatusBadge from "./StatusBadge";
import { formatHours } from "../utils/date";

const AttendanceTimeline = ({ records }) => (
  <div className="card p-6">
    <p className="card-title">Recent Attendance</p>
    <p className="card-subtitle">Last activities</p>
    <div className="mt-5 space-y-3">
      {records.slice(0, 6).map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between rounded-lg border border-border bg-background-elevated p-4 transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3">
            <div className="avatar !h-10 !w-10 text-xs">{r.avatar}</div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {new Date(r.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {r.checkIn
                  ? `${new Date(r.checkIn).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} → ${
                      r.checkOut
                        ? new Date(r.checkOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"
                    }`
                  : r.remarks || "No activity"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-semibold text-primary md:inline">
              {formatHours(r.workingHours)}
            </span>
            <StatusBadge status={r.status} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AttendanceTimeline;
