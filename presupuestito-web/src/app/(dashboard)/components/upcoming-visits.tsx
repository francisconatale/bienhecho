"use client";

import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { visitsService, jobsService, clientsService } from "@/services";
import { useMemo } from "react";
import Link from "next/link";

export function UpcomingVisits() {
  const { data: visits = [], isLoading: isLoadingVisits } = useQuery({ queryKey: ["visits"], queryFn: visitsService.getAll });
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService.getAll });
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({ queryKey: ["clients"], queryFn: clientsService.getAll });

  const isLoading = isLoadingVisits || isLoadingJobs || isLoadingClients;

  const sortedVisits = useMemo(() => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return visits
      .filter((v) => v.estado === "planificada")
      .filter((v) => {
        const d = new Date(v.fecha + "T00:00:00");
        return d >= today && d <= sevenDaysFromNow;
      })
      .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora_inicio.localeCompare(b.hora_inicio));
  }, [visits]);

  const pag = usePagination(sortedVisits, 5);

  if (isLoading) {
    return (
      <section className="transition-all w-full flex flex-col h-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="w-32 h-3 bg-outline-variant/10 rounded animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col bg-surface/60 backdrop-blur-2xl rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 md:p-5 border-b border-outline-variant/5 last:border-0">
              <div className="w-10 h-10 rounded-xl bg-outline-variant/10 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-2/3 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
                <div className="w-1/3 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
              </div>
              <div className="w-16 h-3 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (pag.paginatedItems.length === 0) {
    return (
      <section className="transition-all w-full flex flex-col h-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-widest">
            Próximas Visitas
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[140px] bg-surface/40 backdrop-blur-xl rounded-xl border border-outline-variant/10 text-center p-6">
          <CalendarDays className="w-8 h-8 text-on-surface-variant/20 mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-on-surface-variant/60">No hay visitas planificadas para los próximos 7 días.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="transition-all w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-widest">
          Próximas Visitas
        </h2>
        <Link
          href="/agenda"
          className="text-[10px] md:text-[11px] font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
        >
          Ver agenda
          <ArrowRight className="w-3 h-3" strokeWidth={2.5} aria-hidden="true" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col bg-surface/60 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] border border-outline-variant/20 overflow-hidden">
        <div className="flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.04]">
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
                className="flex items-center gap-3 p-4 md:p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                  <CalendarDays className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
                </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs md:text-[13px] text-on-surface truncate cursor-default select-none">
                  {job?.titulo || "—"}
                </div>
                <div className="text-[10px] md:text-[11px] text-on-surface-variant mt-0.5 cursor-default select-none">
                  {dayName} • {visit.hora_inicio}
                  {visit.hora_fin ? ` - ${visit.hora_fin}` : ""}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] md:text-[11px] font-bold text-on-surface-variant cursor-default select-none">
                  {client?.nombre || "—"}
                </div>
              </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto p-4 md:p-5 border-t border-black/[0.04] dark:border-white/[0.04] bg-surface/20">
          <PaginationButtons
            currentPage={pag.currentPage}
            totalPages={pag.totalPages}
            totalItems={pag.totalItems}
            pageSize={pag.pageSize}
            onPageChange={pag.goToPage}
          />
        </div>
      </div>
    </section>
  );
}
