"use client";

import { User, Calendar, MapPin, DollarSign } from "lucide-react";
import { Job, Client } from "@/types";

interface JobHeaderProps {
  job: Job;
  client?: Client;
}

export function JobHeader({ job, client }: JobHeaderProps) {
  return (
    <div className="bg-surface rounded-[32px] p-6 md:p-8 border border-outline-variant/10 shadow-sm space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-on-surface tracking-tight leading-none">
          {job.titulo}
        </h2>
        <div className="flex items-center gap-2 text-on-surface-variant/60 font-medium">
          <User className="w-4 h-4" />
          <span className="text-sm font-bold text-on-surface">
            {client?.nombre || "Sin cliente"}
          </span>
        </div>
      </div>

      {job.descripcion && (
        <p className="text-sm text-on-surface-variant/60 font-medium leading-relaxed">
          {job.descripcion}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-outline-variant/10">
        {job.direccion && (
          <div className="flex items-center gap-3 p-3 bg-on-surface/5 rounded-2xl">
            <MapPin className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">
                Dirección
              </p>
              <p className="text-sm font-bold text-on-surface">{job.direccion}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-on-surface/5 rounded-2xl">
          <DollarSign className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">
              Presupuesto
            </p>
            <p className="text-sm font-bold text-on-surface">
              ${job.presupuesto.toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        {job.fecha_inicio && (
          <div className="flex items-center gap-3 p-3 bg-on-surface/5 rounded-2xl">
            <Calendar className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">
                Inicio
              </p>
              <p className="text-sm font-bold text-on-surface">
                {new Date(job.fecha_inicio).toLocaleDateString("es-AR")}
              </p>
            </div>
          </div>
        )}

        {job.fecha_fin_estimada && (
          <div className="flex items-center gap-3 p-3 bg-on-surface/5 rounded-2xl">
            <Calendar className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">
                Fin estimado
              </p>
              <p className="text-sm font-bold text-on-surface">
                {new Date(job.fecha_fin_estimada).toLocaleDateString("es-AR")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
