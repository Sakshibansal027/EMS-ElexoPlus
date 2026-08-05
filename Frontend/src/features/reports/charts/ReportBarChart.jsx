import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const AXIS = { stroke: "#8a8a8a", fontSize: 11, tickLine: false, axisLine: false };
const GRID = "#2a2a2a";
const tooltipStyle = { background: "rgba(20,20,20,0.92)", border: "1px solid #3a3a3a", borderRadius: 14, color: "#f8f8f8", fontSize: 12, padding: "10px 12px", backdropFilter: "blur(8px)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)" };
const cursorFill = { fill: "rgba(244,194,28,0.06)" };

const ReportBarChart = ({ data, dataKey = "value", nameKey = "name", unit = "%" }) => {
  return (
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8d74d" stopOpacity={1} />
              <stop offset="100%" stopColor="#f4c21c" stopOpacity={0.75} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} strokeDasharray="4 6" vertical={false} />
          <XAxis dataKey={nameKey} {...AXIS} dy={6} />
          <YAxis {...AXIS} unit={unit} />
          <Tooltip contentStyle={tooltipStyle} cursor={cursorFill} />
          <Bar dataKey={dataKey} fill="url(#gBar)" radius={[10, 10, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportBarChart;
