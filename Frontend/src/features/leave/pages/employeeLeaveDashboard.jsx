import { useState } from "react";
import LeaveCard from "../components/admin/leaveCard.jsx";
import ApplyLeaveSection from "../components/employee/applyLeaveSection.jsx";
import LeaveBalanceCard from "../components/employee/LeaveBalanceCard.jsx";
import ApplyLeaveModal from "../components/admin/applyLeaveModel.jsx";
import LeaveHistorySection from "../components/employee/leaveHistorySection.jsx";
import EmployeeLeaveFilters from "../components/employee/employeeLeaveFilters.jsx";
import UpcomingLeavesCard from "../components/employee/upcominLeavesCard.jsx";
import LeaveAnalyticsCard from "../components/employee/leaveAnalyticsCard.jsx"
import LeaveDetailsModal from "../components/employee/leaveDetailsModal.jsx";
import {
    Info,
    MailWarning,
} from "lucide-react";
import {
    summaryCards,
    leaveBalanceData,
    leaveHistory,
} from "../mock/employeeLeaveData.js";

const EmployeeLeaveDashboard = () => {
    const [showApplyLeaveModal, setShowApplyLeaveModal] =
        useState(false);
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [periodFilter, setPeriodFilter] =
        useState("All Records");
    const [currentPage, setCurrentPage] =
        useState(1);
    const [selectedLeave, setSelectedLeave] =
        useState(null);
    const entriesPerPage = 5;

    /* Filters */

    const filteredLeaveApplications =
        leaveHistory.filter((application) => {

            const matchesStatus =
                selectedStatus === "All Status" ||
                application.status === selectedStatus;

            let matchesPeriod = true;

            const leaveDate = new Date(
                application.fromDate
            );

            const today = new Date();

            if (periodFilter === "This Month") {
                matchesPeriod =
                    leaveDate.getMonth() ===
                    today.getMonth() &&
                    leaveDate.getFullYear() ===
                    today.getFullYear();
            }

            if (
                periodFilter ===
                "Last 3 Months"
            ) {
                const threeMonthsAgo =
                    new Date();

                threeMonthsAgo.setMonth(
                    today.getMonth() - 3
                );

                matchesPeriod =
                    leaveDate >= threeMonthsAgo;
            }

            if (periodFilter === "This Year") {
                matchesPeriod =
                    leaveDate.getFullYear() ===
                    today.getFullYear();
            }

            return (
                matchesStatus &&
                matchesPeriod
            );
        });
    const leaveAnalytics = filteredLeaveApplications.reduce(
        (acc, leave) => {
            const type = leave.leaveType;

            const days = Number(
                leave.duration.split(" ")[0]
            );

            if (!acc[type]) {
                acc[type] = 0;
            }

            acc[type] += days;

            return acc;
        },
        {}
    );

    const pieChartData = Object.entries(
        leaveAnalytics
    ).map(([name, value]) => ({
        name,
        value,
    }));

    const totalDaysTaken = pieChartData.reduce(
        (sum, item) => sum + item.value,
        0
    );
    /* Pagination */

    const indexOfLastEntry =
        currentPage * entriesPerPage;

    const indexOfFirstEntry =
        indexOfLastEntry - entriesPerPage;

    const currentLeaves =
        filteredLeaveApplications.slice(
            indexOfFirstEntry,
            indexOfLastEntry
        );

    const totalPages = Math.ceil(
        filteredLeaveApplications.length /
        entriesPerPage
    );

    return (
        <div
            className="
                p-6
                md:p-8
                space-y-6
            "
        >
            {/* Summary Cards */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                "
            >
                {summaryCards.map((card) => (
                    <LeaveCard
                        key={card.title}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        description={card.description}
                    />
                ))}
            </div>

            {/* Leave Balance + Apply Leave */}

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-12
                    gap-6
                "
            >
                <div
                    className="
                        xl:col-span-8
                        card
                        p-6
                    "
                >
                    <div className="mb-5">
                        <h2
                            className="
                                text-xl
                                font-semibold
                            "
                        >
                            Leave Balance
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Track your available leave
                            balance across all leave
                            types.
                        </p>
                    </div>

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-4
                        "
                    >
                        {leaveBalanceData.map(
                            (leave) => (
                                <LeaveBalanceCard
                                    key={leave.title}
                                    leave={leave}
                                />
                            )
                        )}
                    </div>
                </div>

                <div className="xl:col-span-4">
                    <ApplyLeaveSection
                        setShowApplyLeaveModal={
                            setShowApplyLeaveModal
                        }
                    />
                </div>
            </div>

            {showApplyLeaveModal && (
                <ApplyLeaveModal
                    onClose={() =>
                        setShowApplyLeaveModal(
                            false
                        )
                    }
                />
            )}
            <div className="my-8">
                <EmployeeLeaveFilters
                    selectedStatus={selectedStatus}
                    onStatusChange={(status) => {
                        setSelectedStatus(status);
                        setCurrentPage(1);
                    }}
                    periodFilter={periodFilter}
                    onPeriodChange={(period) => {
                        setPeriodFilter(period);
                        setCurrentPage(1);
                    }}
                />
            </div>
            {/* Leave History */}

            <LeaveHistorySection
                leaveHistory={currentLeaves}
                currentPage={currentPage}
                totalPages={totalPages}
                totalEntries={filteredLeaveApplications.length}
                startEntry={indexOfFirstEntry + 1}
                endEntry={Math.min(
                    indexOfLastEntry,
                    filteredLeaveApplications.length
                )}
                onPageChange={setCurrentPage}
                setCurrentPage={setCurrentPage}
                onViewLeave={
                    setSelectedLeave
                }
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <UpcomingLeavesCard
                    leaveHistory={filteredLeaveApplications}
                />

                <LeaveAnalyticsCard
                    leaveBalanceData={
                        leaveBalanceData
                    }
                />
            </div>
            <div
                className="
                    card
                    px-5
                    py-4
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >
                <div className="flex gap-3">
                    <div
                        className="
                            h-8
                            w-8
                            rounded-full
                            bg-yellow-500/10
                            flex
                            items-center
                            justify-center
                            text-yellow-500
                            shrink-0
                        "
                    >
                        <Info size={18} />
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-1">
                            Important Note
                        </h4>

                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>
                                • Please apply for leave in
                                advance for smooth approval.
                            </li>

                            <li>
                                • For emergency leaves,
                                inform your manager as early
                                as possible.
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    className="
                        text-yellow-500
                        hidden
                        md:block
                    "
                >
                    <MailWarning size={32} />
                </div>
            </div>

            {selectedLeave && (
                <LeaveDetailsModal
                    leave={selectedLeave}
                    onClose={() =>
                        setSelectedLeave(null)
                    }
                />
            )}
        </div>
    );
};

export default EmployeeLeaveDashboard;