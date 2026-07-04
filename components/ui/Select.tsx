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
        className="inline-flex h-9 items-center justify-between gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-xs font-medium text-slate-200 outline-none transition hover:border-white/20 hover:bg-white/[0.06] focus-visible:border-sky-500/60 focus-visible:ring-2 focus-visible:ring-sky-500/30 data-[state=open]:border-sky-500/60 data-[state=open]:ring-2 data-[state=open]:ring-sky-500/30"
      >
        <SelectPrimitive.Value placeholder="Select" />
        <SelectPrimitive.Icon className="text-slate-500">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1 text-slate-200 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <SelectPrimitive.Viewport className="flex flex-col gap-0.5 p-0.5">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-xs font-medium text-slate-300 outline-none transition data-[disabled]:pointer-events-none data-[highlighted]:bg-sky-500/20 data-[highlighted]:text-white data-[state=checked]:bg-sky-500/15 data-[state=checked]:text-sky-200 data-[disabled]:opacity-50"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2.5 text-sky-300">
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
