// src/features/sales/components/SESalesDashboard.jsx
import { useSEDashboardData } from '../hooks/useSEDashboardData';
import SETopMetrics from '../components/SETopMetrics';
import SETargetChart from '../components/SETargetChart';
import SEPerformanceWidgets from '../components/SEPerformanceWidgets';
import SEMyLeadsTable from '../components/SEMyLeadsTable';
import SEMyOrdersTable from '../components/SEMyOrdersTable';
import SETodaySummaryAndVisits from '../components/SETodaySummaryAndVisits';
import InlineLoader from "../../../components/common/InlineLoader";

const SESalesDashboard = () => {
  const { data, isLoading, error } = useSEDashboardData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070707]">
        <InlineLoader message="Syncing executive workspace & metrics..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center text-xs text-red-500 font-medium">
        {error || 'Data initialization failed'}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-gray-200 antialiased space-y-6 select-none">


      {/* 1. Top KPI Metrics */}
      <SETopMetrics metrics={data.topMetrics} />

      {/* 2. Target Chart  */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        {/* 75% Width - Target Chart */}
        <div className="w-full lg:w-[75%]">
          <SETargetChart chartData={data.targetTrend} />
        </div>

        {/* 25% Width - Performance Widgets */}
        <div className="w-full lg:w-[25%]">
          <SEPerformanceWidgets
            darLogs={data.darLogs}
            expenses={data.expenses}
            performance={data.performanceGauge}
          />
        </div>
      </div>
      <SEMyLeadsTable leads={data.myLeads} />
      <SEMyOrdersTable orders={data.myOrders} />
     <SETodaySummaryAndVisits summaryData={data.mockSummaryData} visitsData={data.visitsData} />

      {/* 3. Performance, Expenses & DAR Ledger */}


    </div>
  );
};

export default SESalesDashboard;
