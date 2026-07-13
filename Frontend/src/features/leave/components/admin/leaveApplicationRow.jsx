const LeaveApplicationRow = ({
    employeeName,
    employeeId,
    designation,
    initials,
    leaveType,
    fromDate,
    toDate,
    duration,
    reason,
    appliedOn,
    approvedBy,
    approverRole,
    status,
    onStatusChange,
}) => {

    const statusStyles = {
        Pending:
            "bg-[#2d2610] text-[#d4b24c] border border-[#453915]",

        Approved:
            "bg-[#1d3326] text-[#6ecf8d] border border-[#284734]",

        Rejected:
            "bg-[#331f1f] text-[#d87a7a] border border-[#4a2c2c]",
    };

    const leaveTypeStyles = {
        CL:
            "bg-[#2d2610] text-[#d4b24c] border border-[#453915]",

        EL:
            "bg-[#142c3d] text-[#72b8f8] border border-[#1f4058]",

        SL:
            "bg-[#2a1d33] text-[#c78af0] border border-[#3d2b4a]",
    };

    return (
        <div
            className="
                card
                relative
                p-5
                overflow-hidden
            "
        >
            {/* Left Accent */}
            <div
                className="
                    absolute
                    left-0
                    top-0
                    h-full
                    w-1
                    bg-primary
                    opacity-70
                "
            />

            <div
                className="
                    grid
                    grid-cols-12
                    gap-6
                    items-center
                "
            >
                {/* Employee */}
                <div className="col-span-3 flex items-center gap-4">
                    <div
                        className="
                            w-14
                            h-14
                            rounded-full
                            bg-[#121212]
                            border
                            border-border
                            flex
                            items-center
                            justify-center
                            heading-primary
                            text-primary
                        "
                    >
                        {initials}
                    </div>

                    <div>
                        <h4 className="heading-primary text-sm">
                            {employeeName}
                        </h4>

                        <p className="text-xs text-muted-foreground">
                            {employeeId}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {designation}
                        </p>
                    </div>
                </div>

                {/* Leave Type */}
                <div className="col-span-1">
                    <p className="text-xs text-muted-foreground mb-2">
                        Type
                    </p>

                    <span
                        className={`
                            px-3
                            py-1
                            rounded-md
                            text-xs
                            border
                            ${leaveTypeStyles[leaveType]}
                        `}
                    >
                        {leaveType}
                    </span>
                </div>

                {/* Duration */}
                <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">
                        Duration
                    </p>

                    <p className="text-sm">
                        {fromDate} - {toDate}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                        {duration}
                    </p>
                </div>

                {/* Reason */}
                <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">
                        Reason
                    </p>

                    <p className="text-sm">
                        {reason}
                    </p>
                </div>

                {/* Applied On */}
                <div className="col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">
                        Applied On
                    </p>

                    <p className="text-sm">
                        {appliedOn}
                    </p>
                </div>

                {/* Approved By */}
                <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">
                        Approved By
                    </p>

                    <p className="text-sm">
                        {approvedBy}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                        {approverRole}
                    </p>
                </div>

                {/* Status */}
                <div className="col-span-1 flex flex-col items-end gap-3">
                    <span
                        className={`
                            px-3
                            py-1
                            rounded-md
                            text-xs
                            border
                            ${statusStyles[status]}
                        `}
                    >
                        {status}
                    </span>

                    {status === "Pending" && (
                        <div className="flex gap-2">
                            <button
                            onClick={() =>
                                onStatusChange(
                                    employeeId,
                                    "Approved"
                                )
                            }
                            className="
                                btn-primary
                                px-4
                                py-2
                                text-sm
                            "
                        >
                            Approve
                        </button>

                        <button
                        onClick={() =>
                            onStatusChange(
                                employeeId,
                                "Rejected"
                            )
                        }
                        className="
                            px-4
                            py-2
                            text-sm
                            rounded-md
                            border
                            border-[#4a2c2c]
                            text-[#d87a7a]
                            bg-[#331f1f]
                        "
                    >
                            Reject
                        </button>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
};

export default LeaveApplicationRow;