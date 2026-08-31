import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import salesByRegionData from "../mock/salesRegionData";

const COLORS = ["#facc15", "#eab308", "#ca8a04", "#a16207", "#713f12"];

const SalesByRegionChart = ({ data = [], totalSales = 0 }) => {
  const regionData = data.length ? data : salesByRegionData;
  const formattedTotal = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalSales);

  return (
    <div className="bg-[#111] p-8 rounded-2xl shadow-lg border border-[#2a2a2a]  w-full h-[350px] flex flex-col justify-between">

      {/* Title */}
      <h2 className="text-white text-lg font-semibold">
        Sales by Region
      </h2>

      {/* Chart + Legend */}
      <div className="flex items-center justify-between">

        {/* Donut Chart */}
        <div className="w-[55%] h-[220px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {regionData.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-gray-300 text-sm">
                  {item.name}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                {item.value}%
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-400 text-sm">Total Sales</span>
        <span className="text-yellow-400 font-semibold text-lg">
          {totalSales ? formattedTotal : "—"}
        </span>
      </div>

    </div>
  );
};

export default SalesByRegionChart;
