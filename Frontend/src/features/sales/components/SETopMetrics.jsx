// src/features/sales/components/SETopMetrics.jsx
import React from 'react';
import { Target, TrendingUp, ShoppingBag, Award } from 'lucide-react';

const SETopMetrics = ({ metrics }) => {
  if (!metrics) return null;

  const cards = [
    { 
      id: 'target',
      title: 'My Target (This Month)', 
      val: metrics.target ? `₹ ${metrics.target.toLocaleString('en-IN')}` : '₹ 0', 
      sub: metrics.targetSubText || 'Monthly Quota Assigned', 
      icon: Target,
      showProgress: false // ❌ No progress bar here
    },
    { 
      id: 'achievement',
      title: 'Achievement (This Month)', 
      val: metrics.achievement ? `₹ ${metrics.achievement.toLocaleString('en-IN')}` : '₹ 0', 
      sub: `${metrics.achievementPercentage || 0}% Achieved`, 
      icon: TrendingUp,
      progress: metrics.achievementPercentage || 0,
      showProgress: true // ✅ Progress bar ONLY here
    },
    { 
      id: 'orders',
      title: 'My Orders (This Month)', 
      val: metrics.totalOrders ?? 0, 
      sub: metrics.ordersSubText || 'Total Confirmed Orders', 
      icon: ShoppingBag,
      showProgress: false
    },
    { 
      id: 'incentive',
      title: 'Projected Incentive', 
      val: metrics.projectedIncentive ? `₹ ${metrics.projectedIncentive.toLocaleString('en-IN')}` : '₹ 0', 
      sub: metrics.incentiveSubText || 'Based on current run-rate', 
      icon: Award,
      showProgress: false
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((item) => {
        const IconComponent = item.icon;
        return (
          <div key={item.id} className="bg-[#0c0b09] border border-[#1d170e] p-4 rounded-2xl shadow-xl flex flex-col justify-between">
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
              {item.showProgress && (
                <div className="w-full bg-[#1c1a16] h-1.5 rounded-full overflow-hidden mb-1.5 border border-[#2a2215]">
                  <div 
                    className="bg-[#FFC107] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(item.progress, 100)}%` }}
                  ></div>
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