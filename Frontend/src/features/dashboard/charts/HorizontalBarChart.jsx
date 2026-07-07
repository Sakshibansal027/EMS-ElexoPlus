import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
  tooltipLabel,
  valuePrefix,
  valueSuffix,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="text-sm font-semibold text-foreground">{label}</p>

      <p className="mt-1 text-base font-bold text-primary">
        {valuePrefix}
        {payload[0].value}
        {valueSuffix || ` ${tooltipLabel}`}
      </p>
    </div>
  );
};

const HorizontalBarChart = ({
  data = [],
  tooltipLabel = "",
  valuePrefix = "",
  valueSuffix = "",
}) => {
  const maxValue = Math.max(...data.map((item) => item.value), 0);

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          barCategoryGap={22}
          margin={{
            top: 8,
            right: 24,
            left: 18,
            bottom: 0,
          }}
        >
          <CartesianGrid
            horizontal
            vertical={false}
            stroke="var(--color-border)"
            strokeDasharray="4 4"
            strokeOpacity={0.12}
          />

          <XAxis
            type="number"
            domain={[0, maxValue]}
            tick={{
              fill: "var(--color-foreground-muted)",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={95}
            tick={{
              fill: "var(--color-foreground)",
              fontSize: 14,
              fontWeight: 500,
            }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={false}
            content={
              <CustomTooltip
                tooltipLabel={tooltipLabel}
                valuePrefix={valuePrefix}
                valueSuffix={valueSuffix}
              />
            }
          />

          <Bar
            dataKey="value"
            fill="var(--color-primary)"
            radius={[10, 10, 10, 10]}
            barSize={16}
            activeBar={{
              fill: "var(--color-primary)",
            }}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalBarChart;
