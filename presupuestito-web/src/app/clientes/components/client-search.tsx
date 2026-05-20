"use client";

import { Search } from "lucide-react";

interface ClientSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientSearch({ value, onChange }: ClientSearchProps) {
  return (
    <div className="relative w-full">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none"
        strokeWidth={2.5}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar clientes..."
        className="w-full bg-surface/80 dark:bg-surface-dim/60 backdrop-blur-3xl rounded-full border border-outline-variant/10 shadow-sm pl-11 pr-5 py-3.5 text-[15px] font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
      />
    </div>
  );
}
