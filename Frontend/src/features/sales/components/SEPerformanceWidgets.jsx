// src/features/sales/components/SEPerformanceWidgets.jsx
import React from 'react';
import { PieChart } from 'lucide-react';

const SEPerformanceWidgets = ({ darLogs = [], expenses = [], performance }) => {
  if (!performance) return null;

  return (
    <div className="w-full h-full bg-[#0c0b09] border border-[#1d170e] p-5 rounded-2xl shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-white text-sm font-bold flex items-center gap-2">
          <PieChart size={16} className="text-[#FFC107]" />
          Performance Meter
        </h3>
      </div>

      {/* SVG Donut Chart Vector */}
      <div className="flex items-center justify-center my-auto py-2">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#1c1a16]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#FFC107]"
              strokeDasharray={`${performance.percentage}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xl font-bold text-white font-mono">{performance.percentage}%</span>
            <div className="text-[9px] text-gray-500 font-medium">Achieved</div>
          </div>
        </div>
      </div>

      {/* Bottom Metrics Table */}
      <div className="text-xs space-y-1.5 bg-[#141311] p-3 rounded-xl border border-[#222]">
        <div className="flex justify-between">
          <span className="text-gray-400">Target:</span>
          <span className="text-white font-mono">₹{performance.target?.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Achieved:</span>
          <span className="text-[#FFC107] font-mono">₹{performance.achieved?.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Balance:</span>
          <span className="text-red-400 font-mono">₹{performance.balance?.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default SEPerformanceWidgets;