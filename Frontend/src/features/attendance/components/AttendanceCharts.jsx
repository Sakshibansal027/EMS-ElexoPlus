import AttendanceAreaChart from "../charts/AttendanceAreaChart";
import AttendancePieChart from "../charts/AttendancePieChart";
import AttendanceBarChart from "../charts/AttendanceBarChart";

const Card = ({ title, subtitle, children }) => <div className="card p-6"><p className="card-title">{title}</p>{subtitle && <p className="card-subtitle">{subtitle}</p>}{children}</div>;

export const AttendanceTrendChart = ({ data = [] }) => <Card title="Attendance Trend" subtitle="Present, late and absent activity"><AttendanceAreaChart data={data} /></Card>;
export const AttendanceBreakdownChart = ({ data = [] }) => <Card title="Today's Breakdown" subtitle="Current attendance status"><AttendancePieChart data={data} /></Card>;
export const DepartmentBarChart = ({ data = [] }) => <Card title="Department Attendance" subtitle="Present percentage by department"><AttendanceBarChart data={data} /></Card>;
