import HERO_DATA from "../config/heroData";
import KPI_DATA from "../config/kpiData";
import ANALYTICS_DATA from "../config/analyticsData";
import PENDING_TASK_DATA from "../config/pendingTaskData";
import RECENT_ACTIVITY_DATA from "../config/recentActivityData";
import QUICK_ACTION_DATA from "../config/quickActionData";
import DASHBOARD_PERMISSIONS from "../config/dashboardPermissions";

export const getDashboardData = (role) => {
  return {
    permissions: DASHBOARD_PERMISSIONS[role],
    hero: HERO_DATA[role] || {},
    kpis: KPI_DATA[role] || [],
    analytics: ANALYTICS_DATA[role] || [],
    pending: PENDING_TASK_DATA[role] || [],
    activity: RECENT_ACTIVITY_DATA[role] || [],
    actions: QUICK_ACTION_DATA[role] || [],
  };
};
