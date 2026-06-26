"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Trash2,
  Filter,
} from "lucide-react";
import { useDataStore } from "@/lib/store";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { Modal } from "@/components/ui/modal";
import { CalendarMonth } from "@/components/ui/calendar";
import { SelectInput } from "@/components/ui/select-input";
import { Client, Job, Visit, VisitStatus } from "@/types";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const STATUS_OPTIONS: { value: VisitStatus; label: string }[] = [
  { value: "planificada", label: "Planificada" },
  { value: "realizada", label: "Realizada" },
  { value: "cancelada", label: "Cancelada" },
];

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function AgendaPage() {
  const {
    visits,
    jobs,
    clients,
    addVisit,
    updateVisit,
    removeVisit,
  } = useDataStore();

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [filterClient, setFilterClient] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<VisitStatus | "">("");

  const selectedDate = selectedDay ? formatDate(year, month, selectedDay) : null;

  const dayVisits = selectedDate
    ? visits
        .filter((v) => v.fecha === selectedDate)
        .filter((v) => {
          if (filterStatus && v.estado !== filterStatus) return false;
          if (filterClient) {
            const job = jobs.find((j) => j.id === v.trabajo_id);
            if (!job || job.cliente_id !== filterClient) return false;
          }
          return true;
        })
        .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
    : [];

  const pag = usePagination(dayVisits, 10);

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(null);
  };

  const goToday = () => {
    const d = new Date();
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelectedDay(d.getDate());
  };

  const visitCountForDay = (day: number) => {
    const date = formatDate(year, month, day);
    return visits.filter((v) => v.fecha === date).length;
  };

  const getJobInfo = (trabajoId: string) => {
    const job = jobs.find((j) => j.id === trabajoId);
    if (!job) return { titulo: "—", cliente: "—" };
    const client = clients.find((c) => c.id === job.cliente_id);
    return {
      titulo: job.titulo,
      cliente: client?.nombre || "—",
      direccion: job.direccion,
    };
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Eliminar esta visita?")) {
      removeVisit(id);
    }
  };

  const handleStatusToggle = (visit: Visit) => {
    const next: Record<VisitStatus, VisitStatus> = {
      planificada: "realizada",
      realizada: "cancelada",
      cancelada: "planificada",
    };
    updateVisit(visit.id, { estado: next[visit.estado] });
  };

  return (
    <main className="flex-1 pb-32 w-full pt-10 transition-all max-w-6xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">
            Agenda
          </h1>
          <p className="text-base text-on-surface-variant/60 font-medium">
            Gestioná las visitas a obra.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="h-12 px-5 rounded-2xl bg-primary text-white font-bold text-sm flex items-center gap-2 hover:bg-primary-dark active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Nueva Visita
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="w-full lg:w-[480px] shrink-0">
          <div className="bg-surface rounded-[32px] border border-outline-variant/10 shadow-sm overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.04] dark:border-white/[0.04]">
              <button
                onClick={goToday}
                className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
              >
                Hoy
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={prevMonth}
                  className="w-8 h-8 rounded-xl hover:bg-outline-variant/10 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
                </button>
                <span className="text-sm font-extrabold text-on-surface min-w-[140px] text-center">
                  {MONTHS[month]} {year}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-8 h-8 rounded-xl hover:bg-outline-variant/10 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <CalendarMonth
                year={year}
                month={month}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                dayBadge={(day, isSelected) => {
                  const count = visitCountForDay(day);
                  if (count === 0) return null;
                  return (
                    <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-primary")} />
                  );
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 bg-surface rounded-[32px] border border-outline-variant/10 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-3.5 h-3.5 text-on-surface-variant" strokeWidth={2} />
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Filtros
              </span>
              {(filterClient || filterStatus) && (
                <button
                  onClick={() => {
                    setFilterClient("");
                    setFilterStatus("");
                  }}
                  className="text-[10px] font-bold text-primary hover:text-primary-dark ml-auto"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <SelectInput
                value={filterClient}
                onValueChange={setFilterClient}
                options={clients.map((c) => ({ value: c.id, label: c.nombre }))}
                placeholder="Todos los clientes"
                size="sm"
                className="flex-1 min-w-[120px]"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as VisitStatus | "")}
                className="flex-1 min-w-[100px] bg-grouped-bg-light border border-outline-variant/20 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos los estados</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Day detail */}
        <div className="flex-1 min-w-0">
          {selectedDate ? (
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
                              <span className="text-xs font-bold text-on-surface-variant/60">
                                {visit.hora_inicio}
                                {visit.hora_fin ? ` - ${visit.hora_fin}` : ""}
                              </span>
                              <span
                                className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                  visit.estado === "planificada" && "bg-accent-dark/10 text-accent-dark",
                                  visit.estado === "realizada" && "bg-success/10 text-success",
                                  visit.estado === "cancelada" && "bg-outline-variant/20 text-on-surface-variant/60"
                                )}
                              >
                                {STATUS_OPTIONS.find((s) => s.value === visit.estado)?.label}
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-on-surface">
                              {jobInfo.titulo}
                            </h3>
                            <p className="text-[11px] text-on-surface-variant/60 mt-0.5">
                              {jobInfo.cliente} • {jobInfo.direccion}
                            </p>

                            {visit.notas && (
                              <p className="text-xs text-on-surface-variant mt-2 italic">
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
          ) : (
            <div className="bg-surface rounded-[32px] border border-outline-variant/10 shadow-sm py-16 text-center">
              <CalendarDays className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-base font-bold text-on-surface mb-1">Seleccioná un día</h3>
              <p className="text-sm text-on-surface-variant/60">
                Hacé clic en un día del calendario para ver sus visitas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Visit Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Nueva Visita"
      >
        <VisitForm
          jobs={jobs}
          clients={clients}
          defaultFecha={selectedDate || undefined}
          onSubmit={(data) => {
            addVisit(data);
            setShowNewModal(false);
          }}
          onCancel={() => setShowNewModal(false)}
        />
      </Modal>

      {/* Edit Visit Modal */}
      <Modal
        isOpen={!!editingVisit}
        onClose={() => setEditingVisit(null)}
        title="Editar Visita"
      >
        {editingVisit && (
          <VisitForm
            jobs={jobs}
            clients={clients}
            initial={editingVisit}
            onSubmit={(data) => {
              updateVisit(editingVisit.id, data);
              setEditingVisit(null);
            }}
            onCancel={() => setEditingVisit(null)}
          />
        )}
      </Modal>
    </main>
  );
}

interface VisitFormProps {
  jobs: Job[];
  clients: Client[];
  initial?: Visit;
  defaultFecha?: string;
  onSubmit: (data: Omit<Visit, "id" | "created_at">) => void;
  onCancel: () => void;
}

function VisitForm({ jobs, clients, initial, defaultFecha, onSubmit, onCancel }: VisitFormProps) {
  const [trabajoId, setTrabajoId] = useState(initial?.trabajo_id || "");
  const [fecha, setFecha] = useState(initial?.fecha || defaultFecha || new Date().toISOString().split("T")[0]);
  const [horaInicio, setHoraInicio] = useState(initial?.hora_inicio || "09:00");
  const [horaFin, setHoraFin] = useState(initial?.hora_fin || "");
  const [notas, setNotas] = useState(initial?.notas || "");
  const [estado, setEstado] = useState<VisitStatus>(initial?.estado || "planificada");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const errs: string[] = [];
    if (!trabajoId) errs.push("Seleccioná un trabajo");
    if (!fecha) errs.push("Seleccioná una fecha");
    if (!horaInicio) errs.push("Ingresá la hora de inicio");
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    onSubmit({
      trabajo_id: trabajoId,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin || undefined,
      notas: notas || undefined,
      estado,
    });
  };

  const selectedClient = jobs.find((j) => j.id === trabajoId)?.cliente_id;
  const filteredJobs = jobs.filter((j) => {
    if (!selectedClient) return true;
    return j.cliente_id === selectedClient;
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-4 pt-2"
    >
      {/* Job selector */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
          Trabajo
        </label>
        <SelectInput
          value={trabajoId}
          onValueChange={setTrabajoId}
          options={jobs.map((j) => ({
            value: j.id,
            label: `${j.titulo} — ${clients.find((c) => c.id === j.cliente_id)?.nombre || "—"}`,
          }))}
          placeholder="Seleccionar trabajo"
        />
      </div>

      {/* Date (read-only, comes from agenda calendar) */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
          Fecha
        </label>
        <div className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-xl px-3.5 py-2.5 text-sm text-on-surface">
          {new Date(fecha + "T12:00").toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Time range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
            Hora inicio
          </label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
            Hora fin <span className="font-normal opacity-50">(opcional)</span>
          </label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
          Estado
        </label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setEstado(s.value)}
              className={cn(
                "flex-1 py-2 rounded-xl text-xs font-bold border transition-all",
                estado === s.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant/20 text-on-surface-variant hover:border-primary/30"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
          Notas <span className="font-normal opacity-50">(opcional)</span>
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          placeholder="Comentarios sobre la visita..."
          className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-xl px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
          {errors.map((e, i) => (
            <p key={i} className="text-xs text-red-500 font-medium">
              {e}
            </p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl font-bold text-xs text-on-surface-variant hover:bg-outline-variant/10 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 h-11 rounded-xl font-bold text-xs text-white bg-primary hover:bg-primary-dark transition-colors"
        >
          {initial ? "Guardar Cambios" : "Crear Visita"}
        </button>
      </div>
    </form>
  );
}

export default AgendaPage;
