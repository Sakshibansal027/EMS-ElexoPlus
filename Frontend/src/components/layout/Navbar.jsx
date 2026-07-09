import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../features/auth/hooks/useAuth";
import { ROUTES } from "../../routes/routes";

import MENUS from "../../config/navigation/menu";

const Navbar = ({ role, user }) => {
  const location = useLocation();

  const dropdownRef = useRef(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const currentPage = useMemo(() => {
    const menu = MENUS[role] || [];

    return (
      menu.find((item) => item.path === location.pathname) || {
        label: "Dashboard",
      }
    );
  }, [location.pathname, role]);

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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
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

        <button
          className="
            icon-button
            glass
            hover-lift
            relative
            border
            border-border
          "
        >
          <Bell size={20} className="text-foreground" />

          <span
            className="
              absolute
              right-3
              top-3
              h-2
              w-2
              rounded-full
              bg-danger
            "
          />
        </button>

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
