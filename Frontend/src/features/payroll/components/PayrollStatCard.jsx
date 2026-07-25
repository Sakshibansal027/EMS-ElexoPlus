import * as Icons from "lucide-react";

const PayrollStatCard = ({
    title,
    value,
    subtitle,
    icon,
    valueColor = "text-zinc-50",
    subtitleColor = "text-emerald-400",
    iconColor = "text-amber-400",
    iconBg = "bg-amber-500/10 border-amber-500/20",
    onClick
}) => {
    // Icon Fallback
    const IconComponent = Icons[icon] || Icons["HelpCircle"];

    return (
        <div
            onClick={onClick}
            className="
            card
                group relative flex justify-between items-start gap-3
                p-4 sm:p-4.5 min-h-[140px] rounded-2xl
                border border-zinc-800/80 shadow-lg
                cursor-pointer transition-all duration-300
                overflow-hidden
                
                hover:-translate-y-1 hover:border-primary
                hover:shadow-primary
                active:scale-[0.99]
            "
        >
            {/* Left Content Column (min-w-0 prevents text pushing the icon out) */}
            <div className="flex flex-col justify-between h-full space-y-2 z-10 min-w-0 flex-1">
                {/* Title */}
                <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 tracking-wider uppercase leading-tight truncate">
                    {title}
                </p>

                {/* Big Value */}
                <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${valueColor}`}>
                    {value}
                </h2>

                {/* Subtitle / Badge */}
                {subtitle && (
                    <div className="pt-0.5">
                        <span className={`text-[11px] font-semibold ${subtitleColor} block truncate`}>
                            {subtitle}
                        </span>
                    </div>
                )}
            </div>

            {/* Right Icon Box (shrink-0 guarantees icon stays inside bounds) */}
            {IconComponent && (
                <div
                    className={`
                        p-2.5 sm:p-3 border rounded-xl flex items-center justify-center shrink-0 
                        transition-all duration-300 
                        group-hover:scale-110 group-hover:rotate-3 
                        ${iconBg}
                    `}
                >
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] ${iconColor}`} />
                </div>
            )}
        </div>
    );
};

export default PayrollStatCard;
