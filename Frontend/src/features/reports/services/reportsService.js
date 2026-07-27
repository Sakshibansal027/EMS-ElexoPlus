import { reportsData } from "../mock/reportsData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportsService = {
  getAttendanceReports: async () => {
    await delay(300);
    return Promise.resolve(reportsData.attendanceReports);
  },
  getSalesReports: async () => {
    await delay(300);
    return Promise.resolve(reportsData.salesReports);
  },
  getAsmReports: async () => {
    await delay(300);
    return Promise.resolve(reportsData.asmReports);
  },
  getEmployeeReports: async () => {
    await delay(300);
    return Promise.resolve(reportsData.employeeReports);
  },
  getCompanyMetrics: async () => {
    await delay(300);
    return Promise.resolve(reportsData.metrics);
  },
  getChartData: async () => {
    await delay(300);
    return Promise.resolve(reportsData.chartData);
  },
};
