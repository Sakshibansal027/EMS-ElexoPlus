import { useState } from "react";
import { ArrowRight, CalendarX, AlertCircle } from "lucide-react";
import AttendanceDetailDrawer from "./AttendanceDetailDrawer";

const AttendanceImpactCard = ({ data }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const summary = data?.summary || {};

    return (
        <>
            <div className="bg-[#18181B] border border-zinc-800/80 rounded-2xl p-5 w-full h-full flex flex-col justify-between">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                    <div className="flex items-center gap-2">
                        <CalendarX size={16} className="text-yellow-500" />
                        <h3 className="text-yellow-500 font-semibold text-xs tracking-wider uppercase">
                            Attendance & Leave Impact
                        </h3>
                    </div>

                    <button 
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex items-center gap-1 text-xs text-yellow-500 hover:underline font-medium transition-colors"
                    >
                        <span>View All</span>
                        <ArrowRight size={13} />
                    </button>
                </div>

                {/* Metrics */}
                <div className="space-y-3 my-4">
                    <div className="bg-[#121214] border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-zinc-400">Total Unplanned Leaves / LOP</p>
                            <p className="text-base font-bold text-white mt-0.5">
                                {summary.totalUnplannedLeaves ?? "0 Days"}
                            </p>
                        </div>
                        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded font-medium">
                            {summary.impactLevel ?? "No impact"}
                        </span>
                    </div>

                    <div className="bg-[#121214] border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-zinc-400">Estimated Payroll Loss</p>
                            <p className="text-base font-bold text-red-400 mt-0.5">
                                {summary.estimatedLoss ?? "₹0"}
                            </p>
                        </div>
                        <AlertCircle size={18} className="text-red-400/80" />
                    </div>
                </div>

                {/* Footer Banner */}
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-2.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0"></span>
                    <p className="text-[11px] text-zinc-300">
                        {summary.crossedLopCount ?? 0} team members crossed LOP limits this month.
                    </p>
                </div>
            </div>

            {/* Pass complete data directly */}
            <AttendanceDetailDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                data={data}
            />
        </>
    );
};

export default AttendanceImpactCard;






