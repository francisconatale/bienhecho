"use client";

import { AlertCircle } from "lucide-react";

interface AlertsListProps {
  alerts: any[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  if (alerts.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h2 className="text-xs font-bold text-on-surface-variant px-1">Avisos</h2>
      {alerts.map((a) => (
        <div key={a.id} className="flex gap-3 bg-accent-dark/8 dark:bg-accent-dark/10 border border-accent-dark/20 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 text-accent-dark shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[12px] font-medium text-on-surface leading-snug">{a.mensaje}</p>
        </div>
      ))}
    </div>
  );
}
