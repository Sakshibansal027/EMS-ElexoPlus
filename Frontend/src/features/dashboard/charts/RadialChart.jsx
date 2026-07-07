import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

const RadialChart = ({
  data = [],
  centerLabel = "Progress",
  valueSuffix = "%",
}) => {
  const value = data?.[0]?.value ?? 0;

  const chartData = [
    {
      name: "Progress",
      value,
      fill: "var(--color-primary)",
    },
  ];

  return (
    <div className="flex h-[320px] w-full items-center justify-center">

      <ResponsiveContainer width="100%" height="100%">

        <RadialBarChart
          data={chartData}
          innerRadius="72%"
          outerRadius="84%"
          startAngle={90}
          endAngle={-270}
          barSize={14}
        >

          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />

          <RadialBar
            background
            clockWise
            cornerRadius={20}
            dataKey="value"
          />

          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground"
            style={{
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            {value}{valueSuffix}
          </text>

          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground-muted"
            style={{
              fontSize: "14px",
            }}
          >
            {centerLabel}
          </text>

        </RadialBarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default RadialChart;