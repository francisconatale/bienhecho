import { Filter } from "lucide-react";
import { SelectInput } from "@/components/ui/select-input";
import { Client, VisitStatus } from "@/types";
import { STATUS_OPTIONS } from "../hooks/use-agenda";

interface AgendaFiltersProps {
  clients: Client[];
  filterClient: string;
  setFilterClient: (client: string) => void;
  filterStatus: VisitStatus | "";
  setFilterStatus: (status: VisitStatus | "") => void;
}

export function AgendaFilters({
  clients,
  filterClient,
  setFilterClient,
  filterStatus,
  setFilterStatus,
}: AgendaFiltersProps) {
  return (
    <div className="mt-4 bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl border border-outline-variant/20 shadow-sm p-5">
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
        <SelectInput
          value={filterStatus}
          onValueChange={(val) => setFilterStatus(val as VisitStatus | "")}
          options={[{ value: "", label: "Todos los estados" }, ...STATUS_OPTIONS]}
          placeholder="Todos los estados"
          size="sm"
          className="flex-1 min-w-[100px]"
        />
      </div>
    </div>
  );
}
