import { ChevronRight } from "lucide-react";

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
    <div className="flex items-center p-4 border-b border-outline-variant/10 last:border-0 hover:bg-surface-variant/30 transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mr-3">
        <span className="font-bold">{initial}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-on-surface truncate">{client}</h4>
        <p className="text-xs text-on-surface-variant truncate">
          {project} • {date}
        </p>
      </div>
      <div className="text-right flex flex-col items-end">
        <span className="font-bold text-on-surface">{amount}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase ${statusClasses[status]}`}>
          {status}
        </span>
      </div>
      <ChevronRight className="w-5 h-5 text-outline-variant ml-2" strokeWidth={2.5} />
    </div>
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
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </section>
  );
}
