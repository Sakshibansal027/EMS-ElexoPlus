import { Pencil, Trash2, X } from "lucide-react";

const FooterActions = ({ onClose, onEdit, onDelete }) => {
  return (
    <div
      className="
      mt-10
      flex
      flex-wrap
      justify-end
      gap-4
      border-t
      border-[var(--color-border)]
      pt-6
      "
    >
      {/* Edit */}

      <button
        onClick={onEdit}
        className="
        flex
        items-center
        gap-2
        rounded-xl
        bg-[var(--color-primary)]
        px-5
        py-3
        font-medium
        text-black
        transition-all
        duration-300
        hover:scale-105
        hover:bg-[var(--color-primary-hover)]
        cursor-pointer
        "
      >
        <Pencil size={18} />
        Edit Employee
      </button>

      {/* Delete */}

      <button
        onClick={onDelete}
        className="
        flex
        items-center
        gap-2
        rounded-xl
        border
        border-red-500
        px-5
        py-3
        text-red-500
        transition-all
        duration-300
        hover:bg-red-500
        hover:text-white
        cursor-pointer
        "
      >
        <Trash2 size={18} />
        Delete
      </button>

      {/* Close */}

      <button
        onClick={onClose}
        className="
        flex
        items-center
        gap-2
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-secondary)]
        px-5
        py-3
        transition-all
        duration-300
        hover:border-[var(--color-primary)]
        hover:text-[var(--color-primary)]
        cursor-pointer
        "
      >
        <X size={18} />
        Close
      </button>
    </div>
  );
};

export default FooterActions;
