import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  CheckCheck,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../features/auth/hooks/useAuth";
import useNotifications from "../../contexts/useNotifications";
import { ROUTES } from "../../routes/routes";
import { NOTIFICATION_TYPES } from "../../features/notifications/config/notificationTypes";

import MENUS from "../../config/navigation/menu";

const formatHeading = (title) => {
  const words = title.split(" ");

  if (words.length === 1) {
    return {
      white: title,
      yellow: "",
    };
  }

  return {
    white: words.slice(0, -1).join(" "),
    yellow: words[words.length - 1],
  };
};

const Navbar = ({ role, user }) => {
  const location = useLocation();

  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { logout } = useAuth();
  const { unreadCount, recentUnread, markAllAsRead, markAsRead } =
    useNotifications();
  const navigate = useNavigate();

  const currentPage = useMemo(() => {
    const menu = MENUS[role] || [];

    return (
      menu.find((item) => item.path === location.pathname) || {
        label: "Dashboard",
      }
    );
  }, [location.pathname, role]);

  const heading = useMemo(
    () => formatHeading(currentPage.label),
    [currentPage.label]
  );

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";

    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="
        h-24
        px-8
        flex
        items-center
        justify-between
        border-b
        border-border
        bg-background-secondary
      "
    >
      {/* ======================================
                  Left Section
      ====================================== */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {currentPage.label}
        </h1>

        <div className="mt-2 flex items-center gap-2">
          <span className="pulse-dot" />

          <p className="text-sm text-foreground-muted">
            {getGreeting()}, {user.name}
          </p>
        </div>
      </div>
      {/* ======================================
                  Right Section
      ====================================== */}

      <div className="flex items-center gap-4">
        {/* ===========================
                Notification
        =========================== */}

        <div ref={notifDropdownRef} className="relative">
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="
              icon-button
              glass
              hover-lift
              relative
              border
              border-border
              transition-all
              duration-300
            "
          >
            <Bell size={20} className="text-foreground" />

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-[20px]
                  items-center
                  justify-center
                  rounded-full
                  bg-danger
                  px-1
                  text-[10px]
                  font-bold
                  leading-none
                  text-white
                "
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              className="
                dropdown-enter
                absolute
                right-0
                mt-4
                w-[420px]
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-background-elevated
                shadow-lg
                z-50
              "
            >
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span
                      className="
                        flex h-5 min-w-[20px] items-center justify-center
                        rounded-full bg-primary px-1.5
                        text-[10px] font-bold text-primary-foreground
                      "
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="
                      flex items-center gap-1 text-xs
                      text-muted-foreground transition-colors
                      hover:text-primary
                    "
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                {recentUnread.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="mb-3 rounded-full bg-primary/5 p-3">
                      <Bell size={28} className="text-primary/40" />
                    </div>
                    <p className="text-sm font-medium text-foreground-muted">
                      No new notifications
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      You're all caught up!
                    </p>
                  </div>
                ) : (
                  recentUnread.map((notif, idx) => {
                    const catConfig =
                      NOTIFICATION_TYPES[notif.category] ||
                      NOTIFICATION_TYPES.system;
                    const CatIcon = catConfig.icon;

                    return (
                      <button
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          setIsNotifOpen(false);
                          if (notif.link) navigate(notif.link);
                        }}
                        className={`
                          group relative flex w-full items-start gap-3
                          border-l-[3px] border-l-transparent
                          px-5 py-3.5 text-left
                          transition-all duration-200
                          hover:border-l-primary hover:bg-primary/[0.03]
                          ${idx !== recentUnread.length - 1 ? "border-b border-border/30" : ""}
                        `}
                      >
                        <div
                          className={`
                            flex-shrink-0 rounded-lg p-2
                            transition-all duration-200
                            group-hover:scale-105
                            ${catConfig.bg}
                          `}
                        >
                          <CatIcon size={14} className={catConfig.color} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                            {notif.title}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {notif.message}
                          </p>
                        </div>
                        <span className="mt-0.5 flex-shrink-0 text-[10px] text-muted-foreground/60">
                          {(() => {
                            const diff = Date.now() - new Date(notif.createdAt).getTime();
                            const mins = Math.floor(diff / 60000);
                            if (mins < 1) return "now";
                            if (mins < 60) return `${mins}m`;
                            const hrs = Math.floor(mins / 60);
                            if (hrs < 24) return `${hrs}h`;
                            const days = Math.floor(hrs / 24);
                            return `${days}d`;
                          })()}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="border-t border-border/60 p-3">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate(ROUTES.NOTIFICATIONS);
                  }}
                  className="
                    flex w-full items-center justify-center gap-2
                    rounded-lg py-2.5 text-sm font-medium
                    text-primary transition-all duration-200
                    hover:bg-primary/10
                  "
                >
                  View all notifications
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===========================
                  Profile
        =========================== */}

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="
              glass
              hover-lift
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-border
              px-3
              py-2
              transition-all
              duration-300
            "
          >
            {/* Avatar */}

            <div className="avatar">{initials}</div>

            {/* User */}

            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                {user.name}
              </p>

              <p className="text-xs text-foreground-muted">
                {user.designation}
              </p>
            </div>

            <ChevronDown
              size={18}
              className={`
                transition-transform
                duration-300
                ${isProfileOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* ===========================
                  Dropdown
          =========================== */}

          {isProfileOpen && (
            <div
              className="
                dropdown-enter
                glass
                card
                absolute
                right-0
                mt-4
                w-72
                overflow-hidden
                z-50
              "
            >
              {/* Header */}

              <div className="border-b border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="avatar">{initials}</div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      {user.name}
                    </h3>

                    <p className="text-sm text-foreground-muted">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu */}

              <div className="p-2">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(ROUTES.PROFILE);
                  }}
                  className="
                    hover-lift
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    transition-all
                    hover:bg-card-hover
                    hover:text-primary
                  "
                >
                  <User size={18} />
                  My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="
                    hover-lift
                    mt-1
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-danger
                    transition-all
                    hover:bg-danger/10
                  "
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
