import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

const CustomSelect = ({
  label,
  placeholder = "Select",
  options = [],
  value,
  onValueChange,
  width = "w-56",
  required = false,
  error,
  variant, 
}) => {
  const isPill = variant === "pill";

  return (
    // 🚀 Jab label nahi hoga tab flex layout ki default rules ko override karke simple layout block force karenge
    <div className={`relative ${label ? "flex flex-col gap-1.5" : "inline-flex items-center"} ${width}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger
          className={`
            flex
            w-full
            items-center
            justify-between
            cursor-pointer
            outline-none
            transition-all
            duration-300
            border
            border-zinc-800
            hover:border-[#FFC107]
            text-zinc-300
            hover:text-white
            
            /* 🚀 REAL-TIME PERFECT HEIGHT LOCK */
            ${isPill 
              ? "h-9 text-xs font-medium px-4 bg-[#1a1a1b] rounded-full gap-2 leading-none" 
              : "h-12 text-sm px-4 bg-[#1a1a1b] rounded-xl gap-4 leading-none"
            }
          `}
          style={isPill ? { height: '36px', paddingTop: 0, paddingBottom: 0 } : {}}
        >
          {/* 🚀 Value container space alignment reset */}
          <span className="truncate block leading-none select-none">
            <Select.Value placeholder={placeholder} />
          </span>

          <Select.Icon className="flex items-center justify-center flex-shrink-0 ml-1 h-full">
            <ChevronDown
              size={isPill ? 13 : 16}
              className="
                text-[#FFC107]
                transition-transform
                duration-300
                data-[state=open]:rotate-180
              "
            />
          </Select.Icon>
        </Select.Trigger>

        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            disableOutsidePointerEvents={false}
            className="
              z-[9999]
              w-[var(--radix-select-trigger-width)]
              overflow-hidden
              rounded-xl
              border
              border-zinc-800
              bg-[#1a1a1a]
              shadow-[0_10px_35px_rgba(0,0,0,.65)]
            "
          >
            <Select.Viewport className="p-1.5 max-h-60">
              {options.map((option) => {
                const optionLabel = typeof option === "string" ? option : option.label;
                const optionValue = typeof option === "string" ? option : option.value;

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
                      py-2
                      text-xs
                      font-medium
                      text-zinc-300
                      cursor-pointer
                      outline-none
                      transition-all
                      duration-150
                      data-[highlighted]:bg-[rgba(244,194,28,.15)]
                      data-[highlighted]:text-[#FFC107]
                    "
                  >
                    <Select.ItemText>{optionLabel}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check size={14} className="text-[#FFC107]" />
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