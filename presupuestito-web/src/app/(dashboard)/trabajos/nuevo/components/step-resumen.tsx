import { Building2, FileText, MapPin, DollarSign, Calendar } from "lucide-react";
import { useNuevoTrabajo } from "../hooks/use-nuevo-trabajo";

interface Props {
  state: ReturnType<typeof useNuevoTrabajo>["state"];
}

export function StepResumen({ state }: Props) {
  const { clients, clienteId, titulo, descripcion, direccion, presupuesto, fechaInicio, fechaFinEstimada } = state;
  return (
    <div className="space-y-3">
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-on-surface-variant/40">
              Cliente
            </p>
            <p className="font-semibold text-sm text-on-surface">
              {clients.find((c) => c.id === clienteId)?.nombre || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-on-surface/5 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-4 h-4 text-on-surface-variant/40 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-on-surface-variant/40">
              Título
            </p>
            <p className="font-semibold text-sm text-on-surface">{titulo}</p>
            {descripcion && (
              <p className="text-xs text-on-surface-variant/70 mt-1">{descripcion}</p>
            )}
          </div>
        </div>
      </div>

      {direccion && (
        <div className="bg-on-surface/5 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-on-surface-variant/40 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant/40">
                Dirección
              </p>
              <p className="font-semibold text-sm text-on-surface">{direccion}</p>
            </div>
          </div>
        </div>
      )}

      {presupuesto && (
        <div className="bg-on-surface/5 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="w-4 h-4 text-on-surface-variant/40 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant/40">
                Presupuesto
              </p>
              <p className="font-semibold text-sm text-on-surface">
                ${Number(presupuesto).toLocaleString("es-AR")}
              </p>
            </div>
          </div>
        </div>
      )}

      {(fechaInicio || fechaFinEstimada) && (
        <div className="bg-on-surface/5 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-on-surface-variant/40 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant/40">
                Fechas
              </p>
              <p className="font-semibold text-sm text-on-surface">
                {fechaInicio || "—"} {fechaFinEstimada ? `→ ${fechaFinEstimada}` : ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
