import React, { useState } from "react";
import { getLeavePermissions } from "../config/permissions/leavePermissions";
import { ROLES } from "../config/roles";

export default function TeamLeaveCalendar({
    userRole,
    events = [],
    holidays = [],
}) {
    const permissions = getLeavePermissions(userRole);
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!permissions.showTeamCalendar) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const handlePrevMonth = () =>
        setCurrentDate(new Date(year, month - 1, 1));

    const handleNextMonth = () =>
        setCurrentDate(new Date(year, month + 1, 1));

    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

    const currentMonthLeaves = events.filter(
        (e) =>
            e.startDate?.startsWith(monthPrefix) ||
            e.endDate?.startsWith(monthPrefix)
    );

    const currentMonthHolidays = holidays.filter((h) =>
        h.date?.startsWith(monthPrefix)
    );

    const showTeamLeaves = userRole !== ROLES.SALES_EXECUTIVE;

    return (
        <div className="bg-[#18181b] border border-gray-800/80 rounded-2xl p-6 text-white shadow-xl mt-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-800/60">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>

                        {showTeamLeaves
                            ? "Team Availability & Timeline"
                            : "Company Holidays"}
                    </h3>

                    <p className="text-gray-400 text-xs mt-0.5">
                        {showTeamLeaves
                            ? `Overview of upcoming team leaves and holidays for ${monthNames[month]} ${year}.`
                            : `Upcoming company holidays for ${monthNames[month]} ${year}.`}
                    </p>
                </div>

                <div className="flex items-center bg-[#121212] border border-gray-800 rounded-xl p-1">
                    <button
                        onClick={handlePrevMonth}
                        className="px-3 py-1.5 text-xs bg-gray-800/50 hover:bg-primary hover:text-black rounded-lg transition"
                    >
                        ← Prev
                    </button>

                    <span className="px-4 text-xs font-bold text-primary min-w-[120px] text-center">
                        {monthNames[month]} {year}
                    </span>

                    <button
                        onClick={handleNextMonth}
                        className="px-3 py-1.5 text-xs bg-gray-800/50 hover:text-primary hover:text-black rounded-lg transition"
                    >
                        Next →
                    </button>
                </div>
            </div>

            <div
                className={`grid gap-6 ${
                    showTeamLeaves
                        ? "grid-cols-1 lg:grid-cols-2"
                        : "grid-cols-1"
                }`}
            >
                {/* Company Holidays */}
                <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 flex flex-col h-[280px]">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-800">
                        <span className="text-xs font-semibold text-gray-300">
                            Company Holidays
                        </span>

                        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
                            {currentMonthHolidays.length} total
                        </span>
                    </div>

                    <div className="space-y-2 overflow-y-auto flex-1">
                        {currentMonthHolidays.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-xs italic text-gray-500">
                                No holidays scheduled.
                            </div>
                        ) : (
                            currentMonthHolidays.map((holiday) => (
                                <div
                                    key={holiday.id}
                                    className="bg-[#18181b] border border-gray-800 rounded-xl p-3 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-xs font-semibold">
                                            {holiday.title}
                                        </p>

                                        <p className="text-[10px] text-gray-500 mt-1">
                                            {holiday.date}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Team Leaves */}
                {showTeamLeaves && (
                    <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 flex flex-col h-[280px]">
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-800">
                            <span className="text-xs font-semibold text-gray-300">
                                Team Leaves & Time-offs
                            </span>

                            <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                                {currentMonthLeaves.length} total
                            </span>
                        </div>

                        <div className="space-y-2 overflow-y-auto flex-1">
                            {currentMonthLeaves.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-xs italic text-gray-500">
                                    No team leaves recorded.
                                </div>
                            ) : (
                                currentMonthLeaves.map((leave) => (
                                    <div
                                        key={leave.id}
                                        className="bg-[#18181b] border border-gray-800 rounded-xl p-3 flex justify-between items-center"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-semibold">
                                                    {leave.employeeName}
                                                </p>

                                                <span
                                                    className={`text-[9px] px-2 py-0.5 rounded-full ${
                                                        leave.status ===
                                                        "Approved"
                                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                                    }`}
                                                >
                                                    {leave.status}
                                                </span>
                                            </div>

                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {leave.leaveType}
                                            </p>

                                            <p className="text-[10px] text-gray-500">
                                                {leave.startDate} →{" "}
                                                {leave.endDate}
                                            </p>
                                        </div>

                                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-bold text-xs">
                                            {leave.employeeName?.charAt(0)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}