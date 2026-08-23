import { Eye, Calendar, FileText } from "lucide-react";
import Pagination from "./Pagination.jsx";
import { statusStyles } from "../config/leaveStyles.js";
import { formatShortDate } from "../shared/utils/date.js";

const LeaveHistorySection = ({
    leaveHistory,
    currentPage,
    totalPages,
    totalEntries,
    startEntry,
    endEntry,
    onPageChange,
    onViewLeave
}) => {
    return (
        <div className="relative bg-gradient-to-br from-card/60 via-card/30 to-card/10 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-2xl overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

            

            {/* Table Container */}
            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/40 shadow-inner">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="py-4 px-5">Submitted</th>
                            <th className="py-4 px-5">Leave Type</th>
                            <th className="py-4 px-5">From Date</th>
                            <th className="py-4 px-5">To Date</th>
                            <th className="py-4 px-5">Duration</th>
                            <th className="py-4 px-5">Day Type</th>
                            <th className="py-4 px-5">Reason</th>
                            <th className="py-4 px-5">Status</th>
                            <th className="py-4 px-5 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border/40">
                        {leaveHistory.length > 0 ? (
                            leaveHistory.map((leave) => (
                                <tr
                                    key={leave.id}
                                    className="group hover:bg-yellow-500/[0.03] transition-all duration-200"
                                >
                                    <td className="py-4 px-5 text-sm font-medium text-foreground/80 flex items-center gap-2">
                                        <Calendar size={14} className="text-muted-foreground" />
                                        {formatShortDate(leave.date)}
                                    </td>

                                    <td className="py-4 px-5 text-sm font-semibold text-foreground">
                                        {leave.leaveType}
                                    </td>

                                    <td className="py-4 px-5 text-sm text-muted-foreground">
                                        {formatShortDate(leave.fromDate)}
                                    </td>

                                    <td className="py-4 px-5 text-sm text-muted-foreground">
                                        {formatShortDate(leave.toDate)}
                                    </td>

                                    <td className="py-4 px-5 text-sm font-bold text-yellow-500/90">
                                        {leave.duration}
                                    </td>

                                    <td className="py-4 px-5 text-sm">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-muted/60 text-muted-foreground border border-border/50">
                                            {leave.dayType}
                                        </span>
                                    </td>

                                    <td className="py-4 px-5 text-sm text-muted-foreground max-w-[200px] truncate" title={leave.reason}>
                                        {leave.reason}
                                    </td>

                                    <td className="py-4 px-5 text-sm">
                                        <span
                                            className={`
                                                inline-flex items-center justify-center
                                                px-3 py-1
                                                rounded-full
                                                text-xs font-bold
                                                tracking-wide
                                                shadow-sm
                                                border border-current/20
                                                ${statusStyles[leave.status]}
                                            `}
                                        >
                                            {leave.status}
                                        </span>
                                    </td>

                                    <td className="py-4 px-5 text-center">
                                        <button
                                            title="View Details"
                                            className="
                                                h-9 w-9
                                                rounded-xl
                                                border border-border/80
                                                bg-card/80
                                                inline-flex items-center justify-center
                                                text-yellow-400
                                                hover:bg-yellow-400
                                                hover:text-black
                                                hover:border-yellow-400
                                                hover:shadow-lg
                                                hover:shadow-yellow-400/20
                                                transition-all
                                                duration-200
                                            "
                                            onClick={() => onViewLeave(leave)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="py-14 text-center text-muted-foreground text-sm font-medium"
                                >
                                    No leave records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Wrapper */}
            <div className="mt-5 pt-3">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalEntries={totalEntries}
                    startEntry={startEntry}
                    endEntry={endEntry}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default LeaveHistorySection;