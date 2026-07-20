import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const PIE_COLORS = [
  "#f4c21c",
  "#4dabf7",
  "#2ecc71",
  "#ffbf00",
  "#e74c3c",
  "#a78bfa",
];

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

const AttendancePieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {PIE_COLORS.map((color, index) => (
              <linearGradient
                key={index}
                id={`pie-${index}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.65} />
              </linearGradient>
            ))}
          </defs>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={92}
            paddingAngle={3}
            stroke="#141414"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={`url(#pie-${index % PIE_COLORS.length})`}
              />
            ))}
          </Pie>

          <Tooltip contentStyle={tooltipStyle} />

          <Legend
            iconType="circle"
            wrapperStyle={{
              fontSize: 11,
              color: "#b8b8b8",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
        <span className="text-2xl font-bold text-foreground">
          {total}
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Total
        </span>
      </div>
    </div>
  );
};

export default AttendancePieChart;