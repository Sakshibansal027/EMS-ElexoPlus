import {
    FileText,
    Eye,
    Download,
} from "lucide-react";

const LatestPayslipCard = ({
    payslip,
}) => {
    const handleViewPayslip = () => {
        window.open(
            payslip.pdfUrl,
            "_blank"
        );
    };

    const handleDownloadPayslip = () => {
        const link =
            document.createElement("a");

        link.href = payslip.pdfUrl;

        link.download = `${payslip.month}-Payslip.pdf`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };
    return (
        <div
            className="
                card
                p-5
                h-full
            "
        >
            {/* Header */}

            <div className="flex items-center gap-2 mb-5">
                <FileText
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
                    Latest Payslip
                </h3>
            </div>

            {/* Payslip Preview */}

            <div
                className="
                    flex
                    gap-4
                    items-center
                    mb-5
                "
            >
                <div
                    className="
                        h-14
                        w-14
                        rounded-xl
                        bg-gradient-to-b
                        from-[#2a2a2a]
                        to-[#1b1b1b]
                        border
                        border-[#333]
                        flex
                        items-center
                        justify-center
                    "
                >
                    <FileText
                        size={24}
                        className="
                            text-yellow-500
                        "
                    />
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h4
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            {payslip.month}
                        </h4>

                        <span
                            className="
                                text-[10px]
                                px-2
                                py-0.5
                                rounded-full
                                bg-green-500/15
                                text-green-400
                            "
                        >
                            {payslip.status}
                        </span>
                    </div>

                    <p
                        className="
                            text-xs
                            text-muted-foreground
                            mt-1
                        "
                    >
                        Salary Credited on{" "}
                        {payslip.creditedOn}
                    </p>
                </div>
            </div>

            {/* Net Pay */}

            <div
                className="
                    border-t
                    border-[#2a2a2a]
                    pt-4
                    mb-5
                "
            >
                <p
                    className="
                        text-xs
                        text-muted-foreground
                    "
                >
                    Net Pay
                </p>

                <h2
                    className="
                        text-4xl
                        font-bold
                        mt-1
                    "
                >
                    ₹
                    {payslip.netPay.toLocaleString()}
                </h2>
            </div>

            {/* Buttons */}

            <button
                onClick={handleViewPayslip}
                className="
                    w-full
                    mb-3
                    rounded-lg
                    border
                    border-yellow-500/30
                    bg-yellow-500/10
                    py-2.5
                    text-sm
                    text-yellow-500
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:bg-yellow-500/15
                    transition-all
                "
            >
                <Eye size={16} />
                View Payslip
            </button>

            <button
                onClick={handleDownloadPayslip}
                className="
                    w-full
                    rounded-lg
                    border
                    border-[#2f2f2f]
                    py-2.5
                    text-sm
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:bg-[#202020]
                    transition-all
                "
            >
                <Download size={16} />
                Download PDF
            </button>
        </div>
    );
};

export default LatestPayslipCard;