"use client";

import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Visit } from "@/types";

interface StatsCardsProps {
  dayVisits: Visit[];
}

export function StatsCards({ dayVisits }: StatsCardsProps) {
  const pendientes = dayVisits.filter((v) => v.estado === "planificada").length;
  const realizadas = dayVisits.filter((v) => v.estado === "realizada").length;
  const canceladas = dayVisits.filter((v) => v.estado === "cancelada").length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-accent/10 dark:bg-accent/10 border border-accent/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-accent-dark dark:text-accent" />
          <span className="text-[11px] font-bold text-accent-dark dark:text-accent">Pendientes</span>
        </div>
        <span className="text-2xl font-bold text-on-surface tabular-nums">{pendientes}</span>
      </div>
      <div className="bg-success/10 border border-success/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-[11px] font-bold text-success">Realizadas</span>
        </div>
        <span className="text-2xl font-bold text-on-surface tabular-nums">{realizadas}</span>
      </div>
      <div className="bg-on-surface/5 border border-on-surface/10 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="w-4 h-4 text-on-surface-variant" />
          <span className="text-[11px] font-bold text-on-surface-variant">Canceladas</span>
        </div>
        <span className="text-2xl font-bold text-on-surface tabular-nums">{canceladas}</span>
      </div>
    </div>
  );
}
