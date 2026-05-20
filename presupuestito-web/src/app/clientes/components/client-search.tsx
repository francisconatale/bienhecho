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
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant pointer-events-none"
        strokeWidth={2}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar clientes..."
        className="w-full bg-surface rounded-2xl border border-outline-variant/30 shadow-sm pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}
