import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { useMemo, useState } from "react";

// IMPORT FROM MOCK
import {
  monthlySalesData,
  getQuarterlySales,
} from "../mock/salesTrendData";

// CUSTOM TOOLTIP
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-[#2a2a2a] px-4 py-2 rounded-lg">
        <p className="text-gray-400 text-sm">{label} 2026</p>
        <p className="text-white font-semibold">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const SalesTrendChart = ({ data = [] }) => {
  const [view, setView] = useState("monthly");

  //  CLEAN DATA SOURCE
  const sourceData = useMemo(() => data.length ? data.map((item) => ({ name: item.period, sales: Number(item.sales) })) : monthlySalesData, [data]);
  const chartData = useMemo(() => view === "monthly" ? sourceData : getQuarterlySales(sourceData), [view, sourceData]);

  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">

      {/*  HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-lg font-semibold">
          Sales Trend Overview
        </h2>

        {/*  TOGGLE */}
        <div className="flex bg-[#1a1a1a] rounded-lg p-1">
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-1 text-sm rounded-md ${
              view === "monthly"
                ? "bg-yellow-500 text-black"
                : "text-gray-400"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setView("quarterly")}
            className={`px-4 py-1 text-sm rounded-md ${
              view === "quarterly"
                ? "bg-yellow-500 text-black"
                : "text-gray-400"
            }`}
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* 🔥 CHART */}
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          {/* Gradient */}
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EAB308" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#EAB308" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid stroke="#222" vertical={false} />

          {/* Axes */}
         <XAxis
  dataKey="name"
  stroke="#aaa"
  interval={0}
  tick={{ fontSize: 12 }}
   minTickGap={0}
/>
          <YAxis
            stroke="#777"
            tickFormatter={(v) => `₹${v / 1000}K`}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="sales"
            fill="url(#colorSales)"
            stroke="none"
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#EAB308"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesTrendChart;
