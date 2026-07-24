import { Building2, Check } from "lucide-react";
import { useNuevoTrabajo } from "../hooks/use-nuevo-trabajo";

interface Props {
  clients: ReturnType<typeof useNuevoTrabajo>["state"]["clients"];
  clienteId: string;
  setClienteId: (id: string) => void;
}

export function StepCliente({ clients, clienteId, setClienteId }: Props) {
  return (
    <div className="space-y-1.5">
      {clients.map((c) => (
        <button
          key={c.id}
          onClick={() => setClienteId(c.id)}
          aria-pressed={clienteId === c.id}
          aria-label={`${c.nombre}${clienteId === c.id ? " (seleccionado)" : ""}`}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors cursor-pointer ${
            clienteId === c.id
              ? "border-primary bg-primary/5"
              : "border-outline-variant/20 bg-on-surface/5 hover:bg-on-surface/10"
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-on-surface">{c.nombre}</p>
            <p className="text-xs text-on-surface-variant/50 truncate">{c.direccion}</p>
          </div>
          {clienteId === c.id && (
            <Check className="w-4 h-4 text-primary shrink-0" strokeWidth={3} />
          )}
        </button>
      ))}
    </div>
  );
}
