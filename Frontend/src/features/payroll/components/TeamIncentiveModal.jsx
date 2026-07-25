import { useState } from "react";
import * as Icons from "lucide-react";

const TeamIncentiveModal = ({ data = [], onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedZone, setSelectedZone] = useState("All");

    // Dynamic achievement status bar & text color helper
    const getStatusStyles = (pct) => {
        if (pct >= 100) return { text: "text-emerald-400", bar: "bg-emerald-500" };
        if (pct >= 80) return { text: "text-amber-400", bar: "bg-amber-500" };
        return { text: "text-red-500", bar: "bg-red-500" };
    };

    // Filter logic
    const filteredData = data.filter((emp) => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesZone = selectedZone === "All" || emp.zone === selectedZone;
        return matchesSearch && matchesZone;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#18181B] border border-zinc-800 w-full max-w-5xl rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-white">All Team Incentives</h2>
                        <p className="text-xs text-zinc-400 mt-0.5">Full team performance and target achievements</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-all"
                    >
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
                    <div className="relative w-full sm:w-64">
                        <Icons.Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#0E0E10] border border-zinc-800 text-xs text-zinc-200 rounded-lg pl-9 pr-3 py-2 w-full focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            className="bg-[#0E0E10] border border-zinc-800 text-xs text-zinc-300 rounded-lg px-3 py-2 focus:outline-none"
                        >
                            <option value="All">All Zones</option>
                            <option value="North Zone">North Zone</option>
                            <option value="East Zone">East Zone</option>
                            <option value="West Zone">West Zone</option>
                            <option value="South Zone">South Zone</option>
                        </select>
                    </div>
                </div>

                {/* Table Area (Scrollable) */}
                <div className="overflow-y-auto flex-1 border border-zinc-800/60 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#0E0E10] border-b border-zinc-800 text-xs text-zinc-400">
                            <tr>
                                <th className="p-3 font-medium">Employee</th>
                                <th className="p-3 font-medium">Zone</th>
                                <th className="p-3 font-medium text-right">Assigned Target (₹)</th>
                                <th className="p-3 font-medium text-right">Achieved (₹)</th>
                                <th className="p-3 font-medium text-center w-36">Achievement %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/40 text-xs">
                            {filteredData.length > 0 ? (
                                filteredData.map((emp) => {
                                    const { text, bar } = getStatusStyles(emp.achievementPct);
                                    const progressWidth = Math.min(emp.achievementPct, 100);

                                    return (
                                        <tr key={emp.id} className="hover:bg-zinc-800/20 transition-colors">
                                            <td className="p-3">
                                                <div className="flex items-center gap-2.5">
                                                    <img
                                                        src={emp.avatar}
                                                        alt={emp.name}
                                                        className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                                                    />
                                                    <span className="font-medium text-zinc-200">{emp.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-zinc-400">{emp.zone}</td>
                                            <td className="p-3 text-right text-zinc-300 font-medium">
                                                {emp.assignedTarget.toLocaleString("en-IN")}
                                            </td>
                                            <td className="p-3 text-right text-zinc-300 font-medium">
                                                {emp.achieved.toLocaleString("en-IN")}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className={`font-bold ${text}`}>{emp.achievementPct}%</span>
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
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-zinc-500">
                                        No team members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t border-zinc-800 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium px-4 py-2 rounded-lg transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamIncentiveModal;
