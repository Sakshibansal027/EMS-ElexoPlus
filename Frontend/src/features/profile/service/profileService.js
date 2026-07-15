import PROFILE_DATA from "../config/profileData";
import PROFILE_PERMISSIONS from "../config/profilePermissions";

export const getProfileData = (role) => {
  return {
    profile: PROFILE_DATA[role] || {},
    permissions: PROFILE_PERMISSIONS[role],
  };
};
