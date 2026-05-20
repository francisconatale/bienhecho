"use client";

import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";

interface ActivityItemProps {
  initial: string;
  client: string;
  project: string;
  date: string;
  amount: string;
  status: "Enviado" | "Borrador" | "Aceptado";
}

function ActivityItem({ initial, client, project, date, amount, status }: ActivityItemProps) {
  const statusClasses = {
    Enviado: "text-primary bg-primary-container/20",
    Borrador: "text-on-surface-variant bg-surface-container-highest",
    Aceptado: "text-success-dark bg-success/10",
  };

  return (
    <ListItem
      icon={initial}
      title={client}
      subtitle={`${project} • ${date}`}
      onClick={() => {}} // TODO: Handle click
      trailing={
        <div className="text-right flex flex-col items-end mr-1">
          <span className="font-bold text-on-surface">{amount}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase ${statusClasses[status]}`}>
            {status}
          </span>
        </div>
      }
    />
  );
}

export function RecentActivity() {
  const activities: ActivityItemProps[] = [
    {
      initial: "A",
      client: "Acme Corp",
      project: "Diseño Web",
      date: "12 Oct",
      amount: "$1,200",
      status: "Enviado",
    },
    {
      initial: "S",
      client: "Stark Industries",
      project: "Consultoría SEO",
      date: "10 Oct",
      amount: "$850",
      status: "Borrador",
    },
    {
      initial: "W",
      client: "Wayne Ent.",
      project: "Campaña Ads",
      date: "05 Oct",
      amount: "$2,450",
      status: "Aceptado",
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between px-2 mb-3">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          Actividad Reciente
        </h3>
      </div>
      <ListGroup>
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </ListGroup>
    </section>
  );
}
