import { getDashboardData } from "../services/dashboardService";

const useDashboard = (role) => {
  return getDashboardData(role);
};

export default useDashboard;