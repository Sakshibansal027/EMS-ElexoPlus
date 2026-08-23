import {
    borderedStatusStyles,
    leaveTypeStyles,
} from "../config/leaveStyles.js";

const LeaveApplicationRow = ({
    id,
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
    canDecide,
    onStatusChange,
}) => {
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
                            ${borderedStatusStyles[status]}
                        `}
                    >
                        {status}
                    </span>

                    {canDecide && ["Pending", "Under Review"].includes(status) && (
                        <div className="flex gap-2">
                            <button
                            onClick={() =>
                                onStatusChange(
                                    id,
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
                                id,
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
                    {!canDecide && ["Pending", "Under Review"].includes(status) && (
                        <p className="text-xs text-muted-foreground text-right">{approverRole || "Awaiting assigned approver"}</p>
                    )}
                    
                </div>
            </div>
        </div>
    );
};

export default LeaveApplicationRow;
