const PayrollSummaryCard = ({
    title,
    value,
    status,
    icon: Icon,
    iconBg,
    iconColor,
    statusColor,
}) => {
    
    return (
        <div
            className="
                card
                border
                border-[#232323]
                rounded-xl
                p-4
                transition-all
                duration-300
                hover:border-[#343434]
            "
        >
            <div className="flex items-start justify-between">
                <div>
                    <p
                        className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-[#8b8b8b]
                            font-medium
                        "
                    >
                        {title}
                    </p>

                    <h3
                        className="
                            text-[22px]
                            font-bold
                            text-white
                            mt-3
                        "
                    >
                        {value}
                    </h3>
                </div>

                <div
                    className={`
                        h-11
                        w-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${iconBg}
                        ${iconColor}
                    `}
                >
                    <Icon size={20} />
                </div>
            </div>

            <p
                className={`
                    mt-4
                    text-xs
                    font-medium
                    ${statusColor}
                `}
            >
                {status}
            </p>
        </div>
    );
};

export default PayrollSummaryCard;