import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  Wallet,
  IndianRupee,
  CircleAlert,
  UserPlus,
  CalendarClock,
  FileCheck,
  UsersRound,
  Target,
  MapPinned,
  ShoppingCart,
  BadgeIndianRupee,
  HelpCircle
} from "lucide-react";

const ICON_MAP = {
  employees: Users,
  payroll: Wallet,
  sales: IndianRupee,
  approval: CircleAlert,
  joining: UserPlus,
  leave: CalendarClock,
  documents: FileCheck,
  team: UsersRound,
  target: Target,
  visits: MapPinned,
  orders: ShoppingCart,
  incentive: BadgeIndianRupee,
};

const TREND_MAP = {
  up: {
    icon: ArrowUpRight,
    className:
      "bg-success/10 text-success border border-success/20",
  },

  down: {
    icon: ArrowDownRight,
    className:
      "bg-danger/10 text-danger border border-danger/20",
  },

  neutral: {
    icon: Minus,
    className:
      "bg-primary/10 text-primary border border-primary/20",
  },
};

const KPICard = ({ data, onClick }) => {
  const Icon = ICON_MAP[data.icon] || HelpCircle;

  const Trend =
    TREND_MAP[data.trend] || TREND_MAP.neutral;

    const trendText = (data.trend || "neutral").toUpperCase();

  const TrendIcon = Trend.icon;

  return (
    <button
      onClick={onClick}
      className="
        dashboard-card
        group
        w-full
        p-6
        text-left
      "
    >
      {/* ==========================
              Header
      ========================== */}

      <div className="flex items-start justify-between">

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-primary/10
            text-primary
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:rotate-6
          "
        >
          <Icon size={28} />
        </div>

        <div
          className={`
            flex
            items-center
            gap-1
            rounded-full
            px-2.5
            py-1
            text-xs
            font-semibold
            ${Trend.className}
          `}
        >
          <TrendIcon size={14} />

          {trendText}
        </div>

      </div>

      {/* ==========================
              Value
      ========================== */}

      <h2 className="mt-7 text-4xl font-bold text-foreground">

        {data.value}

      </h2>

      {/* ==========================
              Title
      ========================== */}

      <h3 className="mt-2 text-lg font-semibold text-foreground">

        {data.title}

      </h3>

      <p className="mt-1 text-sm text-foreground-muted">

        {data.subtitle}

      </p>

      {/* ==========================
              Footer
      ========================== */}

      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          border-t
          border-border
          pt-4
        "
      >

        <span
          className="
            text-sm
            font-medium
            text-primary
          "
        >
          View Details
        </span>

        <ArrowRight
          size={18}
          className="
            text-primary
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        />

      </div>
    </button>
  );
};

export default KPICard;