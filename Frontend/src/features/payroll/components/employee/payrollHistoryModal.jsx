import {
    X,
    Download,
} from "lucide-react";

const PayrollHistoryModal = ({
    history,
    onClose,
}) => {
    return (
        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/70
                backdrop-blur-sm
                flex
                items-center
                justify-center
                p-4
            "
        >
            <div
                className="
                    w-full
                    max-w-4xl
                    max-h-[85vh]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#2a2a2a]
                    bg-[#151515]
                "
            >
                {/* Header */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        p-5
                        border-b
                        border-[#2a2a2a]
                    "
                >
                    <h2
                        className="
                            text-yellow-500
                            font-semibold
                            text-lg
                        "
                    >
                        Payroll History
                    </h2>

                    <button
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>

                {/* Table */}

                <div
                    className="
                        p-5
                        overflow-y-auto
                        max-h-[70vh]
                    "
                >
                    <div
                        className="
                            grid
                            grid-cols-[1.5fr_1fr_1fr_50px]
                            text-xs
                            uppercase
                            text-muted-foreground
                            border-b
                            border-[#2a2a2a]
                            pb-3
                        "
                    >
                        <span>Month</span>
                        <span>Net Pay</span>
                        <span>Status</span>
                        <span />
                    </div>

                    {history.map(
                        (item) => (
                            <div
                                key={
                                    item.month
                                }
                                className="
                                    grid
                                    grid-cols-[1.5fr_1fr_1fr_50px]
                                    items-center
                                    py-4
                                    border-b
                                    border-[#202020]
                                "
                            >
                                <span>
                                    {
                                        item.month
                                    }
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
                                            bg-green-500/10
                                            text-green-400
                                            text-xs
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
                                        size={
                                            16
                                        }
                                    />
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default PayrollHistoryModal;