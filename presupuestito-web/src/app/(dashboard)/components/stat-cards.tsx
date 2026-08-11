"use client";
import { formatCurrency } from "@/lib/utils";

interface StatCardsProps {
  stats: { totalJobs: number; totalToInvoice: number };
  row?: boolean;
}

export function StatCards({ stats, row = false }: StatCardsProps) {
  const { totalJobs, totalToInvoice } = stats;
  
  return (
    <div className={`${row ? "flex gap-4" : "grid grid-cols-2 gap-3"}`} aria-label="Resumen de estadísticas">
      <div className={`${row ? "flex-1" : ""} bg-primary/10 dark:bg-primary/10 backdrop-blur-xl rounded-xl border border-primary/20 shadow-sm p-4`}>
        <p className="text-[11px] font-bold text-on-surface-variant mb-2">Presupuestos</p>
        <span className="text-[28px] font-bold text-primary leading-none tabular-nums">{totalJobs}</span>
      </div>
      <div className={`${row ? "flex-1" : ""} bg-primary/10 dark:bg-primary/10 backdrop-blur-xl rounded-xl border border-primary/20 shadow-sm p-4`}>
        <p className="text-[11px] font-bold text-on-surface-variant mb-2">Por facturar</p>
        <span className="text-[28px] font-bold text-primary leading-none tabular-nums">
          {formatCurrency(totalToInvoice)}
        </span>
      </div>
    </div>
  );
}
