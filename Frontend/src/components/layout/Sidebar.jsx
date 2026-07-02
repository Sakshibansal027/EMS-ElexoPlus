import { NavLink } from "react-router-dom";
import MENUS from "../../config/navigation/menu";

const Sidebar = ({ role, user }) => {
  const menu = MENUS[role] || [];

  return (
    <aside className="w-72 h-screen bg-background-secondary border-r border-border flex flex-col">
      {/* ==================================================
                          Logo
      ================================================== */}

      <div className="h-24 shrink-0 border-b border-border px-6 flex items-center gap-4">
        <div
          className="
            h-12
            w-12
            rounded-xl
            bg-primary
            text-black
            flex
            items-center
            justify-center
            text-xl
            font-black
            shadow-[var(--shadow-primary)]
          "
        >
          ⚡
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            ElexoPlus
          </h2>

          <p className="text-xs uppercase tracking-[0.25em] text-foreground-muted">
            Admin Portal
          </p>
        </div>
      </div>

      {/* ==================================================
                      Navigation
      ================================================== */}

      <nav className="sidebar-scroll flex-1 overflow-y-auto">
        <ul className="space-y-1 px-4 py-6">
          {menu
            .filter((item) => item.visible)
            .map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      group
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-[15px]
                      font-medium
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? "bg-primary text-black shadow-[var(--shadow-primary)]"
                          : "text-foreground-muted hover:bg-card hover:text-primary"
                      }

                      ${item.disabled ? "pointer-events-none opacity-50" : ""}
                    `}
                  >
                    {Icon && (
                      <Icon
                        size={20}
                        className="
                          flex-shrink-0
                          transition-transform
                          duration-300
                          group-hover:scale-110
                        "
                      />
                    )}

                    <span className="flex-1">{item.label}</span>

                    {item.badge && (
                      <span
                        className="
                          rounded-full
                          bg-danger
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
              );
            })}
        </ul>
      </nav>

      {/* ==================================================
                          Footer
      ================================================== */}

      <div className="shrink-0 border-t border-border p-4">
        <div
          className="
            card
            p-4
            transition-all
            duration-300
            hover:border-primary
            hover:shadow-[var(--shadow-primary)]
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                h-11
                w-11
                rounded-full
                bg-primary
                text-black
                font-bold
                flex
                items-center
                justify-center
              "
            >
              {user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>

              <p className="text-xs text-foreground-muted">{user.designation}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />

            <span className="text-xs text-foreground-muted">{user.status}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
