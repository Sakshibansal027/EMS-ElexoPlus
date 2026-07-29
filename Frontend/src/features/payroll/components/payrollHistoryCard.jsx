import { History, Download, ArrowUpRight } from "lucide-react";

const PayrollHistoryCard = ({ history = [], onViewAll, onDownload }) => {
    // Slice to 5 or 6 rows to cleanly absorb the vertical container height and eliminate dead spaces
    const latestHistory = [...history].slice(-5).reverse();

    return (
        <div className="card p-5 h-full flex flex-col bg-[#141414] border border-[#222] rounded-2xl min-h-[380px]">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-5 shrink-0">
                <div className="flex items-center gap-2">
                    <History size={15} className="text-yellow-500" />
                    <h3 className="text-yellow-500 text-sm font-semibold uppercase tracking-wider">
                        Payroll History
                    </h3>
                </div>
                <button 
                    onClick={onViewAll} 
                    className="text-[11px] font-bold text-yellow-500/80 hover:text-yellow-500 flex items-center gap-0.5 transition-colors uppercase tracking-wider"
                >
                    View All <ArrowUpRight size={12} />
                </button>
            </div>

            {/* Sticky Table Header Columns Setup */}
            <div className="grid grid-cols-[2fr_1.5fr_1.5fr_30px] items-center pb-2.5 border-b border-[#2a2a2a] text-[10px] font-bold uppercase tracking-wider text-gray-500 shrink-0">
                <span>Month</span>
                <span>Net Pay</span>
                <span className="text-center">Status</span>
                <span />
            </div>

            {/* Table Rows Body Area - Filling up the layout scale */}
            <div className="divide-y divide-[#202020]/40 flex-1 flex flex-col justify-between">
                {latestHistory.map((item) => (
                    <div 
                        key={item.month} 
                        className="grid grid-cols-[2fr_1.5fr_1.5fr_30px] items-center py-3.5 text-xs font-medium hover:bg-[#1a1a1a]/30 rounded-lg transition-colors group px-1"
                    >
                        <span className="text-gray-300 font-semibold">{item.month}</span>
                        <span className="text-gray-200 font-bold">₹{item.netPay.toLocaleString("en-IN")}</span>
                        <div className="flex justify-center">
                            <span className="px-3 py-1 rounded-full text-[9px] font-extrabold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wide min-w-[85px] text-center">
                                Processed
                            </span>
                        </div>
                        <button type="button" onClick={() => onDownload?.(item)} className="text-gray-500 hover:text-yellow-500 flex justify-end transition-colors">
                            <Download size={14} className="group-hover:scale-105 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PayrollHistoryCard;
