const LeaveCard = ({
    icon: Icon,
    title,
    value,
    description,
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
                min-h-42.5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-primary
                hover:shadow-primary
            "
        >
            <div>
                <p className="text-base font-medium text-muted-foreground">
                    {title}
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight text-primary">
                    {value}
                </h2>

                <p className="mt-3 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>

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
                {Icon ? <Icon size={30} /> : null}
            </div>
        </div>
    );
};

export default LeaveCard;
