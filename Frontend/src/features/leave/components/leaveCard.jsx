const LeaveCard = ({
    icon: Icon,
    leaveType,
    leaveCount,
    leaveDescription,
}) => {
    return (
        <div
            className="
                card
                group
                relative
                flex
                items-center
                justify-between
                p-7
                min-h-[170px]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-primary
                hover:shadow-primary
            "
        >
            {/* Content */}
            <div>
                <p className="text-base font-medium text-muted-foreground">
                    {leaveType}
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight text-primary">
                    {leaveCount}
                </h2>

                <p className="mt-3 text-sm text-muted-foreground">
                    {leaveDescription}
                </p>
            </div>

            {/* Icon */}
            <div
                className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary/10
                    text-primary
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:rotate-6
                "
            >
                <Icon
                    size={30}
                    className="
                        transition-transform
                        duration-300
                        group-hover:scale-110
                    "
                />
            </div>
        </div>
    );
};

export default LeaveCard;