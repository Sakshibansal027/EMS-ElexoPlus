// src/features/sales/components/TodaysSummary.jsx
import React from 'react';
import { Clock, LogOut, MapPin, UserPlus, FileCheck, DollarSign } from 'lucide-react';

const TodaysSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-4 h-full shadow-xl flex flex-col justify-between">
      <h3 className="text-white text-sm font-bold mb-2">Today's Summary</h3>
      
      <div className="space-y-2 text-xs">
        {/* Check In Time */}
        <div className="flex justify-between items-center py-1.5 border-b border-[#1f1f1f]/40">
          <span className="text-gray-400 flex items-center gap-2">
            <Clock size={14} className="text-green-500" /> Check In Time
          </span>
          <span className="text-green-400 font-mono font-bold">{summary.checkInTime}</span>
        </div>

        {/* Check Out Time */}
        <div className="flex justify-between items-center py-1.5 border-b border-[#1f1f1f]/40">
          <span className="text-gray-400 flex items-center gap-2">
            <LogOut size={14} className="text-red-400" /> Check Out Time
          </span>
          <span className="text-red-400 font-mono font-bold">{summary.checkOutTime}</span>
        </div>

        {/* Total Visits */}
        <div className="flex justify-between items-center py-1.5 border-b border-[#1f1f1f]/40">
          <span className="text-gray-400 flex items-center gap-2">
            <MapPin size={14} className="text-[#FFC107]" /> Total Visits
          </span>
          <span className="text-white font-bold">{summary.totalVisits}</span>
        </div>

        {/* New Leads */}
        <div className="flex justify-between items-center py-1.5 border-b border-[#1f1f1f]/40">
          <span className="text-gray-400 flex items-center gap-2">
            <UserPlus size={14} className="text-[#FFC107]" /> New Leads
          </span>
          <span className="text-white font-bold">{summary.newLeads}</span>
        </div>

        {/* DAR Status */}
        <div className="flex justify-between items-center py-1.5 border-b border-[#1f1f1f]/40">
          <span className="text-gray-400 flex items-center gap-2">
            <FileCheck size={14} className="text-gray-400" /> DAR Status
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#111c15] text-green-400 border border-green-900/50">
            {summary.darStatus}
          </span>
        </div>

        {/* Expense Status */}
        <div className="flex justify-between items-center py-1.5">
          <span className="text-gray-400 flex items-center gap-2">
            <DollarSign size={14} className="text-gray-400" /> Expense Status
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#111c15] text-green-400 border border-green-900/50">
            {summary.expenseStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodaysSummary;