import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const AreaChartCard = ({
  data = [],
  dataKey = "value",
  tooltipLabel = "",
  valuePrefix = "",
  valueSuffix = "",
}) => {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          {/* ==========================
                  Gradient
          ========================== */}

          <defs>
            <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-primary)"
                stopOpacity={0.45}
              />

              <stop
                offset="95%"
                stopColor="var(--color-primary)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {/* ==========================
                  Grid
          ========================== */}

          <CartesianGrid
            stroke="var(--color-border)"
            strokeDasharray="3 3"
            vertical={false}
          />

          {/* ==========================
                  X Axis
          ========================== */}

          <XAxis
            dataKey="name"
            tick={{
              fill: "var(--color-foreground-muted)",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

          {/* ==========================
                  Y Axis
          ========================== */}

          <YAxis
            tick={{
              fill: "var(--color-foreground-muted)",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

          {/* ==========================
                  Tooltip
          ========================== */}

          <Tooltip
            cursor={{
              stroke: "var(--color-primary)",
              strokeWidth: 1,
            }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              return (
                <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-xl">
                  <p className="text-sm font-semibold text-foreground">
                    {label}
                  </p>

                  <p className="mt-1 text-base font-bold text-primary">
                    {valuePrefix}
                    {payload[0].value}
                    {valueSuffix || ` ${tooltipLabel}`}
                  </p>
                </div>
              );
            }}
          />

          {/* ==========================
                  Area
          ========================== */}

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="var(--color-primary)"
            strokeWidth={3}
            fill="url(#primaryGradient)"
            activeDot={{
              r: 6,
              fill: "var(--color-primary)",
              stroke: "var(--color-background)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartCard;
