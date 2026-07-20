import StatsCard from "../components/StatCard";
import SalesTrendChart from "../components/SalesTrendChart.jsx";
import SalesByRegionChart from "../components/SalesByRegionChart.jsx";
import TopASM from "../components/LeadManagement.jsx";
import salesData from "../mock/salesData.js";  
const AdminSalesDashboard = () => {

    const cards = [
        {
            title: "Total ASM",
            value: "12",
            change: "+9.09%",
            icon: "users"
        },
        {
            title: "Sales Executives",
            value: "48",
            change: "+14.29%",
            icon: "users"
        },
        {
            title: "Total Sales",
            value: "₹2.4 Cr",
            change: "+18.75%",
            icon: "rupee"
        },
        {
            title: "Target Achievement",
            value: "78%",
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
        <SalesTrendChart />
      </div>

      {/* Compact Region Chart */}
      <div className="col-span-1 h-[350px]">
        <SalesByRegionChart />
      </div>

    </div>
<TopASM data={salesData} />
        </div>
    );
};

export default AdminSalesDashboard;