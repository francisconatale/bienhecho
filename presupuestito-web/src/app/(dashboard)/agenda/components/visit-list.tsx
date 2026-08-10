import { CalendarDays, Trash2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Visit } from "@/types";
import { VisitWithJob } from "@/services/visits.service";
import { cn } from "@/lib/utils";
import { MONTHS } from "../hooks/use-agenda";

interface VisitListProps {
  selectedDate: string | null;
  selectedDay: number | null;
  month: number;
  year: number;
  dayVisits: VisitWithJob[];
  getJobInfo: (visit: VisitWithJob) => { titulo: string; cliente: string; direccion: string };
  handleStatusToggle: (visit: Visit) => void;
  setEditingVisit: (visit: Visit) => void;
  handleDelete: (id: string) => void;
  setShowNewModal: (show: boolean) => void;
}

function VisitCard({ visit, jobInfo, onToggleStatus, onEdit, onDelete }: {
  visit: Visit;
  jobInfo: { titulo: string; cliente: string; direccion: string };
  onToggleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="px-6 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
      <div className="flex items-start gap-4">
        <button onClick={onToggleStatus} className="mt-1 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-full" aria-label={`Estado actual: ${visit.estado}. Cambiar estado`}>
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 transition-colors",
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
          </div>
          <h3 className="text-sm font-bold text-on-surface cursor-default select-none">{jobInfo.titulo}</h3>
          <p className="text-[11px] text-on-surface-variant/60 mt-0.5 cursor-default select-none">
            {jobInfo.cliente} â€¢ {jobInfo.direccion}
          </p>
          {visit.notas && (
            <p className="text-xs text-on-surface-variant mt-2 italic cursor-default select-none">{visit.notas}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            aria-label={`Editar visita ${jobInfo.titulo || ""}`}
            className="w-8 h-8 rounded-xl hover:bg-outline-variant/10 flex items-center justify-center transition-colors text-on-surface-variant hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            aria-label={`Eliminar visita ${jobInfo.titulo || ""}`}
            className="w-8 h-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors text-on-surface-variant hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusGroup({ icon: Icon, iconColor, label, count, children }: {
  icon: typeof Clock;
  iconColor: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div>
      <div className="px-6 py-2 bg-surface/50 dark:bg-surface/30 flex items-center gap-2">
        <Icon className={cn("w-3 h-3", iconColor)} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">{label}</span>
        <span className="text-[10px] text-on-surface-variant/30">{count}</span>
      </div>
      {children}
    </div>
  );
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
  const pendientes = dayVisits.filter((v) => v.estado === "planificada");
  const realizadas = dayVisits.filter((v) => v.estado === "realizada");
  const canceladas = dayVisits.filter((v) => v.estado === "cancelada");

  if (!selectedDate) {
    return (
      <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl border border-outline-variant/20 shadow-sm py-16 text-center">
        <CalendarDays className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" strokeWidth={1.5} />
        <h3 className="text-base font-bold text-on-surface mb-1">SeleccionÃ¡ un dÃ­a</h3>
        <p className="text-sm text-on-surface-variant/60">
          HacÃ© clic en un dÃ­a del calendario para ver sus visitas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-on-surface tracking-tight">
          {selectedDay} de {MONTHS[month]} {year}
        </h2>
        <span className="text-[11px] font-bold text-on-surface-variant">
          {dayVisits.length} visita{dayVisits.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
        <StatusGroup icon={Clock} iconColor="text-amber-500" label="Pendientes" count={pendientes.length}>
          {pendientes.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              jobInfo={getJobInfo(visit)}
              onToggleStatus={() => handleStatusToggle(visit)}
              onEdit={() => setEditingVisit(visit)}
              onDelete={() => handleDelete(visit.id)}
            />
          ))}
        </StatusGroup>

        <StatusGroup icon={CheckCircle2} iconColor="text-green-500" label="Realizadas" count={realizadas.length}>
          {realizadas.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              jobInfo={getJobInfo(visit)}
              onToggleStatus={() => handleStatusToggle(visit)}
              onEdit={() => setEditingVisit(visit)}
              onDelete={() => handleDelete(visit.id)}
            />
          ))}
        </StatusGroup>

        <StatusGroup icon={XCircle} iconColor="text-gray-400" label="Canceladas" count={canceladas.length}>
          {canceladas.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              jobInfo={getJobInfo(visit)}
              onToggleStatus={() => handleStatusToggle(visit)}
              onEdit={() => setEditingVisit(visit)}
              onDelete={() => handleDelete(visit.id)}
            />
          ))}
        </StatusGroup>

        {dayVisits.length === 0 && (
          <div className="py-16 text-center">
            <CalendarDays className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-on-surface mb-1">Sin visitas</h3>
            <p className="text-xs text-on-surface-variant/60">
              No hay visitas para este dÃ­a.
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
    </div>
  );
}
