import { History } from "lucide-react";

const SalaryRevisionCard = ({
    revisions = [],
    onViewAll,
}) => {
    const latestRevisions =
        revisions.slice(0, 3);

    return (
        <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
                <History
                    size={14}
                    className="text-yellow-500"
                />

                <h3
                    className="
                        text-yellow-500
                        text-sm
                        font-semibold
                        uppercase
                    "
                >
                    Salary Revision History
                </h3>
            </div>

            <div className="space-y-5">
                {latestRevisions.map(
                    (revision, index) => (
                        <div
                            key={index}
                            className="flex gap-3"
                        >
                            <div className="flex flex-col items-center">
                                <div
                                    className="
                                        w-2
                                        h-2
                                        rounded-full
                                        bg-green-500
                                    "
                                />

                                {index !==
                                    latestRevisions.length -
                                        1 && (
                                    <div
                                        className="
                                            w-px
                                            h-12
                                            bg-[#2a2a2a]
                                        "
                                    />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        {
                                            revision.date
                                        }
                                    </span>

                                    <span
                                        className="
                                            px-2
                                            py-1
                                            rounded-md
                                            bg-green-500/10
                                            text-green-400
                                            text-[10px]
                                        "
                                    >
                                        Effective
                                    </span>
                                </div>

                                <h4 className="text-sm font-medium mt-1">
                                    {
                                        revision.type
                                    }
                                </h4>

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    {
                                        revision.description
                                    }
                                </p>

                                <p className="text-sm mt-1">
                                    Revised
                                    CTC: ₹
                                    {revision.ctc.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )
                )}
            </div>

            <div className="text-center mt-4">
                <button
                    onClick={onViewAll}
                    className="
                        text-yellow-500
                        text-sm
                        hover:text-yellow-400
                    "
                >
                    View All Revisions
                </button>
            </div>
        </div>
    );
};

export default SalaryRevisionCard;
