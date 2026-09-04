import client from "../../../api/client";

export const getAllNotifications = async () => {
  try {
    const { data } = await client.get("/notifications");
    return data.notifications || [];
  } catch {
    return [];
  }
};

export const getUnreadCount = async () => {
  try {
    const { data } = await client.get("/notifications/unread-count");
    return data.count || 0;
  } catch {
    return 0;
  }
};

export const getRecentUnread = async (limit = 5) => {
  try {
    const { data } = await client.get("/notifications/recent-unread", {
      params: { limit },
    });
    return data.notifications || [];
  } catch {
    return [];
  }
};

export const markAsRead = async (id) => {
  try {
    await client.patch(`/notifications/${id}/read`);
  } catch {
    // silently fail
  }
};

export const markAllAsRead = async () => {
  try {
    await client.patch("/notifications/read-all");
  } catch {
    // silently fail
  }
};

export const archiveNotification = async (id) => {
  try {
    await client.patch(`/notifications/${id}/archive`);
  } catch {
    // silently fail
  }
};

export const addNotification = async (notification) => {
  try {
    const { data } = await client.post("/notifications", notification);
    return data.notification;
  } catch {
    return null;
  }
};

export const deleteNotification = async (id) => {
  try {
    await client.delete(`/notifications/${id}`);
  } catch {
    // silently fail
  }
};

export const filterNotifications = async ({
  category = "all",
  type = "all",
  status = "all",
  search = "",
} = {}) => {
  try {
    const params = {};
    if (category !== "all") params.category = category;
    if (type !== "all") params.type = type;
    if (status !== "all") params.status = status;
    if (search.trim()) params.search = search;

    const { data } = await client.get("/notifications", { params });
    return data.notifications || [];
  } catch {
    return [];
  }
};
