// src/features/sales/components/SETopMetrics.jsx
import React from 'react';
import { Target, TrendingUp, ShoppingBag, Award } from 'lucide-react';

const SETopMetrics = ({ metrics }) => {
  if (!metrics) return null;

  const cards = [
    { title: 'My Target (This Month)', val: `₹ ${metrics.target.toLocaleString('en-IN')}`, sub: `${metrics.achievementPercentage}% of Target`, icon: Target, progress: metrics.achievementPercentage },
    { title: 'Achievement (This Month)', val: `₹ ${metrics.achievement.toLocaleString('en-IN')}`, sub: `${metrics.achievementPercentage}% Achieved`, icon: TrendingUp, progress: metrics.achievementPercentage },
    { title: 'My Orders (This Month)', val: metrics.totalOrders, sub: 'Total Confirmed Orders', icon: ShoppingBag },
    { title: 'Projected Incentive', val: `₹ ${metrics.projectedIncentive.toLocaleString('en-IN')}`, sub: 'Estimated payout', icon: Award },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div key={idx} className="bg-[#0c0b09] border border-[#1d170e] p-4 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-gray-400 font-medium">{item.title}</p>
                <h3 className="text-xl font-bold text-white mt-1 font-mono tracking-tight">{item.val}</h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#1c1810] border border-[#382b17] flex items-center justify-center text-[#FFC107]">
                <IconComponent size={18} />
              </div>
            </div>
            
            <div className="mt-3">
              {item.progress !== undefined && (
                <div className="w-full bg-[#1c1a16] h-1.5 rounded-full overflow-hidden mb-1.5 border border-[#2a2215]">
                  <div className="bg-[#FFC107] h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
              )}
              <p className="text-[10px] text-gray-500 font-medium">{item.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SETopMetrics;