
const PayrollCycleWorkflow = ({
    stages = [],
    currentStage = 1,
    monthYear = "July 2026",
    isAttendanceFrozen = false,
    isSubmitting = false,
    onFreezeAttendance,
    onSubmitToFinance,
}) => {

    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-[var(--color-primary)]/50 w-full space-y-6">

            {/* Header */}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[var(--color-border)] pb-4">

                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xs font-bold tracking-wider uppercase text-[var(--color-primary)]">
                            Payroll Cycle Workflow
                        </h2>

                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                            {monthYear}
                        </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-1">
                        Monitor payroll processing workflow
                    </p>
                </div>

                <div className="flex gap-3">

                    <button
                        onClick={onFreezeAttendance}
                        disabled={
                            isAttendanceFrozen
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                            isAttendanceFrozen
                                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-not-allowed"
                                : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                        }`}
                    >
                        {isAttendanceFrozen
                            ? "✓ Attendance Frozen"
                            : "Freeze Attendance"}
                    </button>

                    <button
                        onClick={onSubmitToFinance}
                        disabled={
                            !isAttendanceFrozen ||
                            currentStage !== 2 ||
                            isSubmitting
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                            currentStage > 2
                                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-not-allowed"
                                : isAttendanceFrozen
                                ? "bg-[var(--color-primary)] text-black hover:opacity-90"
                                : "bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed"
                        }`}
                    >
                        {currentStage > 2
                            ? "✓ Submitted to Finance"
                            : isSubmitting
                            ? "Submitting..."
                            : "Submit to Finance"}
                    </button>

                </div>
            </div>

            {/* Workflow */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {stages.map((stage) => {

                    const stageId =
                        Number(stage.id);

                    const isCompleted =
                        stageId < currentStage;

                    const isActive =
                        stageId === currentStage;

                    return (
                        <div
                            key={stage.id}
                            className={`rounded-xl border p-5 transition-all duration-300 relative

                            ${
                                isActive
                                    ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/10"
                                    : isCompleted
                                    ? "border-emerald-500/40 bg-emerald-500/5"
                                    : "border-zinc-800 bg-transparent opacity-60"
                            }`}
                        >
                            <div className="flex justify-between items-center">

                                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                                    {stage.stageNumber}
                                </span>

                                {isCompleted && (
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black text-xs font-bold">
                                        ✓
                                    </div>
                                )}

                                {isActive && (
                                    <div className="relative">
                                        <span className="absolute w-3 h-3 rounded-full bg-yellow-400 animate-ping"></span>

                                        <span className="relative block w-3 h-3 rounded-full bg-yellow-400"></span>
                                    </div>
                                )}

                                {!isCompleted &&
                                    !isActive && (
                                        <div className="w-4 h-4 rounded-full border border-zinc-600"></div>
                                    )}
                            </div>

                            <h3
                                className={`mt-4 font-bold text-base ${
                                    isCompleted
                                        ? "text-emerald-400"
                                        : isActive
                                        ? "text-yellow-400"
                                        : "text-white"
                                }`}
                            >
                                {stage.title}
                            </h3>

                            <p className="mt-2 text-xs text-zinc-400">
                                {isCompleted
                                    ? "Completed"
                                    : isActive
                                    ? "Currently Processing"
                                    : "Waiting"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PayrollCycleWorkflow;

