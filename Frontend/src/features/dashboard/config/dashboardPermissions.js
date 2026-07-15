import ROLES from "../../../config/roles";

const DASHBOARD_PERMISSIONS = {
  [ROLES.ADMIN]: {
    showHero: true,
    showKpis: true,
    showAnalytics: true,
    showTasks: true,
    showQuickActions: true,
  },

  [ROLES.HR]: {
    showHero: true,
    showKpis: true,
    showAnalytics: true,
    showTasks: true,
    showQuickActions: true,
  },

  [ROLES.ASM]: {
    showHero: true,
    showKpis: true,
    showAnalytics: true,
    showTasks: true,
    showQuickActions: true,
  },

  [ROLES.SALES_EXECUTIVE]: {
    showHero: true,
    showKpis: true,
    showAnalytics: true,
    showTasks: true,
    showQuickActions: true,
  },
};

export default DASHBOARD_PERMISSIONS;