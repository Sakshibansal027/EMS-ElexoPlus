import { useState } from "react";
import {
    History,
    Download,
} from "lucide-react";

const PayrollHistoryCard = ({
    history,
    onViewAll,
}) => {
    const latestHistory = history.slice(-5).reverse();
    return (
        <div className="card p-5 h-full">
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
                    Payroll History
                </h3>
            </div>

            <div
                className="
                    grid
                    grid-cols-[1.4fr_1fr_1fr_40px]
                    pb-3
                    border-b
                    border-[#2a2a2a]
                    text-[11px]
                    uppercase
                    text-muted-foreground
                "
            >
                <span>Month</span>
                <span>Net Pay</span>
                <span>Status</span>
                <span />
            </div>

            <div>
                {latestHistory.map((item) => (
                        <div
                            key={item.month}
                            className="
                                grid
                                grid-cols-[1.4fr_1fr_1fr_40px]
                                items-center
                                py-3
                                border-b
                                border-[#202020]
                                text-sm
                            "
                        >
                            <span>
                                {item.month}
                            </span>

                            <span>
                                ₹
                                {item.netPay.toLocaleString()}
                            </span>

                            <span>
                                <span
                                    className="
                                        px-2
                                        py-1
                                        rounded-md
                                        text-[10px]
                                        font-medium
                                        bg-green-500/10
                                        text-green-400
                                        border
                                        border-green-500/20
                                    "
                                >
                                    Processed
                                </span>
                            </span>

                            <button
                                className="
                                    text-muted-foreground
                                    hover:text-yellow-500
                                "
                            >
                                <Download
                                    size={15}
                                />
                            </button>
                        </div>
                    )
                )}
            </div>
            <button
                onClick={onViewAll}
                className="
                    text-yellow-500
                    text-sm
                    font-medium
                    hover:text-yellow-400
                "
            >
                View All History
            </button>
        </div>
    );
};

export default PayrollHistoryCard;