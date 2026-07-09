const LeaveFilters = ({
    activeStatus,
    onStatusChange,
    selectedLeaveType,
    onLeaveTypeChange,
    selectedDayType,
    onDayTypeChange,
}) => {

    const statusTabs = [
        "All",
        "Pending",
        "Approved",
        "Rejected",
    ];

    return (
        <div
            className="
                flex
                items-center
                justify-between
                mt-8
                gap-6
            "
        >
            {/* Status Tabs */}
            <div className="flex items-center gap-8">
                {statusTabs.map((status) => (
                    <button
                        key={status}
                        onClick={() =>
                            onStatusChange(status)
                        }
                        className={`
                            relative
                            pb-3
                            text-sm
                            font-medium
                            transition-all
                            duration-300
                            ease-in-out
                            ${
                                activeStatus === status
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            }
                        `}
                    >
                        {status}

                        <span
                            className={`
                                absolute
                                left-0
                                bottom-0
                                h-0.5
                                bg-primary
                                transition-all
                                duration-300
                                ease-in-out
                                ${
                                    activeStatus === status
                                        ? "w-full opacity-100"
                                        : "w-0 opacity-0"
                                }
                            `}
                        />
                    </button>
                ))}
            </div>

            {/* Right Side Filters */}
            <div className="flex items-center gap-3">

                {/* Day Type Filter */}
                <select
                    value={selectedDayType}
                    onChange={(event) =>
                        onDayTypeChange(
                            event.target.value
                        )
                    }
                    className="
                        input
                        h-9
                        px-3
                        rounded-xl
                        text-sm
                        min-w-25
                        bg-card
                        border
                        border-border
                        focus:outline-none
                    "
                >
                    <option value="All">
                        All
                    </option>

                    <option value="Full Day">
                        Full Day
                    </option>

                    <option value="First Half">
                        First Half
                    </option>

                    <option value="Second Half">
                        Second Half
                    </option>
                </select>

                {/* Leave Type Filter */}
                <select
                    value={selectedLeaveType}
                    onChange={(event) =>
                        onLeaveTypeChange(
                            event.target.value
                        )
                    }
                    className="
                        input
                        h-9
                        px-3
                        rounded-xl
                        text-sm
                        min-w-35
                        bg-card
                        border
                        border-border
                        focus:outline-none
                    "
                >
                    <option value="All">
                        All Leaves
                    </option>

                    <option value="CL">
                        Casual Leave
                    </option>

                    <option value="EL">
                        Earned Leave
                    </option>

                    <option value="SL">
                        Sick Leave
                    </option>

                    <option value="ML">
                        Maternity Leave
                    </option>

                    <option value="PL">
                        Paternity Leave
                    </option>

                    <option value="CO">
                        Compensatory Off
                    </option>

                    <option value="LOP">
                        Loss Of Pay
                    </option>
                </select>

            </div>
        </div>
    );
};

export default LeaveFilters;