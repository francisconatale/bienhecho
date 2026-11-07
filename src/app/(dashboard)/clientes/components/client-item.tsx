import { useQuery } from "@tanstack/react-query";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { Client } from "@/types";
import { formatCurrency } from "@/lib/utils";

export interface ClientItemProps {
  client: Client;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ClientItem({ client, isSelected, onSelect }: ClientItemProps) {
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs"], queryFn: jobsService_getAll });
  const clientJobs = jobs.filter((j) => j.cliente_id === client.id);
  const saldo = client.saldo_cuenta_corriente ?? 0;

  return (
    <button
      onClick={() => onSelect(client.id)}
      className={`relative group w-full text-left px-4 md:px-5 py-4 transition-colors duration-200 cursor-pointer md:rounded-none md:border-0 md:border-b md:border-outline-variant/5 md:bg-transparent md:shadow-none hover:bg-black/[0.02] dark:hover:bg-white/[0.02] md:hover:bg-on-surface/5 ${
        isSelected ? "md:bg-primary/15 dark:md:bg-primary/25 md:border-b-outline-variant/5" : ""
      }`}
    >
      {isSelected && <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
      <div className="flex items-center gap-3 md:gap-4 min-h-[40px]">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[13px] md:text-sm shrink-0 transition-colors duration-300 ${
          isSelected ? "bg-primary/20 text-primary shadow-inner" : "bg-primary/8 text-primary/60"
        }`}>
          {client.nombre.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-base font-semibold truncate leading-tight transition-colors ${isSelected ? "text-primary" : "text-on-surface"}`}>{client.nombre}</div>
          <div className="text-[13px] text-on-surface-variant truncate leading-snug mt-0.5">
            {clientJobs.length} trabajo{clientJobs.length !== 1 ? "s" : ""}
          </div>
        </div>
        {saldo > 0 && (
          <div className="text-right shrink-0">
            <span className="text-[13px] font-medium text-error leading-none tabular-nums">
              Debe {formatCurrency(saldo)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
