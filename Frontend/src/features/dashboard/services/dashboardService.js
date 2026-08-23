import HERO_DATA from "../config/heroData";
import KPI_DATA from "../config/kpiData";
import ANALYTICS_DATA from "../config/analyticsData";
import QUICK_ACTION_DATA from "../config/quickActionData";
import DASHBOARD_PERMISSIONS from "../config/dashboardPermissions";
import client from "../../../api/client";

const ANALYTICS_KEYS = {
  ADMIN: ["revenue_trend", "target_achievement", "department_distribution"],
  HR: ["attendance_trend", "attendance_score", "hiring_performance"],
  ASM: ["sales_trend", "target_achievement", "top_executives"],
  SALES_EXECUTIVE: ["daily_orders", "target_achievement", "visit_performance"],
};

const formatMetric = ({ value, format }) => {
  const number = Number(value || 0);

  if (format === "currency") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(number);
  }

  return format === "percentage" ? `${number}%` : String(number);
};

const buildDashboard = (role, liveData = null) => {
  const metrics = liveData?.kpis || [];
  const analytics = liveData?.analytics || {};

  return {
    permissions: DASHBOARD_PERMISSIONS[role],
    hero: HERO_DATA[role] || {},
    kpis: metrics.map((metric, index) => ({
      ...(KPI_DATA[role] || [])[index],
      title: metric.title,
      value: formatMetric(metric),
      subtitle: "Current period",
    })),
    analytics: (ANALYTICS_DATA[role] || []).map((item, index) => ({
      ...item,
      data: analytics[ANALYTICS_KEYS[role]?.[index]] || null,
    })),
    pending: liveData?.tasks || [],
    activity: liveData?.activities || [],
    actions: QUICK_ACTION_DATA[role] || [],
  };
};

export const getDashboardData = async (role) => {
  const { data } = await client.get("/dashboard");
  const resolvedRole = data?.data?.role || role;
  return { ...buildDashboard(resolvedRole, data?.data), role: resolvedRole, live: true };
};
