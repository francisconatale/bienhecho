"use client";

import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";

type ActivityStatus = "Enviado" | "Borrador" | "Aceptado";

interface ActivityItemProps {
  initial: string;
  client: string;
  project: string;
  date: string;
  amount: string;
  status: ActivityStatus;
}

const STATUS_CONFIG: Record<ActivityStatus, { label: string; color: string; bg: string }> = {
  Enviado: { label: "Enviado", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  Borrador: { label: "Borrador", color: "#8E8E93", bg: "rgba(142,142,147,0.15)" },
  Aceptado: { label: "Aceptado", color: "#34D399", bg: "rgba(52,211,153,0.15)" },
};

function ActivityTrailing({ amount, status }: { amount: string; status: ActivityStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="flex flex-col items-end gap-1 mr-1">
      <span className="font-semibold text-on-surface text-sm">{amount}</span>
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide"
        style={{ color: cfg.color, background: cfg.bg }}
      >
        {cfg.label}
      </span>
    </div>
  );
}

const ACTIVITIES: ActivityItemProps[] = [
  { initial: "A", client: "Acme Corp",         project: "Diseño Web",       date: "12 Oct", amount: "$1,200", status: "Enviado"  },
  { initial: "S", client: "Stark Industries",   project: "Consultoría SEO",  date: "10 Oct", amount: "$850",   status: "Borrador" },
  { initial: "W", client: "Wayne Ent.",          project: "Campaña Ads",      date: "05 Oct", amount: "$2,450", status: "Aceptado" },
];

export function RecentActivity() {
  return (
    <section className="px-4">
      <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
        Actividad Reciente
      </h3>

      <ListGroup>
        {ACTIVITIES.map((a, i) => (
          <ListItem
            key={i}
            icon={a.initial}
            title={a.client}
            subtitle={`${a.project} • ${a.date}`}
            onClick={() => {}}
            trailing={<ActivityTrailing amount={a.amount} status={a.status} />}
          />
        ))}
      </ListGroup>
    </section>
  );
}
