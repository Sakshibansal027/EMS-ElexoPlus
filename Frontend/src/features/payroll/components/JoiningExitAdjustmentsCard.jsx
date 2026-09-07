import InlineLoader from "../../../components/common/InlineLoader";

const JoiningExitAdjustmentsCard = ({
  data = {
    newJoinees: { count: 0, amount: 0 },
    exits: { count: 0, amount: 0 },
  },
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 h-48">
        <InlineLoader message="Loading Adjustments..." />
      </div>
    );
  }

  const { newJoinees, exits } = data;

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-[var(--color-primary)]/50 w-full space-y-4">
      {/* Card Header */}
      <div>
        <h2 className="text-xs font-bold tracking-wider text-[var(--color-primary,yellow)] uppercase">
          JOINING & EXIT ADJUSTMENTS
        </h2>
        <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
          Prorated Salary & Final Settlements
        </p>
      </div>

      {/* Inner Sub-Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* New Joinees Box */}
        <div className="bg-[var(--color-card-sub,rgba(255,255,255,0.03))] border border-[var(--color-border)]/60 rounded-xl p-4 space-y-2 transition-all duration-200 hover:border-emerald-500/40">
          <p className="text-[10px] font-bold tracking-wide text-emerald-400 uppercase">
            NEW JOINEES (PRORATED)
          </p>
          <p className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">
            {newJoinees.count}{" "}
            <span className="text-sm font-semibold text-[var(--color-foreground-muted)]">
              Emps
            </span>
          </p>
          <p className="text-xs text-[var(--color-foreground-muted)] font-medium">
            ₹{newJoinees.amount.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Exits Box */}
        <div className="bg-[var(--color-card-sub,rgba(255,255,255,0.03))] border border-[var(--color-border)]/60 rounded-xl p-4 space-y-2 transition-all duration-200 hover:border-rose-500/40">
          <p className="text-[10px] font-bold tracking-wide text-rose-400 uppercase">
            EXITS (FULL & FINAL)
          </p>
          <p className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">
            {exits.count}{" "}
            <span className="text-sm font-semibold text-[var(--color-foreground-muted)]">
              Emps
            </span>
          </p>
          <p className="text-xs text-[var(--color-foreground-muted)] font-medium">
            ₹{exits.amount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoiningExitAdjustmentsCard;
