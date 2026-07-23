"use client";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "h-9 px-3 py-2 text-xs",
  md: "h-11 px-3.5 py-2.5 text-sm",
};

const CLEAR_VALUE = "__clear__";

export function SelectInput({
  value,
  onValueChange,
  options,
  placeholder = "Seleccionar",
  className,
  size = "md",
}: SelectInputProps) {
  return (
    <Select
      value={value || CLEAR_VALUE}
      onValueChange={(v) => onValueChange(v === CLEAR_VALUE ? "" : v)}
    >
      <SelectTrigger
        aria-label={placeholder}
        className={cn(
          "bg-grouped-bg-light border border-outline-variant/20 rounded-xl text-on-surface font-semibold shadow-none focus:ring-2 focus:ring-primary/20",
          sizeClasses[size],
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="rounded-xl border-outline-variant/20 bg-surface shadow-lg z-[110] min-w-[var(--radix-select-trigger-width)]"
      >
        <SelectItem
          value={CLEAR_VALUE}
          className="rounded-lg text-sm font-semibold text-on-surface-variant/60 focus:bg-primary/10 focus:text-primary"
        >
          {placeholder}
        </SelectItem>
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="rounded-lg text-sm font-semibold text-on-surface focus:bg-primary/10 focus:text-primary"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
