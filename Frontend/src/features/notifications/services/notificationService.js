const STORAGE_KEY = "elexoplus_notifications";

const load = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const save = (notifications) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

export const getAllNotifications = () => load();

export const getUnreadCount = () => {
  return load().filter((n) => !n.isRead && !n.isArchived).length;
};

export const getRecentUnread = (limit = 5) => {
  return load()
    .filter((n) => !n.isRead && !n.isArchived)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

export const markAsRead = (id) => {
  const list = load();
  const idx = list.findIndex((n) => n.id === id);
  if (idx !== -1) {
    list[idx].isRead = true;
    save(list);
  }
  return list;
};

export const markAllAsRead = () => {
  const list = load();
  list.forEach((n) => {
    if (!n.isRead) n.isRead = true;
  });
  save(list);
  return list;
};

export const archiveNotification = (id) => {
  const list = load();
  const idx = list.findIndex((n) => n.id === id);
  if (idx !== -1) {
    list[idx].isArchived = true;
    save(list);
  }
  return list;
};

export const addNotification = (notification) => {
  const list = load();
  const newNotif = {
    id: `n${Date.now()}`,
    isRead: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
    ...notification,
  };
  list.unshift(newNotif);
  save(list);
  return newNotif;
};

export const deleteNotification = (id) => {
  const list = load().filter((n) => n.id !== id);
  save(list);
  return list;
};

export const filterNotifications = ({
  category = "all",
  type = "all",
  status = "all",
  search = "",
} = {}) => {
  let list = load().filter((n) => !n.isArchived);

  if (category !== "all") {
    list = list.filter((n) => n.category === category);
  }
  if (type !== "all") {
    list = list.filter((n) => n.type === type);
  }
  if (status === "unread") {
    list = list.filter((n) => !n.isRead);
  } else if (status === "read") {
    list = list.filter((n) => n.isRead);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
    );
  }

  return list.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};
