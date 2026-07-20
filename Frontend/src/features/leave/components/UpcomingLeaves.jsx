import { X } from "lucide-react";

import { upcomingStatusStyles } from "../config/leaveStyles.js";
import { formatShortDate } from "../shared/utils/date.js";

const UpcomingLeavesCard = ({
    showAll,
    upcomingLeaves = [],
    visibleLeaves = [],
    onShowAllChange,
    onCancelLeave,
}) => {
    return (
        <>
            <div className="card p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">
                        Upcoming Leaves
                    </h3>

                    <span className="text-xs text-muted-foreground">
                        {
                            upcomingLeaves.length
                        }{" "}
                        Upcoming
                    </span>
                </div>

                {upcomingLeaves.length ===
                0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        No upcoming leaves
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {visibleLeaves.map(
                                (
                                    leave
                                ) => (
                                    <div
                                        key={
                                            leave.id
                                        }
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            pb-3
                                            border-b
                                            border-border/40
                                        "
                                    >
                                        <div>
                                            <h4 className="font-medium text-sm">
                                                {
                                                    leave.leaveType
                                                }
                                            </h4>

                                            <p className="text-xs text-muted-foreground">
                                                {formatShortDate(
                                                    leave.fromDate
                                                )}

                                                {leave.toDate !==
                                                    leave.fromDate &&
                                                    ` - ${formatShortDate(
                                                        leave.toDate
                                                    )}`}
                                            </p>

                                            <p className="text-xs text-muted-foreground mt-1">
                                                {
                                                    leave.duration
                                                }
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`
                                                    px-2
                                                    py-1
                                                    rounded-full
                                                    text-[10px]
                                                    ${
                                                        upcomingStatusStyles[leave.status]
                                                    }
                                                `}
                                            >
                                                {
                                                    leave.status
                                                }
                                            </span>

                                            {leave.status ===
                                                "Pending" && (
                                                <button
                                                    onClick={() =>
                                                        onCancelLeave(
                                                            leave.id
                                                        )
                                                    }
                                                    className="
                                                        px-2
                                                        py-1
                                                        rounded-md
                                                        bg-red-500/10
                                                        text-red-400
                                                        text-[10px]
                                                        font-medium
                                                        hover:bg-red-500/20
                                                        transition
                                                    "
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {upcomingLeaves.length >
                            3 && (
                            <button
                                onClick={() =>
                                    onShowAllChange(
                                        true
                                    )
                                }
                                className="
                                    mt-4
                                    text-primary
                                    text-sm
                                    font-medium
                                    hover:underline
                                "
                            >
                                View All
                            </button>
                        )}
                    </>
                )}
            </div>

            {showAll && (
                <div
                    className="
                        fixed
                        inset-0
                        bg-black/70
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        z-50
                    "
                >
                    <div
                        className="
                            bg-card
                            border
                            border-border
                            rounded-xl
                            w-full
                            max-w-2xl
                            p-6
                            max-h-[80vh]
                            overflow-y-auto
                        "
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-semibold">
                                All Upcoming
                                Leaves
                            </h2>

                            <button
                                onClick={() =>
                                    onShowAllChange(
                                        false
                                    )
                                }
                                className="
                                    h-8
                                    w-8
                                    rounded-md
                                    hover:bg-muted
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <X
                                    size={
                                        18
                                    }
                                />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {upcomingLeaves.map(
                                (
                                    leave
                                ) => (
                                    <div
                                        key={
                                            leave.id
                                        }
                                        className="
                                            p-4
                                            rounded-lg
                                            border
                                            border-border
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >
                                        <div>
                                            <h4 className="font-medium">
                                                {
                                                    leave.leaveType
                                                }
                                            </h4>

                                            <p className="text-sm text-muted-foreground">
                                                {formatShortDate(
                                                    leave.fromDate
                                                )}

                                                {leave.toDate !==
                                                    leave.fromDate &&
                                                    ` - ${formatShortDate(
                                                        leave.toDate
                                                    )}`}
                                            </p>

                                            <p className="text-sm text-muted-foreground mt-1">
                                                {
                                                    leave.duration
                                                }
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-xs
                                                    ${
                                                        upcomingStatusStyles[leave.status]
                                                    }
                                                `}
                                            >
                                                {
                                                    leave.status
                                                }
                                            </span>

                                            {leave.status ===
                                                "Pending" && (
                                                <button
                                                    onClick={() =>
                                                        onCancelLeave(
                                                            leave.id
                                                        )
                                                    }
                                                    className="
                                                        px-3
                                                        py-1
                                                        rounded-md
                                                        bg-red-500/10
                                                        text-red-400
                                                        text-xs
                                                        font-medium
                                                        hover:bg-red-500/20
                                                        transition
                                                    "
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpcomingLeavesCard;
