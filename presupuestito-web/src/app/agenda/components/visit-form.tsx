import { useState } from "react";
import { SelectInput } from "@/components/ui/select-input";
import { Client, Job, Visit, VisitStatus } from "@/types";
import { cn } from "@/lib/utils";
import { STATUS_OPTIONS } from "../hooks/use-agenda";

export interface VisitFormProps {
  jobs: Job[];
  clients: Client[];
  initial?: Visit;
  defaultFecha?: string;
  onSubmit: (data: Omit<Visit, "id" | "created_at">) => void;
  onCancel: () => void;
}

export function VisitForm({ jobs, clients, initial, defaultFecha, onSubmit, onCancel }: VisitFormProps) {
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
