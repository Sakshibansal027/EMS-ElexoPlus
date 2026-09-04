import { createContext, useState, useCallback, useEffect } from "react";
import * as notificationService from "../features/notifications/services/notificationService";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    const all = await notificationService.getAllNotifications();
    setNotifications(all);
    setUnreadCount(all.filter((n) => !n.isRead && !n.isArchived).length);
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
      const saved = await notificationService.addNotification(notification);
      await refresh();

      addToast({
        title: notification.title,
        message: notification.message,
        type: notification.type || "info",
        duration: notification.toastDuration || 4000,
      });

      return saved;
    },
    [refresh, addToast]
  );

  const markAsRead = useCallback(
    async (id) => {
      await notificationService.markAsRead(id);
      await refresh();
    },
    [refresh]
  );

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    await refresh();
  }, [refresh]);

  const archive = useCallback(
    async (id) => {
      await notificationService.archiveNotification(id);
      await refresh();
    },
    [refresh]
  );

  const del = useCallback(
    async (id) => {
      await notificationService.deleteNotification(id);
      await refresh();
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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
