import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { ListItem } from "@/components/ui/list-item";
import { Client } from "@/types";

type ClientStatus = "Activo" | "Pendiente" | "Inactivo";

const STATUS_CONFIG: Record<ClientStatus, { label: string; classes: string }> = {
  Activo: { label: "Activo", classes: "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 border border-emerald-200/50 dark:border-emerald-400/20" },
  Pendiente: { label: "Pendiente", classes: "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10 border border-amber-200/50 dark:border-amber-400/20" },
  Inactivo: { label: "Inactivo", classes: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10" },
};

interface ClientRowProps {
  client: Client;
  onClick?: () => void;
  trailing?: ReactNode;
}

export function ClientRow({ client, onClick, trailing }: ClientRowProps) {
  const status = STATUS_CONFIG[(client.status as ClientStatus) || "Pendiente"];
  return (
    <ListItem
      icon={client.name.charAt(0)}
      title={client.name}
      subtitle={client.category || "Sin categoría"}
      onClick={onClick}
      trailing={
        trailing || (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${status.classes}`}>
            {status.label}
          </span>
        )
      }
    />
  );
}
