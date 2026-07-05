import { RotateCcw, Save, X } from "lucide-react";

const ModalFooter = ({ onClose, onSave, onReset }) => {
  return (
    <div
      className="
      sticky
      bottom-0
      flex
      items-center
      justify-end
      gap-4
      border-t
      border-[var(--color-border)]
      bg-[var(--color-card)]
      px-8
      py-5
      "
    >
      {/* Cancel */}

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
        hover:border-red-500
        hover:text-red-400
        cursor-pointer
        "
      >
        <X size={18} />
        Cancel
      </button>

      {/* Reset */}

      <button
        className="
        flex
        items-center
        gap-2
        rounded-xl
        border
        border-[var(--color-primary)]
        px-5
        py-3
        text-[var(--color-primary)]
        transition-all
        duration-300
        hover:bg-[rgba(244,194,28,.12)]
        cursor-pointer
        " onClick={onReset}
      >
        <RotateCcw size={18} />
        Reset
      </button>

      {/* Save */}

      <button
        className="
        flex
        items-center
        gap-2
        rounded-xl
        bg-[var(--color-primary)]
        px-6
        py-3
        font-semibold
        text-black
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-[0_0_18px_rgba(244,194,28,.25)]
        cursor-pointer
        "   onClick={onSave}
      >
        <Save size={18} />
        Save Employee
      </button>
    </div>
  );
};

export default ModalFooter;