const LeaveBalanceCard = ({ leave }) => {
    const percentage =
        (leave.available / leave.total) * 100;

    return (
        <div
            className="
                card
                p-4
                flex
                flex-col
                gap-4
                min-h-35
            "
        >
            <h4
                className="
                    text-sm
                    text-muted-foreground
                    font-medium
                "
            >
                {leave.title}
            </h4>

            <div className="flex items-end gap-2">
                <span
                    className="
                        text-4xl
                        font-bold
                        text-foreground
                    "
                >
                    {leave.available}
                </span>

                <span
                    className="
                        text-lg
                        text-muted-foreground
                        mb-1
                    "
                >
                    / {leave.total}
                </span>
            </div>

            <div
                className="
                    flex
                    justify-between
                    text-sm
                "
            >
                <span className="text-muted-foreground">
                    days remaining
                </span>

                <span className="text-primary">
                    {Math.round(percentage)}%
                </span>
            </div>

            <div
                className="
                    w-full
                    h-2
                    bg-white/5
                    rounded-full
                    overflow-hidden
                "
            >
                <div
                    className={`${leave.color} h-full rounded-full transition-all duration-500`}
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    );
};

export default LeaveBalanceCard;