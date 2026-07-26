import React, { useState, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";

export const CustomDropdown = ({ value, onChange, options, placeholder = "Select Option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Side-effect delegate to custom hook
  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative w-full text-xs" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 flex justify-between items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] cursor-pointer hover:border-[var(--color-primary)] transition-all duration-200"
      >
        <span className="font-semibold text-[var(--color-foreground)]">
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--color-primary)] transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[10005] w-full mt-2 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl shadow-xl p-1.5 flex flex-col gap-0.5">
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`flex justify-between items-center p-2.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-bold"
                    : "text-[var(--color-foreground)] hover:bg-[var(--color-card-hover)] font-medium"
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-4 h-4 text-[var(--color-primary)]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};