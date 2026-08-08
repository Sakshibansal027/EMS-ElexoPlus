import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const AXIS = { stroke: "#8a8a8a", fontSize: 11, tickLine: false, axisLine: false };
const GRID = "#2a2a2a";
const tooltipStyle = { background: "rgba(20,20,20,0.92)", border: "1px solid #3a3a3a", borderRadius: 14, color: "#f8f8f8", fontSize: 12, padding: "10px 12px", backdropFilter: "blur(8px)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)" };

const ReportLineChart = ({ data, lines = [{ key: "actual", color: "#f4c21c" }, { key: "target", color: "#4dabf7" }] }) => {
  return (
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="4 6" vertical={false} />
          <XAxis dataKey="name" {...AXIS} dy={6} />
          <YAxis {...AXIS} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "#b8b8b8" }} />
          {lines.map(line => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#111" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportLineChart;
