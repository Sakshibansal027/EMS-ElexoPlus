import {
  BadgeCheck,
  Building2,
  Mail,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

const ROLE_BADGES = {
  Admin: "bg-red-500/10 text-red-500 border-red-500/20",
  HR: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ASM: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "Sales Executive":
    "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const ProfileHeader = ({ user, profile, onChangePassword, canChangePassword }) => {
  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <section className="dashboard-card p-8">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* ======================================================
                          Left Section
        ====================================================== */}

        <div className="flex items-center gap-6">

          {/* Avatar */}

          <div
            className="
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              bg-primary
              text-3xl
              font-bold
              text-black
              shadow-[var(--shadow-primary)]
            "
          >
            {initials}
          </div>

          {/* User Info */}

          <div>

            <h1 className="text-3xl font-bold text-foreground">
              {user.name}
            </h1>

            <p className="mt-1 text-foreground-muted">
              {user.designation}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">

              {/* Role */}

              <span
                className={`
                  rounded-full
                  border
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${ROLE_BADGES[user.role]}
                `}
              >
                <ShieldCheck size={14} className="mr-1 inline" />

                {user.role}

              </span>

              {/* Employee ID */}

              <span
                className="
                  rounded-full
                  border
                  border-border
                  px-3
                  py-1
                  text-xs
                  text-foreground-muted
                "
              >
                <BadgeCheck size={14} className="mr-1 inline" />

                {profile.employment[0].value}

              </span>

              {/* Status */}

              <span
                className="
                  rounded-full
                  bg-success/10
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-success
                "
              >
                ● {user.status}
              </span>

            </div>

          </div>

        </div>

        {/* ======================================================
                          Right Section
        ====================================================== */}

        <div className="flex flex-col gap-4">

          <div className="flex items-center gap-3 text-sm text-foreground-muted">

            <Mail size={18} />

            {user.email}

          </div>

          <div className="flex items-center gap-3 text-sm text-foreground-muted">

            <Building2 size={18} />

            {profile.employment[1].value}

          </div>

          {canChangePassword && (

            <button
              onClick={onChangePassword}
              className="
            mt-2
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-5
            py-3
            font-semibold
            text-black
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-[var(--shadow-primary)]
        "
            >
              <KeyRound size={18} />

              Change Password

            </button>

          )}

        </div>

      </div>

    </section>
  );
};

export default ProfileHeader;