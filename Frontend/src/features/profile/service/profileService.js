import PROFILE_DATA from "../config/profileData";
import PROFILE_PERMISSIONS from "../config/profilePermissions";
import client from "../../../api/client";

export const getProfileData = async (role) => {
  const { data } = await client.get("/profile");
  return {
    profile: data.profile || PROFILE_DATA[role] || {},
    permissions: PROFILE_PERMISSIONS[role],
  };
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const { data } = await client.post("/profile/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
};
