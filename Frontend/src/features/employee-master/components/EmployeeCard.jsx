import {
  Mail,
  Phone,
  Calendar,
  User,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const EmployeeCard = ({ employee, onView, onEdit }) => {
  return (
    <div
      className="
        card
        group
        relative
        overflow-hidden
        rounded-2xl
        border-l-4
        border-l-[var(--color-primary)]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--color-primary)]
       hover:shadow-[0_6px_20px_rgba(244,194,28,.08)]
      "
    >
      {/* Top Section */}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[var(--color-primary)]
              text-xl
              font-bold
              text-black
              shadow-[var(--shadow-primary)]
            "
          >
            {employee.name.charAt(0)}
          </div>

          {/* Name & ID */}
          <div>
            <h3
              className="
                text-lg
                font-semibold
                transition-colors
                duration-300
                group-hover:text-[var(--color-primary)]
              "
            >
              {employee.name}
            </h3>

            <span
              className="
                mt-2
                inline-block
                rounded-full
                bg-[var(--color-secondary)]
                px-3
                py-1
                text-xs
                font-medium
                text-[var(--color-primary)]
              "
            >
              {employee.id}
            </span>
          </div>
        </div>

        {/* Status */}
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap ${employee.status === "Active"
            ? "border-green-500/20 bg-green-500/10 text-green-400"
            : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${employee.status === "Active"
              ? "bg-green-400"
              : "bg-red-400"
              }`}
          />
          {employee.status}
        </span>
      </div>

      {/* Divider */}

      <div
        className="
          my-5
          h-px
          bg-gradient-to-r
          from-transparent
          via-[var(--color-primary)]
          to-transparent
          opacity-40
        "
      />

      {/* Details */}

      <div className="space-y-4 text-sm">
        {/* Designation */}
        <p className="font-semibold text-[var(--color-primary)]">
          {employee.designation}
        </p>

        {/* Department */}
        <div className="flex items-center gap-3 text-[var(--color-foreground-muted)]">
          <User
            size={16}
            className="shrink-0 text-[var(--color-primary)]"
          />
          <span>Department : {employee.department}</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 text-[var(--color-foreground-muted)]">
          <Mail
            size={16}
            className="shrink-0 text-[var(--color-primary)]"
          />
          <span>{employee.email}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 text-[var(--color-foreground-muted)]">
          <Phone
            size={16}
            className="shrink-0 text-[var(--color-primary)]"
          />
          <span>{employee.phone}</span>
        </div>

        {/* Joining Date */}
        <div className="flex items-center gap-3 text-[var(--color-foreground-muted)]">
          <Calendar
            size={16}
            className="shrink-0 text-[var(--color-primary)]"
          />
          <span>{employee.joiningDate}</span>
        </div>

        {/* Manager */}
        <div className="flex items-center gap-3 text-[var(--color-foreground-muted)]">
          <User
            size={16}
            className="shrink-0 text-[var(--color-primary)]"
          />
          <span>
            Manager :
            <strong className="ml-1 text-white">
              {employee.manager}
            </strong>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="
          my-5
          h-px
          bg-gradient-to-r
          from-transparent
          via-[var(--color-primary)]
          to-transparent
          opacity-40
        "
      />

      {/* Footer */}

      <div className="mt-3">

        {/* Joining Date */}
        <div className="mb-4 flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <Calendar
            size={16}
            className="text-[var(--color-primary)]"
          />

          <span>
            Joined on{" "}
            <span className="font-medium text-white">
              {employee.joiningDate}
            </span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-start gap-3">

          <button
            onClick={onView}
            className="
        flex items-center gap-2
        rounded-xl
        bg-[var(--color-secondary)]
        px-4 py-2
        text-sm
        text-[var(--color-primary)]
        transition-all duration-300
        hover:bg-[var(--color-primary)]
        hover:text-black
      "
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => onEdit(employee)}
            className="
        flex items-center gap-2
        rounded-xl
        bg-[var(--color-secondary)]
        px-4 py-2
        text-sm
        text-[var(--color-primary)]
        transition-all duration-300
        hover:bg-[var(--color-primary)]
        hover:text-black
      "
          >
            <Pencil size={16} />
          </button>

          <button
            className="
        flex items-center gap-2
        rounded-xl
        bg-[var(--color-secondary)]
        px-4 py-2
        text-sm
        text-red-400
        transition-all duration-300
        hover:bg-red-500
        hover:text-white
      "
          >
            <Trash2 size={16} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default EmployeeCard;
