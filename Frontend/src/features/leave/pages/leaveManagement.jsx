import { useState } from "react";
import { Info, MailWarning } from "lucide-react";

import ApplyLeaveButton from "../components/ApplyLeaveButton.jsx";
import ApplyLeaveForm from "../components/ApplyLeaveForm.jsx";
import ApplyLeaveSection from "../components/ApplyLeaveSection.jsx";
import EmployeeLeaveFilters from "../components/EmployeeLeaveFilters.jsx";
import LeaveAnalytics from "../components/LeaveAnalytics.jsx";
import LeaveApplicationRow from "../components/LeaveApplicationRow.jsx";
import LeaveBalanceCard from "../components/LeaveBalanceCard.jsx";
import LeaveDetailsModal from "../components/LeaveDetailsModal.jsx";
import LeaveFilters from "../components/LeaveFilters.jsx";
import LeaveHistorySection from "../components/LeaveHistorySection.jsx";
import LeaveStatCard from "../components/LeaveStatCard.jsx";
import Pagination from "../components/Pagination.jsx";
import UpcomingLeaves from "../components/UpcomingLeaves.jsx";
import { useApplyLeaveForm } from "../hooks/useApplyLeaveForm.js";
import { useLeaveManagement } from "../hooks/useLeaveManagement.js";

const LeaveManagement = () => {
    const [showApplyLeaveForm, setShowApplyLeaveForm] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const applyLeaveForm = useApplyLeaveForm({
        onSuccess: () => setShowApplyLeaveForm(false),
    });

    const {
        permissions,
        user,
        options,
        leaveStats,
        teamLeaves,
        selfLeaves,
    } = useLeaveManagement();

    const teamRecords = teamLeaves.pagination.records;
    const historyRecords = selfLeaves.pagination.records;

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="mb-10 flex items-start justify-between">
                <div>
                    <p className="mt-2 text-lg text-foreground-muted">
                        Manage{" "}
                        <span className="text-[var(--color-primary)] font-medium">
                            leave policies
                        </span>
                        , balances and employee requests.
                    </p>
                </div>

                {permissions.showApplyLeave && (
                    <ApplyLeaveButton
                        onClick={() => setShowApplyLeaveForm(true)}
                    />
                )}
            </div>

            {permissions.showLeaveStats && permissions.showTeamLeaves && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                    {leaveStats.managementCards.map((leave) => (
                        <LeaveStatCard key={leave.leaveType} {...leave} />
                    ))}
                </div>
            )}

            {permissions.showLeaveBalance && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    {leaveStats.summaryCards.map((card) => (
                        <LeaveStatCard
                            key={card.title}
                            icon={card.icon}
                            title={card.title}
                            value={card.value}
                            description={card.description}
                        />
                    ))}
                </div>
            )}

            {permissions.showLeaveBalance && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-8 card p-6">
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold">
                                Leave Balance
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Track your available leave balance across all leave
                                types.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {leaveStats.leaveBalanceData.map((leave) => (
                                <LeaveBalanceCard
                                    key={leave.title}
                                    leave={leave}
                                />
                            ))}
                        </div>
                    </div>

                    {permissions.showApplyLeave && (
                        <div className="xl:col-span-4">
                            <ApplyLeaveSection
                                setShowApplyLeaveModal={setShowApplyLeaveForm}
                            />
                        </div>
                    )}
                </div>
            )}

            {permissions.showTeamLeaves && (
                <>
                    <div className="mb-6">
                        <h2 className="heading-primary text-2xl mb-2">
                            Leave Applications
                        </h2>

                        <p className="text-body text-sm text-muted-foreground">
                            Review and manage employee leave requests.
                        </p>
                    </div>

                    <LeaveFilters
                        activeStatus={teamLeaves.filters.status}
                        onStatusChange={(value) =>
                            teamLeaves.setFilter("status", value)
                        }
                        selectedLeaveType={teamLeaves.filters.leaveType}
                        onLeaveTypeChange={(value) =>
                            teamLeaves.setFilter("leaveType", value)
                        }
                        selectedDayType={teamLeaves.filters.dayType}
                        onDayTypeChange={(value) =>
                            teamLeaves.setFilter("dayType", value)
                        }
                        statusTabs={options.managementStatusTabs}
                        leaveTypeOptions={options.managementLeaveTypeOptions}
                        dayTypeOptions={options.managementDayTypeOptions}
                    />

                    <div className="h-px bg-border my-6" />

                    <div className="flex flex-col gap-4">
                        {teamRecords.length ? (
                            teamRecords.map((application) => (
                                <LeaveApplicationRow
                                    key={application.employeeId}
                                    {...application}
                                    onStatusChange={teamLeaves.changeStatus}
                                />
                            ))
                        ) : (
                            <div className="card p-8 text-center">
                                <p className="text-muted-foreground">
                                    No leave applications found.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <Pagination
                            currentPage={teamLeaves.currentPage}
                            totalPages={teamLeaves.pagination.totalPages}
                            totalEntries={teamLeaves.filtered.length}
                            startEntry={
                                teamLeaves.filtered.length
                                    ? teamLeaves.pagination.startIndex + 1
                                    : 0
                            }
                            endEntry={Math.min(
                                teamLeaves.pagination.startIndex + 6,
                                teamLeaves.filtered.length
                            )}
                            onPageChange={teamLeaves.setCurrentPage}
                        />
                    </div>
                </>
            )}

            {permissions.showLeaveHistory && (
                <>
                    <div className="my-8">
                        <EmployeeLeaveFilters
                            selectedStatus={selfLeaves.status}
                            onStatusChange={selfLeaves.updateStatus}
                            periodFilter={selfLeaves.period}
                            onPeriodChange={selfLeaves.updatePeriod}
                            statusOptions={options.employeeStatusOptions}
                            periodOptions={options.employeePeriodOptions}
                        />
                    </div>

                    <LeaveHistorySection
                        leaveHistory={historyRecords}
                        currentPage={selfLeaves.currentPage}
                        totalPages={selfLeaves.pagination.totalPages}
                        totalEntries={selfLeaves.filtered.length}
                        startEntry={
                            selfLeaves.filtered.length
                                ? selfLeaves.pagination.startIndex + 1
                                : 0
                        }
                        endEntry={Math.min(
                            selfLeaves.pagination.startIndex + 5,
                            selfLeaves.filtered.length
                        )}
                        onPageChange={selfLeaves.setCurrentPage}
                        onViewLeave={setSelectedLeave}
                    />
                </>
            )}

            {(permissions.showUpcomingLeaves || permissions.showLeaveAnalytics) && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {permissions.showUpcomingLeaves && (
                        <UpcomingLeaves
                            showAll={selfLeaves.showAllUpcomingLeaves}
                            upcomingLeaves={selfLeaves.upcomingLeaves}
                            visibleLeaves={selfLeaves.visibleUpcomingLeaves}
                            onShowAllChange={selfLeaves.setShowAllUpcomingLeaves}
                            onCancelLeave={selfLeaves.cancelLeave}
                        />
                    )}

                    {permissions.showLeaveAnalytics && (
                        <LeaveAnalytics {...leaveStats.leaveAnalytics} />
                    )}
                </div>
            )}

            {permissions.showLeaveHistory && (
                <div className="card px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                            <Info size={18} />
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-1">
                                Important Note
                            </h4>

                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>
                                    â€¢ Please apply for leave in advance for smooth
                                    approval.
                                </li>

                                <li>
                                    â€¢ For emergency leaves, inform your manager as
                                    early as possible.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-yellow-500 hidden md:block">
                        <MailWarning size={32} />
                    </div>
                </div>
            )}

            {showApplyLeaveForm && (
                <ApplyLeaveForm
                    employee={user}
                    onClose={() => setShowApplyLeaveForm(false)}
                    form={applyLeaveForm}
                />
            )}

            {selectedLeave && (
                <LeaveDetailsModal
                    leave={selectedLeave}
                    onClose={() => setSelectedLeave(null)}
                />
            )}
        </div>
    );
};

export default LeaveManagement;
