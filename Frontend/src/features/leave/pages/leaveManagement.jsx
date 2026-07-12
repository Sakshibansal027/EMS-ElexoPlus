import LeaveCard from "../components/admin/leaveCard.jsx";
import LeaveFilters from "../components/admin/leaveFilters.jsx";
import LeaveApplicationRow from "../components/admin/leaveApplicationRow.jsx";
import Pagination from "../components/admin/pagination.jsx";
import ApplyLeaveModal from "../components/admin/applyLeaveModel.jsx";
import { useState } from "react";
import { Plus } from "lucide-react";

import {
    LeaveCardsData,
    LeaveApplicationsData,
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
        <div className="w-full">
            {/* Header */}
            <div className="mb-10 flex items-start justify-between">
                <div>


                    <p className="page-description">
                        Manage{" "}
                        <span className="font-semibold text-primary">
                            leave policies
                        </span>
                        , balances and employee requests.
                    </p>
                </div>

                <button
                    onClick={() => setShowApplyLeaveModal(true)}
                    className="
        btn-primary
        flex
        items-center
        gap-2
        px-5
        py-3
        font-semibold
        cursor-pointer
        hover:scale-105
        hover:shadow-lg
        transition-all
        duration-300
    "
                >
                    <Plus size={18} />
                    Apply For Leave
                </button>
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
            <div className="mb-8">
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


            <div className="my-8">
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
            </div>



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