import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  FileText,
  Users,
  ClipboardList,
  Target,
  TrendingUp,
  MapPinned,
  Package,
  HelpCircle
} from "lucide-react";

const HeroBanner = ({ user, heroData }) => {
  const navigate = useNavigate();

  /* =========================================
                Greeting
  ========================================= */

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";

    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  }, []);

  /* =========================================
                Today's Date
  ========================================= */

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  /* =========================================
                Action Icons
  ========================================= */

  const ACTION_ICONS = {
    employee: UserPlus,
    reports: FileText,
    refresh: RefreshCw,
    leave: ClipboardList,
    records: Users,
    performance: TrendingUp,
    targets: Target,
    visit: MapPinned,
    orders: Package,
    route: Target,
  };

  /* =========================================
                Navigation
  ========================================= */

  const handleAction = (item) => {
    if (item.route) {
      navigate(item.route);

      return;
    }

    if (item.icon === "refresh") {
      window.location.reload();
    }
  };

  return (
    <section className="hero-card glow-primary p-8 lg:p-10">
      {/* =========================================
                    Top
      ========================================= */}

      <div className="flex flex-wrap items-center justify-between gap-5">
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-primary/30
            bg-primary/10
            px-4
            py-2
            text-sm
            font-semibold
            text-primary
          "
        >
          <ShieldCheck size={16} />

          {heroData.badge}
        </div>

        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-green-500/20
            bg-green-500/10
            px-4
            py-2
            text-sm
            font-medium
            text-green-400
          "
        >
          <span className="pulse-dot" />

          {heroData.status}
        </div>
      </div>

      {/* =========================================
                  Heading
      ========================================= */}

      <div className="mt-8">
        <h1 className="text-4xl font-bold leading-tight text-foreground">
          {greeting}, <span className="text-primary">{user.name}</span>
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground-muted">
          {heroData.description}
        </p>
      </div>

      {/* =========================================
                  Actions
      ========================================= */}

      <div className="mt-10 flex flex-wrap gap-4">
        {heroData.actions.map((item) => {
          const Icon = ACTION_ICONS[item.icon] || HelpCircle;

          return (
            <button
              key={item.id}
              onClick={() => handleAction(item)}
              className="
                hero-action
                group
              "
            >
              <Icon size={18} />

              <span>{item.label}</span>

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          );
        })}
      </div>

      {/* =========================================
                    Footer
      ========================================= */}

      <div
        className="
          mt-10
          flex
          flex-wrap
          items-center
          justify-between
          gap-5
          border-t
          border-border
          pt-6
        "
      >
        <div className="flex items-center gap-3 text-sm text-foreground-muted">
          <CalendarDays size={18} />

          {today}
        </div>

        <div className="text-sm font-medium text-foreground">
          {user.designation}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
