// src/features/sales/components/SESalesDashboard.jsx
import React from 'react';
import { Calendar } from 'lucide-react';
import { useSEDashboardData } from '../hooks/useSEDashboardData';
import SETopMetrics from '../components/SETopMetrics';
import QuickActions from '../components/QuickActions';

const SESalesDashboard = ({ executiveId = 'SE001' }) => {
  const { data, isLoading, error } = useSEDashboardData(executiveId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center text-xs text-gray-500 font-medium animate-pulse">
        Syncing executive workspace & metrics...
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
    <div className="min-h-screen bg-[#070707] p-6 text-gray-200 antialiased space-y-6 select-none">
      
      {/* Header Deck */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-xl font-bold tracking-wide">Sales Executive Workspace</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {data.profile.role} &bull; <span className="text-green-500 font-medium">{data.profile.goodEveningText}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#141414] border border-[#222] text-xs px-3 py-1.5 rounded-xl text-gray-300 flex items-center gap-2 font-mono">
            <Calendar size={14} className="text-[#FFC107]" />
            <span>01 May 2026 - 31 May 2026</span>
          </div>
        </div>
      </div>

      {/* 1. Top Metrics */}
      <SETopMetrics metrics={data.topMetrics} />

      {/* 2. Actions & Attendance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <QuickActions />
        </div>
        <div className="lg:col-span-6">
          <TodaysSummary summary={data.todaysSummary} />
        </div>
      </div>

      {/* 3. Performance, Expenses & DAR Ledger */}
      <SEPerformanceWidgets 
        darLogs={data.darLogs} 
        expenses={data.expenses} 
        performance={data.performanceGauge} 
      />

    </div>
  );
};

export default SESalesDashboard;