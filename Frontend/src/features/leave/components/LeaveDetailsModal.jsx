import {
    Calendar,
    Clock3,
    FileText,
    X,
} from "lucide-react";

const LeaveDetailsModal = ({
    leave,
    onClose,
}) => {
    if (!leave) return null;

    const statusColors = {
        Approved:
            "bg-green-500/10 text-green-400",
        Pending:
            "bg-yellow-500/10 text-yellow-400",
        Rejected:
            "bg-red-500/10 text-red-400",
    };

    return (
        <div
            className="
                fixed
                inset-0
                bg-black/60
                backdrop-blur-sm
                flex
                items-center
                justify-center
                z-50
            "
        >
            <div
                className="
                    card
                    w-full
                    max-w-xl
                    p-6
                    relative
                "
            >
                {/* Header */}

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Leave Details
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Complete leave information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                            p-2
                            rounded-lg
                            hover:bg-muted/20
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Status */}

                <div className="mb-5">
                    <span
                        className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${
                                statusColors[
                                    leave.status
                                ]
                            }
                        `}
                    >
                        {leave.status}
                    </span>
                </div>

                {/* Details */}

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="card p-3">
                            <p className="text-xs text-muted-foreground">
                                Leave Type
                            </p>

                            <p className="font-medium mt-1">
                                {
                                    leave.leaveType
                                }
                            </p>
                        </div>

                        <div className="card p-3">
                            <p className="text-xs text-muted-foreground">
                                Duration
                            </p>

                            <p className="font-medium mt-1">
                                {
                                    leave.duration
                                }
                            </p>
                        </div>
                    </div>

                    <div className="card p-4 flex gap-3">
                        <Calendar
                            size={18}
                            className="text-primary mt-1"
                        />

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Leave Dates
                            </p>

                            <p className="font-medium">
                                {
                                    leave.fromDate
                                }{" "}
                                →{" "}
                                {
                                    leave.toDate
                                }
                            </p>
                        </div>
                    </div>

                    <div className="card p-4 flex gap-3">
                        <Clock3
                            size={18}
                            className="text-primary mt-1"
                        />

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Day Type
                            </p>

                            <p className="font-medium">
                                {
                                    leave.dayType
                                }
                            </p>
                        </div>
                    </div>

                    <div className="card p-4 flex gap-3">
                        <FileText
                            size={18}
                            className="text-primary mt-1"
                        />

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Reason
                            </p>

                            <p className="font-medium">
                                {
                                    leave.reason
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}

                <div className="mt-6 flex justify-end gap-3">
                    {leave.status ===
                        "Pending" && (
                        <button
                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-red-500/10
                                text-red-400
                                hover:bg-red-500/20
                            "
                        >
                            Cancel Request
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-primary
                            text-primary-foreground
                        "
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaveDetailsModal;