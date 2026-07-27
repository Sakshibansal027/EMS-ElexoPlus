import { X } from "lucide-react";

// Agar ye views kisi alag file mein hain toh unhe yahan correctly import karein:
import {
    TeamIncentiveView,
    PerfVsIncView,
    MonthlyTrendView,
    TargetAchievementView
} from "./ReportViews";

export const ReportPreviewModal = ({ report, onClose }) => {
    if (!report) return null;

    // Fallback: agar data property alag se na ho toh poora report hi data maan lo
    const data = report.data || report;
    const reportType = (report.type || report.id || "").toLowerCase().trim();

    const renderReportContent = () => {
        if (reportType === "team_incentive" || (reportType.includes("team") && !reportType.includes("perf"))) {
            return <TeamIncentiveView data={data} />;
        }
        if (reportType === "perf_vs_inc" || reportType.includes("perf") || reportType.includes("vs")) {
            return <PerfVsIncView data={data} />;
        }
        if (reportType === "monthly_trend" || reportType.includes("monthly") || reportType.includes("trend")) {
            return <MonthlyTrendView data={data} />;
        }
        if (reportType === "target_achievement" || reportType.includes("target") || reportType.includes("achievement")) {
            return <TargetAchievementView data={data} />;
        }
        return (
            <div className="p-4 text-xs text-gray-700 bg-gray-50 rounded-xl border border-gray-200 overflow-y-auto max-h-[300px]">
                <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
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
                            {report.title || "Report Preview"}
                        </h1>
                        <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                            {data.month || "Current Period"}
                        </p>
                    </div>

                    {/* Employee Metadata */}
                    <div className="border border-gray-200 rounded-xl p-3 my-1 bg-white/80">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Employee Name</span>
                                <span className="font-bold text-gray-900">{data.employeeName || data.name || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Employee ID</span>
                                <span className="font-bold text-gray-900">{data.employeeId || data.id || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Designation</span>
                                <span className="font-bold text-gray-900">{data.designation || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Department</span>
                                <span className="font-bold text-gray-900">{data.department || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic View Injection with Flexible Matching */}
                    <div className="my-1 flex-1 flex flex-col justify-center overflow-y-auto">
                        {renderReportContent()}
                    </div>

                    <p className="text-center text-[10px] font-semibold text-gray-400 mt-2 tracking-wide">
                        This is an official system generated document and does not require a physical signature.
                    </p>
                </div>
            </div>
        </div>
    );
};