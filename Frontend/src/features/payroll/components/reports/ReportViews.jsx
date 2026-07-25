
const money = (val) => Number(val || 0).toLocaleString("en-IN");

// 1. Team Incentive View
export const TeamIncentiveView = ({ data }) => (
    <div className="w-full flex flex-col justify-between h-full py-1">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white/60">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-amber-100/70 border-b border-gray-200 text-gray-900 text-[11px] uppercase font-bold">
                        <th className="p-2">Member</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Target</th>
                        <th className="p-2">Achieved</th>
                        <th className="p-2 text-right">Incentive</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {(data.members || []).map((m, idx) => (
                        <tr key={idx}>
                            <td className="p-2 font-semibold text-gray-800">{m.name}</td>
                            <td className="p-2 text-gray-500">{m.role}</td>
                            <td className="p-2 text-gray-600">{m.target}</td>
                            <td className="p-2 font-semibold text-emerald-600">{m.achieved}</td>
                            <td className="p-2 text-right font-bold text-gray-900">₹{money(m.incentive)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-3 border border-amber-300 bg-amber-50/90 rounded-xl p-2.5 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-600 uppercase">Total Team Payout</span>
            <span className="text-lg font-black text-amber-600">₹{money(data.totalTeamPayout)}</span>
        </div>
    </div>
);

// 2. Performance vs Incentive View
export const PerfVsIncView = ({ data }) => (
    <div className="w-full flex flex-col justify-between h-full py-1">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white/60">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-amber-100/70 border-b border-gray-200 text-gray-900 text-[11px] uppercase font-bold">
                        <th className="p-2">KPI Parameter</th>
                        <th className="p-2">Target</th>
                        <th className="p-2">Actual</th>
                        <th className="p-2">Score</th>
                        <th className="p-2 text-right">Incentive</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {(data.metrics || []).map((row, idx) => (
                        <tr key={idx}>
                            <td className="p-2 font-semibold text-gray-800">{row.kpi}</td>
                            <td className="p-2 text-gray-600">{row.target}</td>
                            <td className="p-2 font-semibold text-gray-900">{row.actual}</td>
                            <td className="p-2 font-bold text-emerald-600">{row.score}</td>
                            <td className="p-2 text-right font-bold text-gray-900">₹{money(row.incentive)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-3 border border-amber-300 bg-amber-50/90 rounded-xl p-2.5 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-600 uppercase">Total Incentive Calculated</span>
            <span className="text-lg font-black text-amber-600">₹{money(data.totalIncentive)}</span>
        </div>
    </div>
);

// 3. Monthly Incentive Trend View
export const MonthlyTrendView = ({ data }) => (
    <div className="w-full flex flex-col justify-between h-full py-1">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white/60">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-amber-100/70 border-b border-gray-200 text-gray-900 text-[11px] uppercase font-bold">
                        <th className="p-2">Month</th>
                        <th className="p-2">Achievement</th>
                        <th className="p-2">Status</th>
                        <th className="p-2 text-right">Payout</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {(data.trends || []).map((t, idx) => (
                        <tr key={idx}>
                            <td className="p-2 font-semibold text-gray-800">{t.month}</td>
                            <td className="p-2 font-bold text-gray-700">{t.targetAchieved}</td>
                            <td className="p-2 text-emerald-600 font-bold">{t.status}</td>
                            <td className="p-2 text-right font-bold text-gray-900">₹{money(t.payout)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-3 border border-amber-300 bg-amber-50/90 rounded-xl p-2.5 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-600 uppercase">Cumulative YTD Payout</span>
            <span className="text-lg font-black text-amber-600">₹{money(data.totalYtdIncentive)}</span>
        </div>
    </div>
);

// 4. Target Achievement View
export const TargetAchievementView = ({ data }) => (
    <div className="w-full flex flex-col justify-between h-full py-1">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white/60">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-amber-100/70 border-b border-gray-200 text-gray-900 text-[11px] uppercase font-bold">
                        <th className="p-2">Category</th>
                        <th className="p-2">Allocated</th>
                        <th className="p-2">Achieved</th>
                        <th className="p-2 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                    {(data.targets || []).map((row, idx) => (
                        <tr key={idx}>
                            <td className="p-2 font-semibold text-gray-800">{row.category}</td>
                            <td className="p-2 text-gray-600">{row.allocated}</td>
                            <td className="p-2 font-semibold text-gray-900">{row.achieved}</td>
                            <td className="p-2 text-right font-bold text-emerald-600">{row.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-3 border border-amber-300 bg-amber-50/90 rounded-xl p-2.5 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-600 uppercase">Overall Achievement Score</span>
            <span className="text-lg font-black text-amber-600">{data.overallScore}</span>
        </div>
    </div>
);
