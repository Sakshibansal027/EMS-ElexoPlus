import client from "../../../api/client";

const messageFor = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export const getAllNotifications = async () => {
  const { data } = await client.get("/notifications");
  if (!data?.success) throw new Error(data?.message || "Unable to load notifications.");
  return data.notifications || [];
};

export const getUnreadCount = async () => {
  const { data } = await client.get("/notifications/unread-count");
  if (!data?.success) throw new Error(data?.message || "Unable to load unread notification count.");
  return data.count || 0;
};

export const getRecentUnread = async (limit = 5) => {
  const { data } = await client.get("/notifications/recent-unread", { params: { limit } });
  if (!data?.success) throw new Error(data?.message || "Unable to load recent notifications.");
  return data.notifications || [];
};

export const markAsRead = async (id) => {
  const { data } = await client.patch(`/notifications/${id}/read`);
  if (!data?.success) throw new Error(data?.message || "Unable to mark notification as read.");
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await client.patch("/notifications/read-all");
  if (!data?.success) throw new Error(data?.message || "Unable to mark notifications as read.");
  return data;
};

export const archiveNotification = async (id) => {
  const { data } = await client.patch(`/notifications/${id}/archive`);
  if (!data?.success) throw new Error(data?.message || "Unable to archive notification.");
  return data;
};

export const addNotification = async (notification) => {
  try {
    const { data } = await client.post("/notifications", notification);
    if (!data?.success) throw new Error(data?.message || "Unable to create notification.");
    return data.notification;
  } catch (error) {
    throw new Error(messageFor(error, "Unable to create notification."));
  }
};

export const deleteNotification = async (id) => {
  const { data } = await client.delete(`/notifications/${id}`);
  if (!data?.success) throw new Error(data?.message || "Unable to delete notification.");
  return data;
};

export const filterNotifications = async ({
  category = "all",
  type = "all",
  status = "all",
  archived = false,
  search = "",
} = {}) => {
  const params = {};
  if (category !== "all") params.category = category;
  if (type !== "all") params.type = type;
  if (status !== "all") params.status = status;
  if (search.trim()) params.search = search;
  if (archived) params.archived = 1;
  try {
    const { data } = await client.get("/notifications", { params });
    if (!data?.success) throw new Error(data?.message || "Unable to filter notifications.");
    return data.notifications || [];
  } catch (error) {
    throw new Error(messageFor(error, "Unable to filter notifications."));
  }
};
