import { X, TrendingUp } from "lucide-react";

const SalaryRevisionDrawer = ({
    revisions = [],
    onClose,
}) => {
    return (
        <>
            <div
                className="
                    fixed
                    inset-0
                    bg-black/40
                    z-40
                "
                onClick={onClose}
            />

            <div
                className="
                    fixed
                    top-0
                    right-0
                    h-screen
                    w-full
                    sm:w-[480px]
                    bg-[#181818]
                    border-l
                    border-[#2a2a2a]
                    z-50
                    shadow-2xl
                    flex
                    flex-col
                    animate-[slideIn_.25s_ease-out]
                "
            >
                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                        border-[#2a2a2a]
                    "
                >
                    <div>
                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-white
                            "
                        >
                            Salary Revision History
                        </h2>

                        <p
                            className="
                                text-xs
                                text-gray-400
                                mt-1
                            "
                        >
                            Complete salary growth timeline
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                            p-2
                            rounded-lg
                            hover:bg-[#242424]
                            transition
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Timeline */}
                <div
                    className="
                        flex-1
                        overflow-y-auto
                        p-6
                    "
                >
                    <div className="space-y-8">
                        {revisions.map(
                            (
                                revision,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className="
                                        flex
                                        gap-4
                                    "
                                >
                                    {/* Timeline */}
                                    <div
                                        className="
                                            flex
                                            flex-col
                                            items-center
                                        "
                                    >
                                        <div
                                            className="
                                                w-3
                                                h-3
                                                rounded-full
                                                bg-yellow-500
                                            "
                                        />

                                        {index !==
                                            revisions.length -
                                                1 && (
                                            <div
                                                className="
                                                    w-[2px]
                                                    flex-1
                                                    bg-[#333]
                                                    min-h-[90px]
                                                    mt-2
                                                "
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div
                                        className="
                                            flex-1
                                            bg-[#202020]
                                            border
                                            border-[#2c2c2c]
                                            rounded-xl
                                            p-4
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                            "
                                        >
                                            <span
                                                className="
                                                    text-xs
                                                    text-gray-400
                                                "
                                            >
                                                {
                                                    revision.date
                                                }
                                            </span>

                                            <span
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    text-green-400
                                                    text-xs
                                                "
                                            >
                                                <TrendingUp
                                                    size={
                                                        12
                                                    }
                                                />
                                                Active
                                            </span>
                                        </div>

                                        <h3
                                            className="
                                                mt-2
                                                font-semibold
                                                text-white
                                            "
                                        >
                                            {
                                                revision.type
                                            }
                                        </h3>

                                        <p
                                            className="
                                                text-sm
                                                text-gray-400
                                                mt-1
                                            "
                                        >
                                            {
                                                revision.description
                                            }
                                        </p>

                                        <div
                                            className="
                                                mt-3
                                                text-yellow-500
                                                font-semibold
                                                text-lg
                                            "
                                        >
                                            ₹
                                            {revision.ctc.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalaryRevisionDrawer;
