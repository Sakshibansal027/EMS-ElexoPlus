import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

// Custom Label for Achievement (Yellow Dots ke upar %)
const renderAchievementLabel = ({ x, y, value }) => (
    <text
        x={x}
        y={y - 12}
        fill="#EAB308"
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
    >
        {value}%
    </text>
);

// Custom Label for Incentive (Red Dots ke neeche ₹1.xxL)
const renderIncentiveLabel = ({ x, y, value }) => (
    <text
        x={x}
        y={y + 22}
        fill="#EF4444"
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
    >
        ₹{value.toFixed(2)}L
    </text>
);

const PerformanceTrendChart = ({ data }) => {
    return (
        <div className="bg-[#18181B] border border-zinc-800/80 rounded-2xl p-5 w-full">
            {/* Header / Title */}
            <h3 className="text-amber-500 font-bold text-sm tracking-wider uppercase mb-4">
                Performance vs Incentive Trend
            </h3>

            {/* Custom Legend */}
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-6">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                        Achievement %
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                        Incentive (₹)
                    </span>
                </div>
                <span className="text-red-500 font-medium">₹ (Lakh)</span>
            </div>

            {/* Chart Area */}
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        {/* Soft Horizontal Grid Lines */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />

                        {/* X-Axis (Months) */}
                        <XAxis
                            dataKey="month"
                            stroke="#71717A"
                            fontSize={11}
                            tickLine={false}
                            axisLine={{ stroke: "#27272A" }}
                        />

                        {/* Left Y-Axis (Percentage: 0% to 125%) */}
                        <YAxis
                            yAxisId="left"
                            domain={[0, 125]}
                            ticks={[0, 25, 50, 75, 100, 125]}
                            tickFormatter={(v) => `${v}%`}
                            stroke="#71717A"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />

                        {/* Right Y-Axis (Incentive in Lakhs: 0 to 2.5L) */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 2.5]}
                            ticks={[0, 0.5, 1.0, 1.5, 2.0, 2.5]}
                            tickFormatter={(v) => `${v}L`}
                            stroke="#EF4444"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#09090B",
                                borderColor: "#27272A",
                                borderRadius: "8px",
                                color: "#fff",
                            }}
                        />

                        {/* Achievement Line (Yellow) */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="achievement"
                            stroke="#EAB308"
                            strokeWidth={2}
                            dot={{ fill: "#EAB308", r: 5 }}
                            label={renderAchievementLabel}
                        />

                        {/* Incentive Line (Red) */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="incentive"
                            stroke="#EF4444"
                            strokeWidth={2}
                            dot={{ fill: "#EF4444", r: 5 }}
                            label={renderIncentiveLabel}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceTrendChart;
