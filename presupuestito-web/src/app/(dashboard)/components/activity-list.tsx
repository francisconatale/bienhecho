"use client";

import { DataTable, type Column } from "@/components/ui/data-table";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Job } from "@/types";

interface ActivityListProps {
  pagination: any;
}

export function ActivityList({ pagination }: ActivityListProps) {
  const router = useRouter();

  const activityColumns: Column<any>[] = [
    {
      label: "Trabajo",
      render: (job) => {
        const clientName = job.clientes?.nombre || "Sin cliente";
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">
              {job.titulo}
            </span>
            <span className="md:hidden flex items-center gap-2 text-[11px] text-on-surface-variant">
              <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[9px] shrink-0">
                {clientName.charAt(0)}
              </span>
              <span className="truncate">{clientName}</span>
            </span>
          </div>
        );
      },
    },
    {
      label: "Cliente",
      className: "hidden md:table-cell md:w-40",
      render: (job) => {
        const clientName = job.clientes?.nombre || "Sin cliente";
        return (
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
              {clientName.charAt(0)}
            </span>
            <span className="text-[13px] text-on-surface-variant truncate">{clientName}</span>
          </div>
        );
      },
    },
    {
      label: "Importe",
      className: "md:w-32 text-right",
      headerClassName: "text-right",
      render: (job) => (
        <div className="flex flex-col items-end gap-0.5">
          <span className="md:hidden text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Importe</span>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-on-surface tabular-nums">
              ${(job.presupuesto || 0).toLocaleString()}
            </span>
            <ChevronRight size={16} className="text-on-surface-variant/50 group-hover:text-primary transition-colors" aria-hidden="true" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={activityColumns}
      items={pagination.paginatedItems}
      keyExtractor={(job) => job.id}
      onRowClick={(job) => router.push(`/trabajos/${job.id}`)}
      pagination={pagination}
      title="Actividad Reciente"
      emptyMessage="No hay actividad reciente."
    />
  );
}
