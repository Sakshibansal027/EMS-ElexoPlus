import { useState } from "react";
import { FileText, Eye, Download } from "lucide-react";
import { ReportPreviewModal } from "./reports/ReportPreviewModal";
import { downloadTextFile } from "../utils/payroll";
const QuickReportsCard = ({ reports = [] }) => {
    const [previewReport, setPreviewReport] = useState(null);

    return (
        <>
            <div className="bg-[#141416] border border-zinc-800/80 rounded-2xl p-5 w-full h-full flex flex-col justify-between">
                <div>
                    <h3 className="text-amber-500 font-bold text-xs tracking-wider uppercase mb-4">
                        QUICK REPORTS
                    </h3>

                    <div className="flex flex-col gap-2.5">
                        {reports.map((report) => (
                            <div
                                key={report.id || report.title}
                                className="flex items-center justify-between p-3 bg-[#0A0A0C] border border-zinc-800/80 rounded-xl hover:border-amber-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                    <FileText className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors shrink-0" />
                                    <span className="text-[11px] font-bold text-zinc-200 tracking-wider uppercase truncate">
                                        {report.title}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewReport(report)}
                                        className="text-zinc-400 hover:text-amber-500 p-1.5 rounded-md hover:bg-zinc-800 transition-all cursor-pointer"
                                        title="View Preview"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const titleSlug = (report.title || "report").toLowerCase().replace(/\s+/g, "-");
                                            downloadTextFile(`${titleSlug}.json`, JSON.stringify(report.data || report, null, 2), "application/json");
                                        }}
                                        className="text-zinc-400 hover:text-amber-500 p-1.5 rounded-md hover:bg-zinc-800 transition-all cursor-pointer"
                                        title="Download"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ReportPreviewModal
                report={previewReport}
                onClose={() => setPreviewReport(null)}
            />
        </>
    );
};

export default QuickReportsCard;