const LeaveCard = ({
    icon: Icon,
    leaveType,
    leaveCount,
    leaveDescription
}) => {
    return (
        <div
            className="
                card
                relative
                flex
                items-center
                gap-5
                p-6
                overflow-hidden
                min-h-35
            "
        >
            {/* Left Yellow Accent */}
            <div
                className="
                    absolute
                    left-0
                    top-0
                    h-full
                    w-1
                    bg-(--color-primary)
                "
            />

            {/* Icon */}
            <div
                className="
                    w-16
                    h-16
                    rounded-full
                    bg-[rgba(244,194,28,0.12)]
                    flex
                    items-center
                    justify-center
                    shrink-0
                "
            >
                <Icon
                    size={28}
                    className="text-(--color-primary)"
                />
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3
                    className="
                        heading-primary
                        text-sm
                        text-foreground-muted
                    "
                >
                    {leaveType}
                </h3>

                <h2
                    className="
                        heading-primary
                        text-4xl
                        text-(--color-primary)
                        mt-1
                    "
                >
                    {leaveCount}
                </h2>

                <p
                    className="
                        text-body
                        text-sm
                        text-muted-foreground
                        mt-1
                    "
                >
                    {leaveDescription}
                </p>
            </div>

            {/* Three Dots */}
            <button
                className="
                    text-muted-foreground
                    text-xl
                    self-start
                "
            >
                ⋯
            </button>
        </div>
    );
};

export default LeaveCard;