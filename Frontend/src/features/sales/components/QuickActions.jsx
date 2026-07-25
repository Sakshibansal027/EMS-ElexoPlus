// src/features/sales/components/QuickActions.jsx
import React from 'react';
import { UserPlus, ShoppingCart, MapPin, LogOut, Calendar, FileText, Briefcase, Target } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { label: 'Add Lead', icon: UserPlus },
    { label: 'Create Order', icon: ShoppingCart },
    { label: 'Check In', icon: MapPin },
    { label: 'Check Out', icon: LogOut },
    { label: 'Add Visit', icon: Calendar },
    { label: 'Submit DAR', icon: FileText },
    { label: 'Submit Expense', icon: Briefcase },
    { label: 'View Target', icon: Target },
  ];

  return (
    <div className="bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-4 h-full shadow-xl">
      <h3 className="text-white text-sm font-bold mb-3">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button 
              key={i} 
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#141311] hover:bg-[#FFC107] text-gray-300 hover:text-black border border-[#262118] hover:border-[#FFC107] transition-all duration-200 group text-center"
            >
              <Icon size={16} className="group-hover:scale-110 transition-transform mb-1 text-[#FFC107] group-hover:text-black" />
              <span className="text-[10px] font-semibold leading-tight">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;