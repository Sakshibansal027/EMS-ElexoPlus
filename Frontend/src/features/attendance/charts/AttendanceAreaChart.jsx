import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AXIS = {
  stroke: "#8a8a8a",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

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

const cursorFill = {
  fill: "rgba(244,194,28,0.06)",
};

const AttendanceAreaChart = ({ data }) => {
  return (
    <div className="mt-5 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 6, left: -18, bottom: 0 }}
        >
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

          <CartesianGrid
            stroke={GRID}
            strokeDasharray="4 6"
            vertical={false}
          />

          <XAxis dataKey="day" {...AXIS} dy={6} />

          <YAxis {...AXIS} />

          <Tooltip
            contentStyle={tooltipStyle}
            cursor={cursorFill}
          />

          <Area
            type="monotone"
            dataKey="present"
            stroke="#f4c21c"
            strokeWidth={2.5}
            fill="url(#gPresent)"
            activeDot={{
              r: 5,
              strokeWidth: 2,
              stroke: "#111",
            }}
          />

          <Area
            type="monotone"
            dataKey="late"
            stroke="#4dabf7"
            strokeWidth={2.5}
            fill="url(#gLate)"
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: "#111",
            }}
          />

          <Area
            type="monotone"
            dataKey="absent"
            stroke="#e74c3c"
            strokeWidth={2.5}
            fill="url(#gAbsent)"
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: "#111",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceAreaChart;