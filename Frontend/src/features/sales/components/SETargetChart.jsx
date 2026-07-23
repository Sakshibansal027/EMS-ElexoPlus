// src/features/sales/components/SETargetChart.jsx
import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, ChevronDown } from 'lucide-react';

// Custom Premium Dark Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const targetVal = payload.find(p => p.dataKey === 'target')?.value || 0;
    const achievementVal = payload.find(p => p.dataKey === 'achievement')?.value || 0;

    return (
      <div className="bg-[#12110e] border border-[#382b17] p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[170px]">
        <p className="text-gray-300 font-semibold mb-2">{label} 2026</p>
        
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#cca32b] inline-block opacity-60"></span> Target:
          </span>
          <span className="font-mono text-white font-bold">
            ₹{targetVal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#FFC107] inline-block"></span> Achievement:
          </span>
          <span className="font-mono text-[#FFC107] font-bold">
            ₹{achievementVal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const SETargetChart = ({ chartData }) => {
  if (!chartData || !chartData.data) return null;

  // Format currency for Y-Axis (e.g. 100000 -> ₹1L)
  const formatYAxis = (value) => {
    if (value === 0) return '₹0';
    return `₹${(value / 100000).toFixed(0)}L`;
  };

  return (
    <div className="bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full">
      
      {/* Header Deck: Title + Legend + Dropdown Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-white text-sm font-bold tracking-wide">Target vs Achievement</h3>
          
          {/* Chart Legend */}
          <div className="flex items-center gap-4 mt-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-4 h-0 border-t-2 border-dashed border-[#FFC107] inline-block"></span>
              <span>Target</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-4 h-0.5 bg-[#FFC107] inline-block rounded"></span>
              <span>Achievement</span>
            </div>
          </div>
        </div>

        {/* Timeframe Select Pill */}
        <div className="bg-[#141311] border border-[#282218] text-xs px-3 py-1.5 rounded-xl text-gray-300 flex items-center gap-2 cursor-pointer hover:border-[#FFC107] transition-all w-fit">
          <span className="text-[11px] font-medium">{chartData.timeframe || 'This Month'}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="w-full h-[220px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Achievement Under-Area Gold Gradient */}
              <linearGradient id="achievementGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFC107" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#FFC107" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1f1b14" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              fontSize={10} 
              tickLine={false} 
              axisLine={{ stroke: '#1f1b14' }} 
            />
            
            <YAxis 
              stroke="#666" 
              fontSize={10} 
              tickFormatter={formatYAxis} 
              tickLine={false} 
              axisLine={false} 
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Area Fill for Achievement */}
            <Area 
              type="monotone" 
              dataKey="achievement" 
              fill="url(#achievementGradient)" 
              stroke="none" 
            />

            {/* Target Line (Dashed) */}
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#cca32b" 
              strokeWidth={2} 
              strokeDasharray="4 4" 
              dot={{ r: 3, fill: '#cca32b' }} 
              activeDot={{ r: 5, fill: '#FFC107' }} 
            />

            {/* Achievement Line (Solid Smooth Gold) */}
            <Line 
              type="monotone" 
              dataKey="achievement" 
              stroke="#FFC107" 
              strokeWidth={2.5} 
              dot={{ r: 4, fill: '#FFC107', stroke: '#0c0b09', strokeWidth: 1.5 }} 
              activeDot={{ r: 6, fill: '#FFC107' }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Insight Badge */}
      {chartData.insightText && (
        <div className="mt-4 pt-3 border-t border-[#1a1712] flex items-center gap-1.5 text-xs text-green-400 font-medium">
          <TrendingUp size={14} className="text-green-400" />
          <span>{chartData.insightText}</span>
        </div>
      )}

    </div>
  );
};

export default SETargetChart;