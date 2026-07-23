"use client";

import { AlertCircle } from "lucide-react";

interface AlertsListProps {
  alerts: any[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  if (alerts.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h2 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Avisos</h2>
      {alerts.map((a) => (
        <div key={a.id} className="flex gap-3 bg-amber-500/8 dark:bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[12px] font-medium text-on-surface leading-snug">{a.mensaje}</p>
        </div>
      ))}
    </div>
  );
}
