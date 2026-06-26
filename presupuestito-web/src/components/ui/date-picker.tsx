"use client";

import "@natscale/react-calendar/dist/main.css";
import { Calendar } from "@natscale/react-calendar";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const MONTHS: Record<number, string> = {
  0: "Enero", 1: "Febrero", 2: "Marzo", 3: "Abril",
  4: "Mayo", 5: "Junio", 6: "Julio", 7: "Agosto",
  8: "Septiembre", 9: "Octubre", 10: "Noviembre", 11: "Diciembre",
};

const WEEKDAYS: Record<number, string> = {
  0: "Dom", 1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb",
};

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date | undefined>(value);

  const handleChange = useCallback(
    (val: unknown) => {
      const date = Array.isArray(val) ? (val as Date[])[0] : (val as Date);
      setInternalValue(date);
      onChange?.(date);
    },
    [onChange],
  );

  return (
    <div className={cn("rc-custom", className)}>
      <style>{`
        .rc-custom {
          --rc-color-primary: #3D8B6E;
          --rc-color-primary-light: rgba(61, 139, 110, 0.4);
          --rc-color-primary-lighter: rgba(61, 139, 110, 0.08);
          --rc-color-text-dark: #1A3020;
          --rc-color-text-light: #FFFFFF;
          --rc-color-bg-light: #FFFFFF;
          --rc-color-border: #E8F2EB;
          --rc-color-text-inactive: #B5D0BC;
          --rc-color-text-hover: #E8F2EB;
          --rc-color-border-root: #E8F2EB;
        }
        .dark .rc-custom {
          --rc-color-primary: #6ECFB0;
          --rc-color-primary-light: rgba(110, 207, 176, 0.4);
          --rc-color-primary-lighter: rgba(110, 207, 176, 0.08);
          --rc-color-text-dark: #E8F5E9;
          --rc-color-text-light: #0A2E1A;
          --rc-color-bg-light: #0D1F14;
          --rc-color-border: #1A3D24;
          --rc-color-text-inactive: #5A8A6A;
          --rc-color-text-hover: #1A3D24;
          --rc-color-border-root: #1A3D24;
        }
      `}</style>
      <Calendar
        value={value || internalValue}
        onChange={handleChange}
        monthsLabel={MONTHS}
        weekDaysLabel={WEEKDAYS}
        startOfWeek={1}
        hideAdjacentDates
        fontSize={14}
        size={320}
      />
    </div>
  );
}
