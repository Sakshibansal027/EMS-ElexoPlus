import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  CheckCheck,
  Archive,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
  Bell,
} from "lucide-react";
import InlineLoader from "../../../components/common/InlineLoader";
import useNotifications from "../../../contexts/useNotifications";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_TONE,
  CATEGORY_OPTIONS,
  TYPE_OPTIONS,
} from "../config/notificationTypes";
import {
  filterNotifications,
} from "../services/notificationService";

const relativeTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { markAsRead, markAllAsRead, archive, deleteNotification, refresh, error: contextError } =
    useNotifications();

  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [viewArchived, setViewArchived] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      const all = await filterNotifications({ category, type, status, search, archived: viewArchived });
      setList(all);
    } catch (requestError) {
      setList([]);
      setError(requestError.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [category, type, status, search, viewArchived]);

  useEffect(() => { loadList(); }, [loadList, refresh]);

  const apply = async (action) => {
    setError("");
    const success = await action();
    if (success) await loadList();
  };

  const unreadInView = list.filter((n) => !n.isRead).length;

  return (
    <div className="page-enter">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="
              mb-3 flex items-center gap-2 text-sm
              text-muted-foreground transition-colors
              hover:text-foreground
            "
          >
            <ArrowLeft size={16} />
            Back
          </button>
        
          <p className="mt-1 text-lg text-foreground-muted">
            Stay <span className="text-primary">updated</span> with everything happening in your workspace
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewArchived((v) => !v)}
            className={`
              flex items-center gap-2 rounded-xl border px-4 py-2.5
              text-sm font-medium transition-all
              ${
                viewArchived
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }
            `}
          >
            <Archive size={16} />
            {viewArchived ? "Active" : "Archived"}
          </button>

          {!viewArchived && unreadInView > 0 && (
            <button
            onClick={() => apply(markAllAsRead)}
              className="
                flex items-center gap-2 rounded-xl border
                border-border px-4 py-2.5 text-sm
                font-medium text-muted-foreground transition-all
                hover:border-primary hover:text-foreground
              "
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              input w-full rounded-xl py-2.5 pl-10 pr-4
              text-sm outline-none transition-colors
              focus:border-primary
            "
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter size={16} className="text-muted-foreground" />

          <div className="w-36">
            <SelectDropdown
              value={category}
              onValueChange={setCategory}
              options={CATEGORY_OPTIONS}
              placeholder="Category"
            />
          </div>

          <div className="w-32">
            <SelectDropdown
              value={type}
              onValueChange={setType}
              options={TYPE_OPTIONS}
              placeholder="Type"
            />
          </div>

          <div className="w-32">
            <SelectDropdown
              value={status}
              onValueChange={setStatus}
              options={[
                { value: "all", label: "All Status" },
                { value: "unread", label: "Unread" },
                { value: "read", label: "Read" },
              ]}
              placeholder="Status"
            />
          </div>
        </div>
      </div>

      {(error || contextError) && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error || contextError}
        </p>
      )}

      {loading ? (
        <div className="card"><InlineLoader message="Loading notifications..." /></div>
      ) : list.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20">
          <Bell size={48} className="mb-4 text-muted-foreground/40" />
          <p className="text-lg font-medium text-foreground-muted">
            {viewArchived
              ? "No archived notifications"
              : "No notifications found"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {viewArchived
              ? "Archive notifications to see them here"
              : "You're all caught up!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((notif) => {
            const catConfig = NOTIFICATION_TYPES[notif.category] || NOTIFICATION_TYPES.system;
            const Icon = catConfig.icon;

            return (
              <div
                key={notif.id}
                className={`
                  card flex items-start gap-4 p-4 transition-all
                  ${
                    !notif.isRead
                      ? "border-l-[3px] border-l-primary"
                      : "border-l-[3px] border-l-transparent"
                  }
                `}
              >
                <div
                  className={`
                    flex-shrink-0 rounded-xl p-2.5
                    ${catConfig.bg}
                  `}
                >
                  <Icon size={18} className={catConfig.color} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <p
                        className={`
                          text-sm
                          ${!notif.isRead ? "font-semibold text-foreground" : "font-normal text-foreground-muted"}
                        `}
                      >
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                      {relativeTime(notif.createdAt)}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {notif.message}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    {notif.link && (
                      <button
                        onClick={() => navigate(notif.link)}
                        className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                      >
                        View details
                      </button>
                    )}

                    {!notif.isRead && (
                      <button
                        onClick={() => apply(() => markAsRead(notif.id))}
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Check size={12} />
                        Mark read
                      </button>
                    )}

                    {!notif.isArchived && (
                      <button
                        onClick={() => apply(() => archive(notif.id))}
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Archive size={12} />
                        Archive
                      </button>
                    )}

                    <button
                      onClick={() => {
                        apply(() => deleteNotification(notif.id));
                      }}
                      className="flex items-center gap-1 text-xs text-danger/60 transition-colors hover:text-danger"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
