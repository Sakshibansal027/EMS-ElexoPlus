import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const AXIS = { stroke: "#909090", fontSize: 11 };
const GRID = "#303030";

export const AttendanceTrendChart = ({ data }) => (
  <div className="card p-6">
    <p className="card-title">Weekly Attendance Trend</p>
    <p className="card-subtitle">Present vs Late vs Absent</p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4c21c" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#f4c21c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" {...AXIS} />
          <YAxis {...AXIS} />
          <Tooltip
            contentStyle={{
              background: "#1b1b1b",
              border: "1px solid #303030",
              borderRadius: 12,
              color: "#f8f8f8",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="present"
            stroke="#f4c21c"
            strokeWidth={2}
            fill="url(#gPresent)"
          />
          <Area
            type="monotone"
            dataKey="late"
            stroke="#ffbf00"
            strokeWidth={2}
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="absent"
            stroke="#e74c3c"
            strokeWidth={2}
            fill="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PIE_COLORS = ["#f4c21c", "#4dabf7", "#2ecc71", "#ffbf00", "#e74c3c", "#a78bfa"];

export const AttendanceBreakdownChart = ({ data }) => (
  <div className="card p-6">
    <p className="card-title">Today's Breakdown</p>
    <p className="card-subtitle">Distribution across statuses</p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1b1b1b",
              border: "1px solid #303030",
              borderRadius: 12,
              color: "#f8f8f8",
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#b8b8b8" }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const DepartmentBarChart = ({ data }) => (
  <div className="card p-6">
    <p className="card-title">Department-wise Attendance</p>
    <p className="card-subtitle">Present percentage today</p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" {...AXIS} />
          <YAxis {...AXIS} />
          <Tooltip
            contentStyle={{
              background: "#1b1b1b",
              border: "1px solid #303030",
              borderRadius: 12,
              color: "#f8f8f8",
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" fill="#f4c21c" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
