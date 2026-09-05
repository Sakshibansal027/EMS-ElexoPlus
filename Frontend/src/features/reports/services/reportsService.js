import client from "../../../api/client";

const unwrap = (response) => response.data?.data ?? response.data;
const get = (path, params = {}) => client.get(`/reports/${path}`, { params }).then(unwrap);

const attendance = (row) => ({
  id: row.id, employeeId: row.employee_code || row.employee_id,
  employeeName: row.employee_name || "Unknown employee", department: row.department_name || "Unassigned",
  date: row.attendance_date, checkIn: row.check_in || "—", checkOut: row.check_out || "—",
  workingHours: Number(row.working_hours || 0), status: row.status === "Work From Home" ? "WFH" : row.status, remarks: row.remarks || "—",
});
const sales = (row, index) => {
  const achievement = Number(row.order_value || 0); const target = Number(row.target_value || 0);
  const percentage = target > 0 ? Math.round((achievement / target) * 100) : 0;
  const status = percentage >= 100 ? "Exceeded" : percentage >= 75 ? "On Track" : "Behind Target";
  return { id: row.order_id, salesExecutive: row.employee_name || "Unassigned", asm: row.asm_name || "Unassigned", region: row.territory_name || "Unassigned", month: row.order_date, target, achievement, percentage, rank: index + 1, status };
};
const employee = (row) => ({
  id: row.employee_code || row.employee_id, name: row.employee_name || "Unknown employee", department: row.department_name || "Unassigned", designation: row.designation_name || "Unassigned", branch: row.work_location || "—", employmentType: row.employment_type || "—", joiningDate: row.date_of_joining || "—", status: row.employee_status || "Unknown",
});

export const reportsService = {
  getAttendanceReports: async (params) => (await get("attendance", params)).map(attendance),
  getSalesReports: async (params) => (await get("sales", params)).map(sales),
  getAsmReports: (params) => get("asm", params),
  getEmployeeReports: async (params) => (await get("employees", params)).map(employee),
  getCompanyMetrics: (params) => get("metrics", params),
  getChartData: (params) => get("charts", params),
};
