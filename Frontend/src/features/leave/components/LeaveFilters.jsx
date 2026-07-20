import { RotateCcw } from "lucide-react";
import CustomSelect from "../../employee-master/components/ui/CustomSelect";

const LeaveFilters = ({
    activeStatus,
    onStatusChange,
    selectedLeaveType,
    onLeaveTypeChange,
    selectedDayType,
    onDayTypeChange,
    statusTabs,
    leaveTypeOptions,
    dayTypeOptions,
}) => {

    return (
        <div className="space-y-6">

            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-8 border-b border-border pb-4">

                {statusTabs.map((status) => (
                    <button
                        key={status}
                        onClick={() => onStatusChange(status)}
                        className={`
                            relative
                            pb-2
                            text-sm
                            font-medium
                            transition-all
                            duration-300
                            ${
                                activeStatus === status
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            }
                        `}
                    >
                        {status}

                        <span
                            className={`
                                absolute
                                left-0
                                bottom-0
                                h-0.5
                                bg-primary
                                transition-all
                                duration-300
                                ${
                                    activeStatus === status
                                        ? "w-full"
                                        : "w-0"
                                }
                            `}
                        />
                    </button>
                ))}

            </div>

            {/* Filters */}

            <div className="flex flex-wrap items-center gap-4">

                <CustomSelect
                    placeholder="Day Type"
                    options={dayTypeOptions}
                    value={selectedDayType}
                    onValueChange={onDayTypeChange}
                />

                <CustomSelect
                    placeholder="Leave Type"
                    options={leaveTypeOptions}
                    value={selectedLeaveType}
                    onValueChange={onLeaveTypeChange}
                />

                <button
                    onClick={() => {
                        onLeaveTypeChange("All");
                        onDayTypeChange("All");
                        onStatusChange("All");
                    }}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-border
                        bg-secondary
                        px-5
                        h-12
                        transition-all
                        duration-300
                        hover:border-primary
                        hover:text-primary
                    "
                >
                    <RotateCcw
                        size={16}
                        className="text-primary"
                    />

                    Reset Filters
                </button>

            </div>

        </div>
    );
};

export default LeaveFilters;
