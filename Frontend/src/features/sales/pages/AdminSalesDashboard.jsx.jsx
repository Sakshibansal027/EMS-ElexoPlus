import StatsCard from "../components/StatCard";
import SalesTrendChart from "../components/SalesTrendChart.jsx";
import SalesByRegionChart from "../components/SalesByRegionChart.jsx";
import TopASM from "../components/LeadManagement.jsx";
import useSalesStats from "../hooks/useSalesStats";
const AdminSalesDashboard = () => {
    const { stats, dashboard, loading } = useSalesStats();

    const cards = [
        {
            title: "Total ASM",
            value: loading ? "…" : stats.totalASM,
            change: "+9.09%",
            icon: "users"
        },
        {
            title: "Sales Executives",
            value: loading ? "…" : stats.totalSE,
            change: "+14.29%",
            icon: "users"
        },
        {
            title: "Total Sales",
            value: loading ? "…" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(stats.totalSales),
            change: "+18.75%",
            icon: "rupee"
        },
        {
            title: "Target Achievement",
            value: loading ? "…" : `${stats.targetAchieved}%`,
            change: "+6.25%",
            icon: "target"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white">Sales Overview</h1>
                <p className="text-sm text-gray-400">
                    Monitor your complete sales performance
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {cards.map((card, i) => (
                    <StatsCard key={i} {...card} />
                ))}


            </div>

      <div className="grid grid-cols-3 gap-9">

      {/* Wide Trend Chart */}
      <div className="col-span-2 h-[350px]">
        <SalesTrendChart data={dashboard.trend} />
      </div>

      {/* Compact Region Chart */}
      <div className="col-span-1 h-[350px]">
        <SalesByRegionChart data={dashboard.regions} totalSales={stats.totalSales} />
      </div>

    </div>
<TopASM />
        </div>
    );
};

export default AdminSalesDashboard;
