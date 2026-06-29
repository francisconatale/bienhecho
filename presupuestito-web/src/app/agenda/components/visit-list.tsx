import { CalendarDays, Trash2 } from "lucide-react";
import { Visit } from "@/types";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { MONTHS, STATUS_OPTIONS } from "../hooks/use-agenda";

interface VisitListProps {
  selectedDate: string | null;
  selectedDay: number | null;
  month: number;
  year: number;
  dayVisits: Visit[];
  getJobInfo: (id: string) => { titulo: string; cliente: string; direccion: string };
  handleStatusToggle: (visit: Visit) => void;
  setEditingVisit: (visit: Visit) => void;
  handleDelete: (id: string) => void;
  setShowNewModal: (show: boolean) => void;
}

export function VisitList({
  selectedDate,
  selectedDay,
  month,
  year,
  dayVisits,
  getJobInfo,
  handleStatusToggle,
  setEditingVisit,
  handleDelete,
  setShowNewModal,
}: VisitListProps) {
  const pag = usePagination(dayVisits, 10);

  if (!selectedDate) {
    return (
      <div className="bg-surface rounded-[32px] border border-outline-variant/10 shadow-sm py-16 text-center">
        <CalendarDays className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" strokeWidth={1.5} />
        <h3 className="text-base font-bold text-on-surface mb-1">Seleccioná un día</h3>
        <p className="text-sm text-on-surface-variant/60">
          Hacé clic en un día del calendario para ver sus visitas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-[32px] border border-outline-variant/10 shadow-sm">
      <div className="px-6 py-4 border-b border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-on-surface tracking-tight">
          {selectedDay} de {MONTHS[month]} {year}
        </h2>
        <span className="text-[11px] font-bold text-on-surface-variant">
          {dayVisits.length} visita{dayVisits.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
        {pag.paginatedItems.length > 0 ? (
          pag.paginatedItems.map((visit) => {
            const jobInfo = getJobInfo(visit.trabajo_id);
            return (
              <div
                key={visit.id}
                className="px-6 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleStatusToggle(visit)}
                    className="mt-1 shrink-0"
                    title="Cambiar estado"
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 transition-all",
                        visit.estado === "planificada" && "border-accent-dark",
                        visit.estado === "realizada" && "border-success bg-success",
                        visit.estado === "cancelada" && "border-outline-variant bg-outline-variant/30"
                      )}
                    >
                      {visit.estado === "realizada" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white mx-auto mt-0.5" />
                      )}
                    </div>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-on-surface-variant/60 cursor-default select-none">
                        {visit.hora_inicio}
                        {visit.hora_fin ? ` - ${visit.hora_fin}` : ""}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full cursor-default select-none",
                          visit.estado === "planificada" && "bg-accent-dark/10 text-accent-dark",
                          visit.estado === "realizada" && "bg-success/10 text-success",
                          visit.estado === "cancelada" && "bg-outline-variant/20 text-on-surface-variant/60"
                        )}
                      >
                        {STATUS_OPTIONS.find((s) => s.value === visit.estado)?.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-on-surface cursor-default select-none">
                      {jobInfo.titulo}
                    </h3>
                    <p className="text-[11px] text-on-surface-variant/60 mt-0.5 cursor-default select-none">
                      {jobInfo.cliente} • {jobInfo.direccion}
                    </p>

                    {visit.notas && (
                      <p className="text-xs text-on-surface-variant mt-2 italic cursor-default select-none">
                        {visit.notas}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingVisit(visit)}
                      className="w-8 h-8 rounded-xl hover:bg-outline-variant/10 flex items-center justify-center transition-colors text-on-surface-variant hover:text-primary"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(visit.id)}
                      className="w-8 h-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors text-on-surface-variant hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center">
            <CalendarDays className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-on-surface mb-1">Sin visitas</h3>
            <p className="text-xs text-on-surface-variant/60">
              No hay visitas planificadas para este día.
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="mt-4 h-9 px-4 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              Agendar visita
            </button>
          </div>
        )}
      </div>
      <PaginationButtons
        currentPage={pag.currentPage}
        totalPages={pag.totalPages}
        totalItems={pag.totalItems}
        pageSize={pag.pageSize}
        onPageChange={pag.goToPage}
        className="pb-4 px-6"
      />
    </div>
  );
}
