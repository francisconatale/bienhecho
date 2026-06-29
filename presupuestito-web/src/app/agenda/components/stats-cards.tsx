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
      <div className="bg-amber-500/8 dark:bg-amber-500/10 border border-amber-500/15 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70 dark:text-amber-400/70">Pendientes</span>
        </div>
        <span className="text-2xl font-bold text-on-surface tabular-nums">{pendientes}</span>
      </div>
      <div className="bg-green-500/8 dark:bg-green-500/10 border border-green-500/15 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-600/70 dark:text-green-400/70">Realizadas</span>
        </div>
        <span className="text-2xl font-bold text-on-surface tabular-nums">{realizadas}</span>
      </div>
      <div className="bg-gray-500/8 dark:bg-gray-500/10 border border-gray-500/15 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="w-4 h-4 text-gray-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500/70">Canceladas</span>
        </div>
        <span className="text-2xl font-bold text-on-surface tabular-nums">{canceladas}</span>
      </div>
    </div>
  );
}
