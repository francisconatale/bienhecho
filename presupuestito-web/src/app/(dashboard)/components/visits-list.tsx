"use client";

import Link from "next/link";
import { ChevronRight, CalendarDays } from "lucide-react";

interface VisitsListProps {
  visits: any[];
}

export function VisitsList({ visits }: VisitsListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-[13px] font-bold text-on-surface-variant">Próximas Visitas</h2>
        {visits.length > 0 && (
          <Link href="/agenda" className="text-[11px] font-bold text-primary hover:opacity-70 transition-opacity flex items-center gap-0.5">
            Ver agenda <ChevronRight size={12} aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="flex flex-col bg-surface rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm">
        <div className="hidden md:flex items-center px-4 py-2 border-b border-outline-variant/20 bg-surface-variant/20">
          <div className="text-xs font-bold text-on-surface-variant flex-1">Fecha / Trabajo</div>
          <div className="text-xs font-bold text-on-surface-variant w-32 text-right">Cliente</div>
        </div>
        
        <div className="flex flex-col divide-y divide-outline-variant/10">
          {visits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-5 px-4 text-center">
              <CalendarDays className="w-6 h-6 text-on-surface-variant/20 mb-1.5" aria-hidden="true" />
              <p className="text-[12px] text-on-surface-variant/60 font-medium">Sin visitas en los próximos 7 días</p>
            </div>
          ) : (
            visits.map((visit) => {
              const dayName = new Date(visit.fecha + "T00:00:00").toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
              const jobTitle = visit.trabajos?.titulo || "—";
              const clientName = visit.trabajos?.clientes?.nombre || null;
              
              return (
                <div key={visit.id} className="flex flex-col md:flex-row md:items-center px-4 py-2.5 hover:bg-primary/5 transition-colors gap-2 md:gap-0">
                  {/* Info Column */}
                  <div className="flex-1 min-w-0 pr-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <CalendarDays size={13} aria-hidden="true" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-on-surface truncate">{jobTitle}</span>
                      <span className="text-[11px] text-on-surface-variant capitalize">{dayName} · {visit.hora_inicio}</span>
                    </div>
                  </div>

                  {/* Client Column */}
                  {clientName && (
                    <div className="w-full md:w-32 shrink-0 md:text-right pt-2 md:pt-0 border-t border-outline-variant/10 md:border-0">
                      <p className="text-[11px] font-medium text-on-surface-variant truncate">{clientName}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
