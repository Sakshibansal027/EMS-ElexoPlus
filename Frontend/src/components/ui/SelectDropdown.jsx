import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

const SelectDropdown = ({
  value,
  onValueChange,
  options = [],
  placeholder = "Select",
  className = "",
}) => {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={`
          flex h-12 w-full cursor-pointer items-center justify-between
          gap-4 rounded-xl border border-border bg-input
          px-4 text-sm leading-none text-foreground outline-none
          transition-all duration-300
          hover:border-primary hover:text-foreground
          ${className}
        `}
      >
        <span className="block truncate leading-none select-none">
          <Select.Value placeholder={placeholder} />
        </span>
        <Select.Icon className="flex flex-shrink-0 items-center justify-center">
          <ChevronDown
            size={16}
            className="text-primary transition-transform duration-300 data-[state=open]:rotate-180"
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="
            z-[9999]
            w-[var(--radix-select-trigger-width)]
            overflow-hidden
            rounded-xl
            border
            border-border
            bg-card
            shadow-lg
          "
        >
          <Select.Viewport className="max-h-60 p-1.5">
            {options.map((opt) => {
              const label = typeof opt === "string" ? opt : opt.label;
              const val = typeof opt === "string" ? opt : opt.value;
              return (
                <Select.Item
                  key={val}
                  value={val}
                  disabled={typeof opt !== "string" && opt.disabled}
                  className="
                    relative
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-2.5
                    text-xs
                    font-medium
                    text-foreground-muted
                    outline-none
                    transition-all
                    duration-150
                    data-[disabled]:pointer-events-none
                    data-[disabled]:opacity-50
                    data-[highlighted]:bg-primary/10
                    data-[highlighted]:text-primary
                    data-[state=checked]:text-primary
                  "
                >
                  <Select.ItemText>{label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={14} className="text-primary" />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default SelectDropdown;
