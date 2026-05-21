"use client";

import { WandSparkles } from "lucide-react";

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="pt-2">
      <div className="flex items-center gap-2 mb-2">
        <WandSparkles className="w-3.5 h-3.5 text-blue-500/80" />
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Sugerencias
        </h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
