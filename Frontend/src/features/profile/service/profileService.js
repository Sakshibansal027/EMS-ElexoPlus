import PROFILE_PERMISSIONS from "../config/profilePermissions";
import client from "../../../api/client";

export const getProfileData = async (role) => {
  const { data } = await client.get("/profile");
  return {
    profile: data.profile,
    permissions: PROFILE_PERMISSIONS[role] || {},
  };
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const { data } = await client.post("/profile/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
};

export const openProfileDocument = async (documentId, download = false) => {
  const response = await client.get(`/profile/documents/${documentId}/download`, { responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.target = download ? "_self" : "_blank";
  if (download) link.download = "profile-document";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
