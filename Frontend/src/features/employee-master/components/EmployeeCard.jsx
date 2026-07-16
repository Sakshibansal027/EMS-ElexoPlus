import {
  Mail,
  Phone,
  Calendar,
  User,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const EmployeeCard = ({ employee,onView,onEdit}) => {
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
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            employee.status === "Active"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          ● {employee.status}
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
            <strong className="ml-1 text-foreground">
              {employee.manager}
            </strong>
          </span>
        </div>
      </div>

      {/* Divider */}

      <div className="my-5 border-t border-[var(--color-border)]" />

      {/* Footer */}

    {/* Footer */}

<div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4">

  <span className="text-xs text-[var(--color-muted-foreground)]">
    Joined: <span className="text-foreground">{employee.joiningDate}</span>
  </span>

  <div className="flex gap-3">

    {/* View */}
    <button
      className="
        flex
        h-10
        w-10
        cursor-pointer
        items-center
        justify-center
        rounded-full
        bg-[var(--color-secondary)]
        text-[var(--color-primary)]
        transition-all
        duration-300
        hover:bg-[var(--color-primary)]
        hover:text-black
      " onClick={onView}
    >
      <Eye size={18} />
    </button>

    {/* Edit */}
    <button
      className="
        flex
        h-10
        w-10
        cursor-pointer
        items-center
        justify-center
        rounded-full
        bg-[var(--color-secondary)]
        text-[var(--color-primary)]
        transition-all
        duration-300
        hover:bg-[var(--color-primary)]
        hover:text-black
      " onClick={() => onEdit(employee)}
    >
      <Pencil size={18} />
    </button>

    {/* Delete */}
    <button
      className="
        flex
        h-10
        w-10
        cursor-pointer
        items-center
        justify-center
        rounded-full
        bg-[var(--color-secondary)]
        text-red-400
        transition-all
        duration-300
        hover:bg-red-500
        hover:text-white
      "
    >
      <Trash2 size={18} />
    </button>

  </div>

</div>
    </div>
  );
};

export default EmployeeCard;
