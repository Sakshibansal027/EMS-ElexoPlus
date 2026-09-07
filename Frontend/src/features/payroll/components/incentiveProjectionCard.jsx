import { useState } from "react";
import { TrendingUp, Target, Award, ShieldCheck } from "lucide-react";

const IncentiveProjectionCard = ({ targetData }) => {
    const [achievedSales, setAchievedSales] = useState(targetData?.currentSales ?? 0);
    const targetQuota = targetData?.targetQuota ?? 0;
    const progress = targetQuota > 0 ? (achievedSales / targetQuota) * 100 : 0;
    const rate = progress >= 120 ? 4 : progress >= 100 ? 3.2 : (targetData?.baseIncentivePercentage ?? 0);
    const currentProjectedIncentive = Math.round((achievedSales * rate) / 100);
    const quotaPercentage = Math.min(Math.round(progress), 150);

    return (
        <div className="card p-5 h-full flex flex-col bg-[#141414] border border-[#222] rounded-2xl">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-yellow-500" />
                <h3 className="text-yellow-500 text-sm font-semibold uppercase tracking-wider">
                    Incentive Projection Hook
                </h3>
            </div>

            {/* Matrix Numbers */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#222]">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                        Projected Revenue
                    </span>
                    <span className="text-sm font-bold text-gray-200">
                        ₹{achievedSales.toLocaleString("en-IN")}
                    </span>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#222]">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                        Projected Payout
                    </span>
                    <span className="text-sm font-bold text-yellow-500">
                        ₹{currentProjectedIncentive.toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            {/* Live Slider Controller */}
            <div className="space-y-2 mb-4 flex-1 justify-center flex flex-col">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-semibold flex items-center gap-1">
                        <Target size={12} className="text-gray-500" /> Quota Progress
                    </span>
                    <span className={`font-bold ${quotaPercentage >= 100 ? "text-green-400" : "text-amber-400"}`}>
                        {quotaPercentage}%
                    </span>
                </div>
                
                <input 
                    type="range" 
                    min="0"
                    max={Math.max(targetQuota * 1.5, 1)}
                    step={Math.max(Math.round(targetQuota / 40), 1)}
                    value={achievedSales}
                    onChange={(e) => setAchievedSales(Number(e.target.value))}
                    disabled={targetQuota === 0}
                    className="w-full accent-yellow-500 bg-[#222] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                    <span>₹5L (Min)</span>
                    <span>Target: ₹10L</span>
                    <span>₹15L (Max)</span>
                </div>
            </div>

            {/* Milestones / Badges Footer */}
            <div className="border-t border-[#222] pt-3 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                    {quotaPercentage >= 120 ? (
                        <>
                            <Award size={12} className="text-green-400 animate-bounce" /> 
                            <span className="text-green-400 font-bold">Super Accelerator Active (4%)</span>
                        </>
                    ) : quotaPercentage >= 100 ? (
                        <>
                            <ShieldCheck size={12} className="text-blue-400" /> 
                            <span className="text-blue-400 font-bold">100% Target Met (3.2%)</span>
                        </>
                    ) : (
                        "Base Rate Tier (2.5%)"
                    )}
                </span>
            </div>
        </div>
    );
};

export default IncentiveProjectionCard;






