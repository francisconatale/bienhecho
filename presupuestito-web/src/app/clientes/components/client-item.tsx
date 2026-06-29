import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCuentaCorriente } from "@/hooks/use-cuenta-corriente";

export interface ClientItemProps {
  client: Client;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ClientItem({ client, isSelected, onSelect }: ClientItemProps) {
  const clientJobs = useDataStore.getState().jobs.filter((j) => j.cliente_id === client.id);
  const { saldo } = useCuentaCorriente(client.id);

  return (
    <button
      onClick={() => onSelect(client.id)}
      className={`relative group w-full text-left px-4 md:px-5 py-4 transition-colors duration-300 transition-transform duration-300 cursor-pointer rounded-[24px] md:rounded-none border border-white/20 dark:border-white/5 md:border-0 md:border-b md:border-outline-variant/5 bg-surface dark:bg-surface/20 md:bg-transparent bg-surface/80  shadow-[0_4px_12px_rgba(0,0,0,0.02)] md:shadow-none hover:-translate-y-0.5 md:hover:translate-y-0 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:hover:shadow-none ${
        isSelected ? "md:bg-primary/15 dark:md:bg-primary/25 border-primary/30 md:border-b-outline-variant/5" : "md:hover:bg-on-surface/5"
      }`}
    >
      {isSelected && <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
      <div className="flex items-center gap-3 md:gap-4">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-[11px] md:text-sm shrink-0 transition-colors duration-300 ${
          isSelected ? "bg-primary/20 text-primary shadow-inner" : "bg-primary/8 text-primary/60"
        }`}>
          {client.nombre.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-medium text-sm md:text-base truncate transition-colors ${isSelected ? "text-primary" : "text-on-surface"}`}>{client.nombre}</div>
          <div className="text-[11px] md:text-sm text-on-surface-variant truncate">{client.email}</div>
        </div>
        <div className="text-right shrink-0">
          {clientJobs.filter(j => j.estado === "presupuestado").length > 0 && (
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 leading-none">PRESUPUESTADO</span>
              <span className="text-[10px] md:text-sm font-bold text-on-surface leading-none">
                {formatCurrency(clientJobs.filter(j => j.estado === "presupuestado").reduce((a, j) => a + j.presupuesto, 0))}
              </span>
              {saldo > 0 && (
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 mt-1.5 leading-none">ADEUDA</span>
              )}
              {saldo > 0 && (
                <span className="text-[10px] md:text-sm font-bold text-amber-600 dark:text-amber-400 leading-none">{formatCurrency(saldo)}</span>
              )}
            </div>
          )}
          <div className="text-[9px] md:text-xs text-on-surface-variant tabular-nums mt-1">
            {clientJobs.length} trabajo{clientJobs.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </button>
  );
}
