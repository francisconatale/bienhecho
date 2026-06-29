import { ChevronRight } from "lucide-react";

export interface ActionRowProps {
  label: string;
  onClick?: () => void;
}

export function ActionRow({ label, onClick }: ActionRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] text-left hover:bg-surface-variant/30 active:bg-surface-variant/50 transition-colors border-b border-outline-variant/10 last:border-0 bg-surface group"
    >
      <span className="font-medium text-on-surface text-sm">{label}</span>
      <ChevronRight
        className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors shrink-0"
        strokeWidth={2.5}
      />
    </button>
  );
}
