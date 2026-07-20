import { Eye } from "lucide-react";
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
        <div className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold">
                    My Leave History
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="py-4 text-left text-xs text-muted-foreground">
                                Date
                            </th>

                            <th className="py-4 text-left text-xs text-muted-foreground">
                                Leave Type
                            </th>

                            <th className="py-4 text-left text-xs text-muted-foreground">
                                From Date
                            </th>

                            <th className="py-4 text-left text-xs text-muted-foreground">
                                To Date
                            </th>

                            <th className="py-4 text-left text-xs text-muted-foreground">
                                Duration
                            </th>

                            <th className="py-4 text-left text-xs text-muted-foreground">
                                Day Type
                            </th>

                            <th className="py-4 text-left text-xs text-muted-foreground">
                                Reason
                            </th>

                            <th className="py-4 text-left text-xs text-muted-foreground">
                                Status
                            </th>

                            <th className="py-4 text-left text-xs text-muted-foreground">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {leaveHistory.length > 0 ? (
                            leaveHistory.map((leave) => (
                                <tr
                                    key={leave.id}
                                    className="
                                        border-b
                                        border-border/50
                                        hover:bg-muted/30
                                        transition-colors
                                    "
                                >
                                    <td className="py-5 text-sm">
                                        {formatShortDate(leave.date)}
                                    </td>

                                    <td className="text-sm">
                                        {leave.leaveType}
                                    </td>

                                    <td className="text-sm">
                                        {formatShortDate(leave.fromDate)}
                                    </td>

                                    <td className="text-sm">
                                        {formatShortDate(leave.toDate)}
                                    </td>

                                    <td className="text-sm">
                                        {leave.duration}
                                    </td>

                                    <td className="text-sm">
                                        {leave.dayType}
                                    </td>

                                    <td className="text-sm">
                                        {leave.reason}
                                    </td>

                                    <td>
                                        <span
                                            className={`
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                ${statusStyles[leave.status]}
                                            `}
                                        >
                                            {leave.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            title="View Details"
                                            className="
                                                h-9
                                                w-9
                                                rounded-lg
                                                border
                                                border-white/20
                                                flex
                                                items-center
                                                justify-center
                                                text-yellow-400
                                                hover:bg-yellow-500
                                                hover:text-black
                                                hover:border-white/80
                                                transition-all
                                                duration-300
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
                                    className="
                                        py-10
                                        text-center
                                        text-muted-foreground
                                    "
                                >
                                    No leave records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

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
