
const TeamIncentiveSummaryCard = ({ data = [], onViewAll }) => {
    // Dynamic achievement status bar & text color helper
    const getStatusStyles = (pct) => {
        if (pct >= 100) {
            return { text: "text-emerald-400", bar: "bg-emerald-500" };
        }
        if (pct >= 80) {
            return { text: "text-amber-400", bar: "bg-amber-500" };
        }
        return { text: "text-red-500", bar: "bg-red-500" };
    };

    return (
        <div className="bg-[#18181B] border border-zinc-800/80 rounded-2xl p-5 w-full flex flex-col justify-between h-full">
            <div>
                {/* Header with Title and "View All" Button */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-amber-500 font-bold text-sm tracking-wider uppercase">
                        Team Incentive Summary
                    </h3>
                    
                    <button
                        onClick={onViewAll}
                        className="text-xs font-medium text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-1 transition-all"
                    >
                        <span>View All</span>
                        <span className="text-sm">→</span>
                    </button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-zinc-400 border-b border-zinc-800/60 pb-2">
                                <th className="pb-3 font-medium">Employee</th>
                                <th className="pb-3 font-medium">Zone</th>
                                <th className="pb-3 font-medium text-right">Assigned Target (₹)</th>
                                <th className="pb-3 font-medium text-right">Achieved (₹)</th>
                                <th className="pb-3 font-medium text-center w-36">Achievement %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/40 text-xs">
                            {data.map((emp) => {
                                const { text, bar } = getStatusStyles(emp.achievementPct);
                                const progressWidth = Math.min(emp.achievementPct, 100);

                                return (
                                    <tr key={emp.id} className="hover:bg-zinc-800/20 transition-colors">
                                        {/* Avatar & Name */}
                                        <td className="py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src={emp.avatar}
                                                    alt={emp.name}
                                                    className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                                                />
                                                <span className="font-medium text-zinc-200">
                                                    {emp.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Zone */}
                                        <td className="py-2.5 text-zinc-400">{emp.zone}</td>

                                        {/* Assigned Target */}
                                        <td className="py-2.5 text-right font-medium text-zinc-300">
                                            {emp.assignedTarget.toLocaleString("en-IN")}
                                        </td>

                                        {/* Achieved */}
                                        <td className="py-2.5 text-right font-medium text-zinc-300">
                                            {emp.achieved.toLocaleString("en-IN")}
                                        </td>

                                        {/* Achievement % with Bar */}
                                        <td className="py-2.5 px-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`font-bold ${text}`}>
                                                    {emp.achievementPct}%
                                                </span>
                                                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-300 ${bar}`}
                                                        style={{ width: `${progressWidth}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamIncentiveSummaryCard;
