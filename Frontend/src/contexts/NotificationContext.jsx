import { createContext, useState, useCallback, useEffect } from "react";
import * as notificationService from "../features/notifications/services/notificationService";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");
      const all = await notificationService.getAllNotifications();
      setNotifications(all);
      setUnreadCount(all.filter((n) => !n.isRead && !n.isArchived).length);
      return all;
    } catch (requestError) {
      setNotifications([]);
      setUnreadCount(0);
      setError(requestError.message || "Unable to load notifications.");
      return [];
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToast = useCallback((toast) => {
    const id = toast.id || `toast-${Date.now()}`;
    const entry = { ...toast, id };
    setToasts((prev) => [...prev, entry]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNotification = useCallback(
    async (notification) => {
      try {
        const saved = await notificationService.addNotification(notification);
        await refresh();

        addToast({
          title: notification.title,
          message: notification.message,
          type: notification.type || "info",
          duration: notification.toastDuration || 4000,
        });

        return saved;
      } catch (requestError) {
        setError(requestError.message || "Unable to create notification.");
        return null;
      }
    },
    [refresh, addToast]
  );

  const markAsRead = useCallback(
    async (id) => {
      try { await notificationService.markAsRead(id); await refresh(); return true; }
      catch (requestError) { setError(requestError.message || "Unable to update notification."); return false; }
    },
    [refresh]
  );

  const markAllAsRead = useCallback(async () => {
    try { await notificationService.markAllAsRead(); await refresh(); return true; }
    catch (requestError) { setError(requestError.message || "Unable to update notifications."); return false; }
  }, [refresh]);

  const archive = useCallback(
    async (id) => {
      try { await notificationService.archiveNotification(id); await refresh(); return true; }
      catch (requestError) { setError(requestError.message || "Unable to archive notification."); return false; }
    },
    [refresh]
  );

  const del = useCallback(
    async (id) => {
      try { await notificationService.deleteNotification(id); await refresh(); return true; }
      catch (requestError) { setError(requestError.message || "Unable to delete notification."); return false; }
    },
    [refresh]
  );

  const recentUnread = notifications
    .filter((n) => !n.isRead && !n.isArchived)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        unreadCount,
        recentUnread,
        addNotification,
        markAsRead,
        markAllAsRead,
        archive,
        deleteNotification: del,
        addToast,
        removeToast,
        refresh,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
