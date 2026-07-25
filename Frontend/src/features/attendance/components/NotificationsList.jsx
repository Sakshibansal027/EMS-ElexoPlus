import { Bell } from "lucide-react";
import { AttendanceEmpty } from "./AttendanceStates";

// Presentational only — data is provided by the parent page via the
// `notifications` prop (fed from attendanceService). Never import mock data
// directly inside components.

const TONE = {
  success: "text-[#2ecc71]",
  warning: "text-[#ffbf00]",
  info: "text-[#4dabf7]",
};

const NotificationsList = ({ notifications = [] }) => (
  <div className="card p-6">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="card-title">Notifications</p>
        <p className="card-subtitle">Latest attendance updates</p>
      </div>
      <Bell size={18} className="text-primary" />
    </div>

    {notifications.length === 0 ? (
      <AttendanceEmpty
        title="You're all caught up"
        description="No new attendance notifications right now."
      />
    ) : (
      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="rounded-lg border border-border bg-background-elevated p-3 transition-all hover:border-primary hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className={`text-sm font-semibold ${
                  TONE[n.type] || "text-foreground"
                }`}
              >
                {n.title}
              </p>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {n.time}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default NotificationsList;
