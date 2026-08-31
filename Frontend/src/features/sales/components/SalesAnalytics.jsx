
export function SalesAnalytics({ leads }) {
    // Pure numbers extract karne ke liye helper logic
    const parseCurrencyToNum = (valStr) => {
        if (!valStr) return 0;
        const cleanStr = String(valStr).replace(/[^0-9]/g, "");
        return cleanStr ? parseInt(cleanStr, 10) : 0;
    };

    
    const activeLeads = leads.filter((l) => l.status !== "Archived");
    const totalActiveCount = activeLeads.length;

    const totalPipelineValue = activeLeads.reduce(
        (acc, curr) => acc + parseCurrencyToNum(curr.value),
        0
    );

    const convertedLeads = activeLeads.filter((l) => l.status === "Converted");
    const totalConvertedValue = convertedLeads.reduce(
        (acc, curr) => acc + parseCurrencyToNum(curr.value),
        0
    );

    const winRate =
        totalActiveCount > 0
            ? Math.round((convertedLeads.length / totalActiveCount) * 100)
            : 0;

    
    const formatINR = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Card 1: Active Pipelines */}
            <div className="bg-[#121212] border rounded-xl p-5 border-[#d4af37]/40 transition-all duration-200">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Active Pipelines
                    </span>
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white font-mono tracking-tight">
                        {totalActiveCount}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">Deals Active</span>
                </div>
            </div>

            {/* Card 2: Total Pipeline Value */}
            <div className="bg-[#121212] border rounded-xl p-5 border-[#d4af37]/40 transition-all duration-200">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Pipeline Value
                    </span>
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1" />
                </div>
                <div className="mt-4">
                    <span className="text-3xl font-bold text-white font-mono tracking-tight">
                        {formatINR(totalPipelineValue)}
                    </span>
                </div>
            </div>

            {/* Card 3: Closed Revenue */}
            <div className="bg-[#121212] border  rounded-xl p-5 border-[#d4af37]/40 transition-all duration-200">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Closed Revenue
                    </span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1" />
                </div>
                <div className="mt-4">
                    <span className="text-3xl font-bold text-emerald-400 font-mono tracking-tight">
                        {formatINR(totalConvertedValue)}
                    </span>
                </div>
            </div>

            {/* Card 4: Conversion Win Rate */}
            <div className="bg-[#121212] border  rounded-xl p-5 border-[#d4af37]/40 transition-all duration-200">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Conversion Rate
                    </span>
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1" />
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-cyan-400 font-mono tracking-tight">
                        {winRate}
                    </span>
                    <span className="text-xl font-bold text-cyan-400 font-mono">%</span>
                </div>
            </div>
        </div>
    );
}
