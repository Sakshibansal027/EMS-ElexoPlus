import { X } from "lucide-react";
import {
    TeamIncentiveView,
    PerfVsIncView,
    MonthlyTrendView,
    TargetAchievementView
} from "./ReportViews";

export const ReportPreviewModal = ({ report, onClose }) => {
    if (!report) return null;

    const data = report.data || {};

    return (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden">
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-[60] bg-black/90 rounded-full p-2 text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
                <X size={18} />
            </button>

            <div
                className="relative w-[660px] h-[95vh] max-h-[920px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                style={{ fontFamily: "system-ui, sans-serif", aspectRatio: "1 / 1.38" }}
            >
                {/* Background Letterhead */}
                <img
                    src="https://b2b.elexoplus.in/api/letterhead.jpg"
                    alt="Letterhead"
                    className="absolute top-0 left-0 w-full h-full object-fill pointer-events-none select-none z-0"
                />

                {/* Main Content Overlay */}
                <div
                    className="relative z-10 px-9 pb-8 flex-1 flex flex-col justify-between h-full"
                    style={{ paddingTop: "145px", color: "#000" }}
                >
                    {/* Header */}
                    <div className="text-center mb-2">
                        <h1 className="text-[20px] font-black tracking-wider text-gray-900 m-0 uppercase">
                            {report.title}
                        </h1>
                        <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                            {data.month}
                        </p>
                    </div>

                    {/* Employee Metadata */}
                    <div className="border border-gray-200 rounded-xl p-3 my-1 bg-white/80">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Employee Name</span>
                                <span className="font-bold text-gray-900">{data.employeeName}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Employee ID</span>
                                <span className="font-bold text-gray-900">{data.employeeId}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Designation</span>
                                <span className="font-bold text-gray-900">{data.designation}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Department</span>
                                <span className="font-bold text-gray-900">{data.department}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic View Injection */}
                    <div className="my-1 flex-1 flex flex-col justify-center">
                        {report.type === "team_incentive" && <TeamIncentiveView data={data} />}
                        {report.type === "perf_vs_inc" && <PerfVsIncView data={data} />}
                        {report.type === "monthly_trend" && <MonthlyTrendView data={data} />}
                        {report.type === "target_achievement" && <TargetAchievementView data={data} />}
                    </div>

                    <p className="text-center text-[10px] font-semibold text-gray-400 mt-2 tracking-wide">
                        This is an official system generated document and does not require a physical signature.
                    </p>
                </div>
            </div>
        </div>
    );
};
