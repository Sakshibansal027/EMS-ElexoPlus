import { RotateCcw } from "lucide-react";
import CustomSelect from "../../employee-master/components/ui/CustomSelect";

const EmployeeLeaveFilters = ({
    selectedStatus,
    onStatusChange,
    periodFilter,
    onPeriodChange,
    statusOptions,
    periodOptions,
}) => {

    return (
        <div className="flex flex-wrap items-center gap-4">
            <CustomSelect
                placeholder="Status"
                options={statusOptions}
                value={selectedStatus}
                onValueChange={onStatusChange}
            />

            <CustomSelect
                placeholder="Time Period"
                options={periodOptions}
                value={periodFilter}
                onValueChange={onPeriodChange}
            />

            <button
                onClick={() => {
                    onStatusChange("All Status");
                    onPeriodChange("All Records");
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
    );
};

export default EmployeeLeaveFilters;
