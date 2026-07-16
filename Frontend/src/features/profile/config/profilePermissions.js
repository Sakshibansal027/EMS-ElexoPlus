import ROLES from "../../../config/roles";

const PROFILE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    showBank: true,
    showEmergency: true,
    showDocuments: true,
    canChangePassword: true,
  },

  [ROLES.HR]: {
    showBank: true,
    showEmergency: true,
    showDocuments: true,
    canChangePassword: true,
  },

  [ROLES.ASM]: {
    showBank: true,
    showEmergency: true,
    showDocuments: true,
    canChangePassword: true,
  },

  [ROLES.SALES_EXECUTIVE]: {
    showBank: true,
    showEmergency: true,
    showDocuments: true,
    canChangePassword: true,
  },
};

export default PROFILE_PERMISSIONS;