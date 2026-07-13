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

const AXIS = { stroke: "#8a8a8a", fontSize: 11, tickLine: false, axisLine: false };
const GRID = "#2a2a2a";

const tooltipStyle = {
  background: "rgba(20,20,20,0.92)",
  border: "1px solid #3a3a3a",
  borderRadius: 14,
  color: "#f8f8f8",
  fontSize: 12,
  padding: "10px 12px",
  backdropFilter: "blur(8px)",
  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)",
};

const cursorFill = { fill: "rgba(244,194,28,0.06)" };

export const AttendanceTrendChart = ({ data }) => (
  <div className="card relative overflow-hidden p-6">
    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="card-title">Weekly Attendance Trend</p>
        <p className="card-subtitle">Present vs Late vs Absent</p>
      </div>
      <div className="flex gap-3 text-[11px] font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#f4c21c] shadow-[0_0_8px_#f4c21c]" />
          Present
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#4dabf7] shadow-[0_0_8px_#4dabf7]" />
          Late
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#e74c3c] shadow-[0_0_8px_#e74c3c]" />
          Absent
        </span>
      </div>
    </div>
    <div className="mt-5 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4c21c" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#f4c21c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gLate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4dabf7" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4dabf7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e74c3c" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#e74c3c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} strokeDasharray="4 6" vertical={false} />
          <XAxis dataKey="day" {...AXIS} dy={6} />
          <YAxis {...AXIS} />
          <Tooltip contentStyle={tooltipStyle} cursor={cursorFill} />
          <Area
            type="monotone"
            dataKey="present"
            stroke="#f4c21c"
            strokeWidth={2.5}
            fill="url(#gPresent)"
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#111" }}
          />
          <Area
            type="monotone"
            dataKey="late"
            stroke="#4dabf7"
            strokeWidth={2.5}
            fill="url(#gLate)"
            activeDot={{ r: 4, strokeWidth: 2, stroke: "#111" }}
          />
          <Area
            type="monotone"
            dataKey="absent"
            stroke="#e74c3c"
            strokeWidth={2.5}
            fill="url(#gAbsent)"
            activeDot={{ r: 4, strokeWidth: 2, stroke: "#111" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PIE_COLORS = ["#f4c21c", "#4dabf7", "#2ecc71", "#ffbf00", "#e74c3c", "#a78bfa"];

export const AttendanceBreakdownChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="card relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <p className="card-title">Today's Breakdown</p>
      <p className="card-subtitle">Distribution across statuses</p>
      <div className="relative mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {PIE_COLORS.map((c, i) => (
                <linearGradient
                  key={i}
                  id={`pie-${i}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor={c} stopOpacity={1} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.65} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              innerRadius={62}
              outerRadius={92}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              stroke="#141414"
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={`url(#pie-${i % PIE_COLORS.length})`} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#b8b8b8" }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
          <span className="text-2xl font-bold text-foreground">{total}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total
          </span>
        </div>
      </div>
    </div>
  );
};

export const DepartmentBarChart = ({ data }) => (
  <div className="card relative overflow-hidden p-6">
    <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
    <p className="card-title">Department-wise Attendance</p>
    <p className="card-subtitle">Present percentage today</p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8d74d" stopOpacity={1} />
              <stop offset="100%" stopColor="#f4c21c" stopOpacity={0.75} />
            </linearGradient>
            <linearGradient id="gBarHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe27a" stopOpacity={1} />
              <stop offset="100%" stopColor="#f4c21c" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} strokeDasharray="4 6" vertical={false} />
          <XAxis dataKey="name" {...AXIS} dy={6} />
          <YAxis {...AXIS} unit="%" />
          <Tooltip contentStyle={tooltipStyle} cursor={cursorFill} />
          <Bar
            dataKey="value"
            fill="url(#gBar)"
            radius={[10, 10, 0, 0]}
            maxBarSize={44}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
