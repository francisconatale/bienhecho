"use client";

import { ChevronRight } from "lucide-react";
import { Toggle } from "./toggle";

interface RowBaseProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  isLast?: boolean;
}

interface RowNavProps extends RowBaseProps {
  type: "nav";
  value?: string;
  onClick?: () => void;
}

interface RowToggleProps extends RowBaseProps {
  type: "toggle";
  checked: boolean;
  onToggle: (val: boolean) => void;
}

interface RowDestructiveProps {
  type: "destructive";
  label: string;
  onClick?: () => void;
}

type RowProps = RowNavProps | RowToggleProps | RowDestructiveProps;

export function Row(props: RowProps) {
  const borderClass = "border-b border-outline-variant/10 last:border-0";

  if (props.type === "destructive") {
    return (
      <button
        onClick={props.onClick}
        className={`w-full flex items-center justify-center px-4 py-3 min-h-[52px] hover:bg-error/10 transition-colors text-center ${borderClass}`}
      >
        <span className="font-bold text-error">{props.label}</span>
      </button>
    );
  }

  const { icon, iconBg, label, isLast } = props;
  const base = `flex items-center gap-4 px-5 py-3.5 min-h-[56px] transition-colors ${isLast ? "" : borderClass}`;

  if (props.type === "toggle") {
    return (
      <div className={`${base} bg-transparent`}>
        <div
          className={`w-[36px] h-[36px] rounded-[12px] ${iconBg} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <span className="flex-1 font-semibold text-on-surface">{label}</span>
        <Toggle checked={props.checked} onChange={props.onToggle} />
      </div>
    );
  }

  // nav row
  return (
    <button
      onClick={props.onClick}
      className={`${base} w-full text-left hover:bg-surface-variant/10 group`}
    >
      <div
        className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <span className="flex-1 font-medium text-on-surface">{label}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        {props.value && (
          <span className="text-sm text-on-surface-variant">{props.value}</span>
        )}
        <ChevronRight
          className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors"
          strokeWidth={2.5}
        />
      </div>
    </button>
  );
}
