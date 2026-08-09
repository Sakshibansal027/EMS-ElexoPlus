import { useState, useEffect } from "react";
import { Info, MailWarning, Plus, Sliders, Edit3, Trash2 } from "lucide-react";

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
import LeavePolicyModal from "../components/LeavePolicyModal.jsx";
import { useApplyLeaveForm } from "../hooks/useApplyLeaveForm.js";
import { useLeaveManagement } from "../hooks/useLeaveManagement.js";
import { getLeavePolicies, updateLeavePolicy, createLeavePolicy, deleteLeavePolicy } from "../services/leaveService.js"; // <-- Added deleteLeavePolicy
import TeamLeaveCalendar from "../components/TeamLeaveCalender.jsx";
const LeaveManagement = () => {
    const [showApplyLeaveForm, setShowApplyLeaveForm] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);

    // --- Leave Policy States ---
    const [leavePolicies, setLeavePolicies] = useState([]);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

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

    // Fetch leave policies on load if permitted
    useEffect(() => {
        if (permissions.canManageLeavePolicies) {
            fetchPolicies();
        }
    }, [permissions.canManageLeavePolicies]);

    const fetchPolicies = async () => {
        try {
            const data = await getLeavePolicies();
            setLeavePolicies(data);
        } catch (error) {
            console.error("Failed to fetch leave policies", error);
        }
    };

    const handleSavePolicy = async (formData) => {
        try {
            if (selectedPolicy) {
                await updateLeavePolicy(formData);
            } else {
                await createLeavePolicy(formData);
            }
            fetchPolicies();
            setIsPolicyModalOpen(false);
            setSelectedPolicy(null);
        } catch (error) {
            console.error("Failed to save leave policy", error);
        }
    };

    const handleDeletePolicy = async (policyId) => {
        if (window.confirm("Are you sure you want to delete this leave policy?")) {
            try {
                await deleteLeavePolicy(policyId);
                fetchPolicies();
                setIsPolicyModalOpen(false);
                setSelectedPolicy(null);
            } catch (error) {
                console.error("Failed to delete leave policy", error);
            }
        }
    };

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

                <div className="flex items-center gap-3">
                    {permissions.canManageLeavePolicies && (
                        <button
                            onClick={() => {
                                setSelectedPolicy(null);
                                setIsPolicyModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-black hover:bg-primary-hover transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                            <Plus size={16} /> Add Leave Policy
                        </button>
                    )}

                    {permissions.showApplyLeave && (
                        <ApplyLeaveButton
                            onClick={() => setShowApplyLeaveForm(true)}
                        />
                    )}
                </div>
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

            {/* --- Leave Policies Section (Placed right after cards with Delete & Configure options) --- */}
            {permissions.canManageLeavePolicies && (
                <div className="card p-6 mb-10">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Sliders size={20} className="text-yellow-400" /> Leave Policies Configuration
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage quotas, accrual rules, and carry-forward options for organization leave types.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {leavePolicies.map((policy) => (
                            <div key={policy.id || policy.leaveTypeCode} className="bg-background/40 border border-border/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                            {policy.leaveTypeCode}
                                        </span>
                                        <span className="text-xs font-semibold text-muted-foreground">
                                            Quota: <strong className="text-foreground">{policy.annualQuota} Days</strong>
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-foreground mb-1">{policy.leaveTypeName}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{policy.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                                    <span className="text-muted-foreground">Accrual: <span className="text-foreground font-medium">{policy.accrualFrequency}</span></span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedPolicy(policy);
                                                setIsPolicyModalOpen(true);
                                            }}
                                            className="h-7 px-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                        >
                                            <Edit3 size={12} /> Configure
                                        </button>
                                        <button
                                            onClick={() => handleDeletePolicy(policy.id)}
                                            className="h-7 w-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all cursor-pointer"
                                            title="Delete Policy"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                        <h2 className="heading-primary text-2xl mb-2 text-primary">
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
                                    key={application.id}
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

            {permissions.showTeamCalendar && (
                <TeamLeaveCalendar
                    userRole={user.role}
                    events={leaveStats.calendarData?.events || []}
                    holidays={leaveStats.calendarData?.holidays || []}
                />
            )}
            {permissions.showLeaveHistory && (
                <>
                    <div className="my-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left Side: Heading */}
                        <div>
                            <h3 className="text-xl font-bold text-yellow-500 tracking-tight">My Leave History</h3>
                            <p className="text-sm text-gray-400">Track and manage your past and current leave applications</p>
                        </div>

                        {/* Right Side: Filters */}
                        <div>
                            <EmployeeLeaveFilters
                                selectedStatus={selfLeaves.status}
                                onStatusChange={selfLeaves.updateStatus}
                                periodFilter={selfLeaves.period}
                                onPeriodChange={selfLeaves.updatePeriod}
                                statusOptions={options.employeeStatusOptions}
                                periodOptions={options.employeePeriodOptions}
                            />
                        </div>
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
                                    • Please apply for leave in advance for smooth
                                    approval.
                                </li>

                                <li>
                                    • For emergency leaves, inform your manager as
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

            {/* --- Leave Policy Configuration Modal (with optional Delete inside if needed) --- */}
            <LeavePolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => {
                    setIsPolicyModalOpen(false);
                    setSelectedPolicy(null);
                }}
                policy={selectedPolicy}
                onSave={handleSavePolicy}
                onDelete={handleDeletePolicy}
            />
        </div>
    );
};

export default LeaveManagement;