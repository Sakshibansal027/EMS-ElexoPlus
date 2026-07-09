import ApplyLeaveButton from "../components/applyLeaveButton.jsx";
import LeaveCard from "../components/leaveCard.jsx";
import LeaveFilters from "../components/leaveFilters.jsx";
import LeaveApplicationRow from "../components/leaveApplicationRow.jsx";
import Pagination from "../components/pagination.jsx";
import ApplyLeaveModal from "../components/applyLeaveModel.jsx";
import { leaveTypeOptions } from "../mock/leaveData.js"; 
import { useState } from "react";

import {
    LeaveCardsData,
    LeaveApplicationsData,
    PaginationData,
} from "../mock/leaveData.js";

const LeaveManagement = () => {
    const recordsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [activeStatus, setActiveStatus] = useState("All");
    const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
    const [leaveApplications, setLeaveApplications] = useState(LeaveApplicationsData);
    const [selectedLeaveType, setSelectedLeaveType] = useState("All");
    const [selectedDayType, setSelectedDayType] = useState("All");
    const updateLeaveStatus = (
    employeeId,
    newStatus
) => {

    setLeaveApplications((previous) =>
        previous.map((application) =>
            application.employeeId === employeeId
                ? {
                    ...application,
                    status: newStatus,
                }
                : application
        )
    );
};
    const filteredLeaveApplications =
    leaveApplications.filter(
        (application) => {

            const matchesStatus =
                activeStatus === "All" ||
                application.status === activeStatus;

            const matchesLeaveType =
                selectedLeaveType === "All" ||
                application.leaveType === selectedLeaveType;

            const matchesDayType =
                selectedDayType === "All" ||
                application.dayType === selectedDayType;

            return (
                matchesStatus &&
                matchesLeaveType &&
                matchesDayType
            );
        }
    );
    const totalPages = Math.ceil(
        filteredLeaveApplications.length /
        recordsPerPage
    );

    const startIndex =
        (currentPage - 1) * recordsPerPage;

    const currentRecords =
        filteredLeaveApplications.slice(
            startIndex,
            startIndex + recordsPerPage
        );
    return (
       <div className="max-w-[1600px] mx-auto px-8 py-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
                <div>
                <h1
                className="
                    heading-primary
                    text-5xl
                    tracking-tight
                "
            >
                    <span
                        className="
                            text-primary
                        "
                    >
                        Leave
                    </span>{" "}
                    Management
                </h1>

                    <p
                        className="
                            text-body
                            text-foreground-muted
                        "
                    >
                        Manage leave policies, balances and employee requests.
                    </p>
                </div>

                <ApplyLeaveButton  onClick={() =>
                    setShowApplyLeaveModal(true)
                } />
            </div>

            {/* Leave Cards */}
            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                    mb-10
                "
            >
                {LeaveCardsData.map((leave) => (
                    <LeaveCard
                        key={leave.leaveType}
                        {...leave}
                    />
                ))}
            </div>

            {/* Applications Section */}
                <div className="mb-6">
                    <h2
                        className="
                            heading-primary
                            text-2xl
                            mb-2
                        "
                    >
                        Leave Applications
                    </h2>

                    <p
                        className="
                            text-body
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Review and manage employee leave requests.
                    </p>
                </div>

                {/*Status Tabs */}
                
                <LeaveFilters
                    activeStatus={activeStatus}
                    onStatusChange={(status) => {
                        setActiveStatus(status);
                        setCurrentPage(1);
                    }}
                    selectedLeaveType={selectedLeaveType}
                    onLeaveTypeChange={(type) => {
                        setSelectedLeaveType(type);
                        setCurrentPage(1);
                    }}
                    selectedDayType={selectedDayType}
                    onDayTypeChange={(type) => {
                        setSelectedDayType(type);
                        setCurrentPage(1);
                    }}
                />

                {/* Divider */}
                <div
                    className="
                        h-px
                        bg-border
                        my-6
                    "
                />

                {/* Leave Applications */}
                <div className="flex flex-col gap-4">
                    {currentRecords.length > 0 ? (
                        currentRecords.map(
                            (application) => (
                                <LeaveApplicationRow
                                    key={application.employeeId}
                                    {...application}
                                    onStatusChange={updateLeaveStatus}
                                />
                            )
                        )
                    ) : (
                        <div className="card p-8 text-center">
                            <p className="text-muted-foreground">
                                No leave applications found.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalEntries={
                            filteredLeaveApplications.length
                        }
                        startEntry={
                            filteredLeaveApplications.length === 0
                                ? 0
                                : startIndex + 1
                        }
                        endEntry={Math.min(
                            startIndex + recordsPerPage,
                            filteredLeaveApplications.length
                        )}
                        onPageChange={setCurrentPage}
                    />
                </div>
                {showApplyLeaveModal && (
                    <ApplyLeaveModal
                        onClose={() =>
                            setShowApplyLeaveModal(false)
                        }
                    />
                )}
            </div>
    );
};

export default LeaveManagement;