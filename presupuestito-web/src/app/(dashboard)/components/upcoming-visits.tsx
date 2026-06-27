"use client";

import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { useState, useEffect } from "react";
import Link from "next/link";

export function UpcomingVisits() {
  const { visits, jobs, clients } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const sortedVisits = visits
    .filter((v) => v.estado === "planificada")
    .filter((v) => {
      const d = new Date(v.fecha + "T00:00:00");
      return d >= today && d <= sevenDaysFromNow;
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora_inicio.localeCompare(b.hora_inicio));

  const pag = usePagination(sortedVisits, 5);

  if (!mounted || pag.paginatedItems.length === 0) return null;

  return (
    <section className="px-5 md:px-8 lg:px-12 transition-all">
      <div className="flex items-center justify-between mb-3 md:mb-5 px-1">
        <h3 className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-widest">
          Próximas Visitas
        </h3>
        <Link
          href="/agenda"
          className="text-[11px] font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
        >
          Ver agenda
          <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="bg-surface/80 rounded-[32px] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] border border-outline-variant/20 overflow-hidden divide-y divide-black/[0.04] dark:divide-white/[0.04]">
        {pag.paginatedItems.map((visit) => {
          const job = jobs.find((j) => j.id === visit.trabajo_id);
          const client = job ? clients.find((c) => c.id === job.cliente_id) : null;
          const dayName = new Date(visit.fecha + "T00:00:00").toLocaleDateString("es-AR", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });

          return (
            <div
              key={visit.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-11 h-11 rounded-[16px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <CalendarDays className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13px] text-on-surface truncate cursor-default select-none">
                  {job?.titulo || "—"}
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5 cursor-default select-none">
                  {dayName} • {visit.hora_inicio}
                  {visit.hora_fin ? ` - ${visit.hora_fin}` : ""}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] font-bold text-on-surface-variant cursor-default select-none">
                  {client?.nombre || "—"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PaginationButtons
        currentPage={pag.currentPage}
        totalPages={pag.totalPages}
        totalItems={pag.totalItems}
        pageSize={pag.pageSize}
        onPageChange={pag.goToPage}
        className="px-5 md:px-8 lg:px-12 mt-3"
      />
    </section>
  );
}
