import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { mockDepartmentLiabilityData as defaultDepartmentData } from "../mock/hrPayrollMock";
import { formatLakhs, formatAmount } from "../utils/payroll";

// Custom Tooltip with CSS Variable Theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-card,#09090b)] border border-[var(--color-border,#27272a)] p-3 rounded-lg shadow-xl text-xs space-y-1.5 backdrop-blur-md">
        <p className="font-bold text-[var(--color-primary,yellow)] tracking-wider uppercase mb-1">
          {label}
        </p>
        <p className="text-[var(--color-foreground,#fafafa)] flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[var(--color-foreground-muted,#a1a1aa)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary,yellow)]"></span>
            Current Month:
          </span>
          <span className="font-semibold text-[var(--color-foreground,#fafafa)]">
            ₹{formatAmount(payload[0].value)}
          </span>
        </p>
        <p className="text-[var(--color-foreground-muted,#a1a1aa)] flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
            Previous Month:
          </span>
          <span className="font-semibold text-zinc-400">
            ₹{formatAmount(payload[1].value)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const DepartmentWiseLiabilityCard = ({ data = defaultDepartmentData }) => {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-[var(--color-primary)]/50 w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xs font-bold tracking-wider text-[var(--color-primary,yellow)] uppercase">
            Department-Wise Payroll Liability Distribution
          </h2>
          <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
            Gross Salary Expense Comparison per Department
          </p>
        </div>

        {/* Custom Legend */}
        <div className="flex items-center gap-4 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[var(--color-primary,yellow)]"></span>
            <span className="text-[var(--color-foreground)]">Current Month</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-zinc-600"></span>
            <span className="text-[var(--color-foreground-muted)]">Previous Month</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
            barGap={4}
            barCategoryGap="25%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border, #27272a)"
            />
            <XAxis
              dataKey="department"
              stroke="var(--color-foreground-muted, #a1a1aa)"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border, #27272a)" }}
              dy={10}
            />
            <YAxis
              stroke="var(--color-foreground-muted, #71717a)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatLakhs}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
            />
            
            {/* Current Month Bar (Uses Primary CSS Variable / Amber Fallback) */}
            <Bar
              dataKey="currentMonth"
              name="Current Month"
              fill="var(--color-primary, #f59e0b)"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />
            
            {/* Previous Month Bar (Dark Gray) */}
            <Bar
              dataKey="previousMonth"
              name="Previous Month"
              fill="#52525b"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentWiseLiabilityCard;
