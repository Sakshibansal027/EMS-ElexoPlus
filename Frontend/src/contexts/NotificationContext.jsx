import { createContext, useState, useCallback, useEffect } from "react";
import * as notificationService from "../features/notifications/services/notificationService";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(() => {
    const all = notificationService.getAllNotifications();
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
    (notification) => {
      const saved = notificationService.addNotification(notification);
      refresh();

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
    (id) => {
      const updated = notificationService.markAsRead(id);
      setNotifications(updated);
      setUnreadCount(updated.filter((n) => !n.isRead && !n.isArchived).length);
    },
    []
  );

  const markAllAsRead = useCallback(() => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
    setUnreadCount(0);
  }, []);

  const archive = useCallback((id) => {
    const updated = notificationService.archiveNotification(id);
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead && !n.isArchived).length);
  }, []);

  const del = useCallback((id) => {
    const updated = notificationService.deleteNotification(id);
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead && !n.isArchived).length);
  }, []);

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
