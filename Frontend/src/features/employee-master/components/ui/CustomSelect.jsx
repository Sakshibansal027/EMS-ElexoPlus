import * as Select from "@radix-ui/react-select";
import {
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

const CustomSelect = ({
  label,
  placeholder = "Select",
  options = [],
  value,
  onValueChange,
  width = "w-56", // fixed width by default
}) => {
  return (
    <div className={`flex flex-col gap-2 ${width}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      <Select.Root
        value={value}
        onValueChange={onValueChange}
      >
        {/* Trigger */}

        <Select.Trigger
          className="
          flex
          h-12
          w-full
          items-center
          justify-between
          gap-4
          rounded-xl
          border
          border-[var(--color-primary)]
          bg-[var(--color-input)]
          px-4
          text-sm
          cursor-pointer
          outline-none
          transition-all
          duration-300
          focus:ring-2
          focus:ring-[var(--color-primary)]/20
          data-[state=open]:ring-2
          data-[state=open]:ring-[var(--color-primary)]/20
        "
        >
          {/* Selected Text */}

          <Select.Value
            placeholder={placeholder}
            className="truncate"
          />

          {/* Arrow */}

          <Select.Icon className="flex items-center justify-center flex-shrink-0 ml-3">
            <ChevronDown
              size={18}
              className="
              text-[var(--color-primary)]
              transition-transform
              duration-300
              data-[state=open]:rotate-180
              "
            />
          </Select.Icon>
        </Select.Trigger>

        {/* Dropdown */}

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={8}
            className="
            z-50
            w-[var(--radix-select-trigger-width)]
            overflow-hidden
            rounded-xl
            border
            border-[var(--color-primary)]
            bg-[var(--color-card)]
            shadow-[0_10px_35px_rgba(0,0,0,.45)]
            "
          >
        

            <Select.Viewport className="p-2 max-h-60">
              {options.map((option) => {
                const optionLabel =
                  typeof option === "string"
                    ? option
                    : option.label;

                const optionValue =
                  typeof option === "string"
                    ? option
                    : option.value;

                return (
                  <Select.Item
                    key={optionValue}
                    value={optionValue}
                    className="
                    relative
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    cursor-pointer
                    outline-none
                    transition-all
                    duration-200
                    data-[highlighted]:bg-[rgba(244,194,28,.15)]
                    data-[highlighted]:text-[var(--color-primary)]
                  "
                  >
                    <Select.ItemText>
                      {optionLabel}
                    </Select.ItemText>

                    <Select.ItemIndicator>
                      <Check
                        size={16}
                        className="text-[var(--color-primary)]"
                      />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Viewport>

         
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default CustomSelect;