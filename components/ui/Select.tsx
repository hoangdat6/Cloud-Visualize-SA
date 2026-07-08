"use client";

import * as SelectPrimitive from "@radix-ui/react-select";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel?: string;
}

export function Select({ value, onValueChange, options, ariaLabel }: SelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className="inline-flex h-9 items-center justify-between gap-2 rounded-full border-2 border-[var(--text-main)] bg-white px-3.5 text-xs font-bold text-[var(--text-main)] outline-none transition hover:bg-[var(--box-yellow-bg)] focus-visible:border-[var(--text-blue)] focus-visible:ring-2 focus-visible:ring-[var(--box-blue-border)] data-[state=open]:border-[var(--text-blue)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--box-blue-border)]"
      >
        <SelectPrimitive.Value placeholder="Select" />
        <SelectPrimitive.Icon className="text-gray-600">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden bg-white p-1 text-[var(--text-main)] hd-border-soft hd-shadow"
        >
          <SelectPrimitive.Viewport className="flex flex-col gap-0.5 p-0.5">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-xs font-bold text-[var(--text-main)] outline-none transition data-[disabled]:pointer-events-none data-[highlighted]:bg-[var(--box-blue-bg)] data-[state=checked]:bg-[var(--box-yellow-bg)] data-[disabled]:opacity-50"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2.5 text-[var(--text-blue)]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
