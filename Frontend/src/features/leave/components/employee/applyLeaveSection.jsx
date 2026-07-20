import { CalendarSearch } from "lucide-react";
import ApplyLeaveButton from "../admin/applyLeaveButton.jsx";

const ApplyLeaveSection = ({
    setShowApplyLeaveModal,
}) => {
    return (
        <div
            className="
                card
                p-6
                h-full
                flex
                flex-col
                justify-between
            "
        >
            <div>
                <h3
                    className="
                        text-xl
                        font-semibold
                        mb-2
                    "
                >
                    Apply Leave
                </h3>

                <p
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >
                    Need time off? Apply for leave and
                    relax!
                </p>
            </div>

            <div
                className="
                    mt-8
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >
                <div className="flex-1">
                    <ApplyLeaveButton
                        onClick={() =>
                            setShowApplyLeaveModal(true)
                        }
                    />
                </div>

                <div
                    className="
                        h-16
                        w-16
                        rounded-xl
                        border
                        border-border
                        flex
                        items-center
                        justify-center
                        text-primary
                        shrink-0
                        hover:border-primary
                        transition-all
                    "
                >
                    <CalendarSearch size={24} />
                </div>
            </div>
        </div>
    );
};

export default ApplyLeaveSection;