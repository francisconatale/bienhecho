import { ChevronRight } from "lucide-react";

type ClientStatus = "Activo" | "Pendiente" | "Inactivo";

export interface Client {
  id: number;
  name: string;
  category: string;
  status: ClientStatus;
}

import { ListItem } from "@/components/ui/list-item";

const STATUS_CONFIG: Record<ClientStatus, { label: string; classes: string }> = {
  Activo: { label: "Activo", classes: "text-success-dark bg-success/10" },
  Pendiente: { label: "Pendiente", classes: "text-on-error-container bg-error-container" },
  Inactivo: { label: "Inactivo", classes: "text-on-surface-variant bg-surface-container-highest" },
};

interface ClientRowProps {
  client: Client;
  onClick?: () => void;
}

export function ClientRow({ client, onClick }: ClientRowProps) {
  const status = STATUS_CONFIG[client.status];
  return (
    <ListItem
      icon={client.name.charAt(0)}
      title={client.name}
      subtitle={client.category}
      onClick={onClick}
      trailing={
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${status.classes}`}>
          {status.label}
        </span>
      }
    />
  );
}
