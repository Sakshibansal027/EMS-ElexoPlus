// components/ui/StatsCard.jsx

import { Users, IndianRupee, Target } from "lucide-react";

const iconMap = {
  users: <Users size={20} />,
  rupee: <IndianRupee size={20} />,
  target: <Target size={20} />
};

const StatsCard = ({ title, value, change, icon = "users" }) => {
  return (
    <div className="relative bg-[#111111] border border-[#2a2a2a] 
                    rounded-2xl p-5 flex items-center justify-between
                    overflow-hidden group
                    hover:border-[#d4af37]/40 transition-all duration-300">

      {/* LEFT CONTENT */}
      <div className="flex items-center gap-4 z-10">

        {/* ICON CIRCLE */}
        <div className="w-12 h-12 flex items-center justify-center 
                        rounded-full bg-gradient-to-br 
                        from-[#d4af37]/30 to-[#d4af37]/5 
                        text-[#d4af37] shadow-inner">
          {iconMap[icon]}
        </div>

        {/* TEXT */}
        <div>
          <p className="text-gray-400 text-sm">{title}</p>

          <h2 className="text-white text-2xl font-semibold">
            {value}
          </h2>
          {change && <span className="text-[10px] text-emerald-400">{change}</span>}


        </div>
      </div>

      {/* RIGHT SIDE CURVE GRAPH EFFECT */}
      <div className="absolute right-0 top-0 h-full w-32 opacity-40">
        <div className="h-full w-full bg-gradient-to-l 
                        from-[#d4af37]/40 to-transparent 
                        blur-xl"></div>
      </div>

    </div>
  );
};

export default StatsCard;
