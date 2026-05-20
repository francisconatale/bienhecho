"use client";

import { Search } from "lucide-react";

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProjectSearch({ value, onChange }: ProjectSearchProps) {
  return (
    <div className="relative w-full mb-6 mt-1">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
        strokeWidth={2.5}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar proyectos..."
        className="w-full bg-white/80 dark:bg-[#1A1C20]/60 backdrop-blur-3xl rounded-full border border-black/5 dark:border-white/[0.08] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] pl-11 pr-5 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
      />
    </div>
  );
}