import { Bell } from "lucide-react";
import { ATTENDANCE_NOTIFICATIONS } from "../mock/notifications";

const TONE = {
  success: "text-[#2ecc71]",
  warning: "text-[#ffbf00]",
  info: "text-[#4dabf7]",
};

const NotificationsList = () => (
  <div className="card p-6">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="card-title">Notifications</p>
        <p className="card-subtitle">Latest attendance updates</p>
      </div>
      <Bell size={18} className="text-primary" />
    </div>
    <ul className="space-y-3">
      {ATTENDANCE_NOTIFICATIONS.map((n) => (
        <li
          key={n.id}
          className="rounded-lg border border-border bg-background-elevated p-3 transition-all hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <p className={`text-sm font-semibold ${TONE[n.type] || "text-foreground"}`}>
              {n.title}
            </p>
            <span className="text-[11px] text-muted-foreground">{n.time}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default NotificationsList;
