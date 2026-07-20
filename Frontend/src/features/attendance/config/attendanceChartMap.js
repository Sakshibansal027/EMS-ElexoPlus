import AttendanceAreaChart from "../charts/AttendanceAreaChart";
import AttendancePieChart from "../charts/AttendancePieChart";
import AttendanceBarChart from "../charts/AttendanceBarChart";

const ATTENDANCE_CHART_MAP = {
  area: AttendanceAreaChart,
  pie: AttendancePieChart,
  bar: AttendanceBarChart,
};

export default ATTENDANCE_CHART_MAP;