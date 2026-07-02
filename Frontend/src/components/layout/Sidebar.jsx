import { NavLink } from "react-router-dom";
import { MENUS } from "../../config/navigation/menu";

const Sidebar = ({ role }) => {
  const menu = MENUS[role] || [];

  return (
    <aside
      className="
        w-72
        h-screen
        flex
        flex-col
        bg-[var(--surface)]
        border-r
        border-[var(--border-color)]
        shadow-sm
      "
    >
      {/* ==========================================
          Logo Section
      ========================================== */}

      <div className="h-20 px-6 flex items-center border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            ElexoPlus
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            Employee Management System
          </p>
        </div>
      </div>

      {/* ==========================================
          Navigation
      ========================================== */}

      <nav className="flex-1 overflow-y-auto py-5 px-3">
        <ul className="space-y-2">
          {menu
            .filter((item) => item.visible)
            .map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-[var(--primary)] text-white shadow-md"
                        : "text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--text-primary)]"
                    }

                    ${item.disabled ? "pointer-events-none opacity-50" : ""}
                  `
                  }
                >
                  {/* Icon Placeholder */}

                  <div className="w-5 h-5 flex items-center justify-center">
                    {item.icon ?? (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>

                  {/* Label */}

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {/* Badge */}

                  {item.badge && (
                    <span
                      className="
                        rounded-full
                        bg-red-500
                        px-2
                        py-0.5
                        text-xs
                        text-white
                      "
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>

      {/* ==========================================
          Footer
      ========================================== */}

      <div className="border-t border-[var(--border-color)] p-5">
        <div
          className="
            rounded-xl
            bg-[var(--background)]
            p-4
          "
        >
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Administrator
          </p>

          <p className="text-xs text-[var(--text-secondary)] mt-1">
            admin@elexoplus.com
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;