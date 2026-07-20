import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { NOTIFICATION_TONE, NOTIFICATION_BG } from "../../features/notifications/config/notificationTypes";

const ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const Toast = ({ id, title, message, type = "info", onDismiss }) => {
  const Icon = ICONS[type] || Info;

  return (
    <div
      className="
        glass
        card
        flex
        w-96
        items-start
        gap-3
        p-4
        shadow-lg
        animate-slideIn
      "
      role="alert"
    >
      <div
        className={`
          flex-shrink-0 rounded-full p-1.5
          ${NOTIFICATION_BG[type]}
        `}
      >
        <Icon size={16} className="text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {message && (
          <p className="mt-0.5 text-xs text-foreground-muted">{message}</p>
        )}
      </div>

      <button
        onClick={() => onDismiss(id)}
        className="
          flex-shrink-0 rounded-full p-1
          text-muted-foreground
          transition-colors
          hover:bg-card-hover hover:text-foreground
        "
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
