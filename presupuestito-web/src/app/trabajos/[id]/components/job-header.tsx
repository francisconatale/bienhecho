"use client";

import { useState } from "react";
import { User, Calendar, MapPin, DollarSign, Pencil, Check, X } from "lucide-react";
import { Job, Client } from "@/types";
import { useDataStore } from "@/lib/store";

interface JobHeaderProps {
  job: Job;
  client?: Client;
}

export function JobHeader({ job, client }: JobHeaderProps) {
  const { updateJob } = useDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [titulo, setTitulo] = useState(job.titulo);
  const [descripcion, setDescripcion] = useState(job.descripcion || "");
  const [direccion, setDireccion] = useState(job.direccion || "");
  const [presupuesto, setPresupuesto] = useState(job.presupuesto.toString());
  const [fechaInicio, setFechaInicio] = useState(job.fecha_inicio || "");
  const [fechaFin, setFechaFin] = useState(job.fecha_fin_estimada || "");

  const handleSave = () => {
    updateJob(job.id, {
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || undefined,
      direccion: direccion.trim() || undefined,
      presupuesto: presupuesto ? Number(presupuesto) : 0,
      fecha_inicio: fechaInicio || undefined,
      fecha_fin_estimada: fechaFin || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitulo(job.titulo);
    setDescripcion(job.descripcion || "");
    setDireccion(job.direccion || "");
    setPresupuesto(job.presupuesto.toString());
    setFechaInicio(job.fecha_inicio || "");
    setFechaFin(job.fecha_fin_estimada || "");
    setIsEditing(false);
  };

  return (
    <div className="group bg-surface md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border border-outline-variant/10 md:border-transparent shadow-sm md:shadow-none space-y-4 md:space-y-3 relative">
      {!isEditing && (
        <div className="absolute top-4 right-4 md:top-0 md:right-0 z-10">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-xl bg-on-surface/5 text-on-surface-variant/40 hover:text-primary hover:bg-primary/10 transition-all opacity-100 md:opacity-0 group-hover:opacity-100 active:scale-95"
            title="Editar información del trabajo"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4 md:space-y-3 relative z-10 bg-surface md:bg-surface-container-lowest md:-mx-4 md:p-4 rounded-2xl md:shadow-sm border border-transparent md:border-outline-variant/10 transition-all">
          <div className="space-y-1.5 md:space-y-1 pr-10">
            <input 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="text-2xl md:text-lg font-black text-on-surface tracking-tight md:tracking-normal leading-none md:leading-snug bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none transition-all py-1 w-full"
              autoFocus
              placeholder="Título del trabajo"
            />
            <div className="flex items-center gap-2 text-on-surface-variant/60 font-medium pt-1">
              <User className="w-3.5 h-3.5" />
              <span className="text-sm md:text-xs font-bold text-on-surface">
                {client?.nombre || "Sin cliente"}
              </span>
            </div>
          </div>

          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full text-sm font-medium leading-relaxed bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none transition-all py-1 resize-none"
          />

          <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-2 pt-2 md:pt-1">
            <div className="flex items-center gap-2.5 p-3 md:py-1.5 md:px-3 bg-on-surface/5 md:bg-on-surface/[0.03] rounded-2xl md:rounded-lg flex-1 md:flex-none">
              <MapPin className="w-4 h-4 md:w-3.5 md:h-3.5 text-on-surface-variant/40 shrink-0" />
              <div className="flex flex-col md:flex-row md:items-center md:gap-1.5 w-full">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-wider text-on-surface-variant/40 md:text-on-surface-variant/60">
                  Dirección
                </p>
                <p className="hidden md:block text-[10px] text-on-surface-variant/40">:</p>
                <input 
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Dirección"
                  className="text-sm md:text-xs font-bold text-on-surface bg-transparent outline-none w-full border-b border-transparent focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 md:py-1.5 md:px-3 bg-on-surface/5 md:bg-on-surface/[0.03] rounded-2xl md:rounded-lg flex-1 md:flex-none">
              <DollarSign className="w-4 h-4 md:w-3.5 md:h-3.5 text-on-surface-variant/40 shrink-0" />
              <div className="flex flex-col md:flex-row md:items-center md:gap-1.5 w-full">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-wider text-on-surface-variant/40 md:text-on-surface-variant/60">
                  Presupuesto
                </p>
                <p className="hidden md:block text-[10px] text-on-surface-variant/40">:</p>
                <input 
                  type="number"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  placeholder="0"
                  className="text-sm md:text-xs font-bold text-on-surface bg-transparent outline-none w-full border-b border-transparent focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 md:py-1.5 md:px-3 bg-on-surface/5 md:bg-on-surface/[0.03] rounded-2xl md:rounded-lg flex-1 md:flex-none">
              <Calendar className="w-4 h-4 md:w-3.5 md:h-3.5 text-on-surface-variant/40 shrink-0" />
              <div className="flex flex-col md:flex-row md:items-center md:gap-1.5 w-full">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-wider text-on-surface-variant/40 md:text-on-surface-variant/60">
                  Inicio
                </p>
                <p className="hidden md:block text-[10px] text-on-surface-variant/40">:</p>
                <input 
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="text-sm md:text-xs font-bold text-on-surface bg-transparent outline-none w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 md:py-1.5 md:px-3 bg-on-surface/5 md:bg-on-surface/[0.03] rounded-2xl md:rounded-lg flex-1 md:flex-none">
              <Calendar className="w-4 h-4 md:w-3.5 md:h-3.5 text-on-surface-variant/40 shrink-0" />
              <div className="flex flex-col md:flex-row md:items-center md:gap-1.5 w-full">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-wider text-on-surface-variant/40 md:text-on-surface-variant/60">
                  Fin
                </p>
                <p className="hidden md:block text-[10px] text-on-surface-variant/40">:</p>
                <input 
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="text-sm md:text-xs font-bold text-on-surface bg-transparent outline-none w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 md:pt-3 border-t border-outline-variant/10">
            <button onClick={handleCancel} className="px-4 py-2 rounded-xl text-xs font-bold bg-on-surface/5 text-on-surface hover:bg-on-surface/10 transition-all">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={!titulo.trim()} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-1.5 md:space-y-1 pr-10">
            <h2 className="text-2xl md:text-lg font-black text-on-surface tracking-tight md:tracking-normal leading-none md:leading-snug">
              {job.titulo}
            </h2>
            <div className="flex items-center gap-2 text-on-surface-variant/60 font-medium">
              <User className="w-3.5 h-3.5" />
              <span className="text-sm md:text-xs font-bold text-on-surface">
                {client?.nombre || "Sin cliente"}
              </span>
            </div>
          </div>

          {job.descripcion && (
            <p className="text-sm text-on-surface-variant/60 font-medium leading-relaxed">
              {job.descripcion}
            </p>
          )}

          <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-2 pt-4 md:pt-3 md:border-t-0 border-t border-outline-variant/10">
            {job.direccion && (
              <div className="flex items-center gap-2.5 p-3 md:py-1.5 md:px-3 bg-on-surface/5 md:bg-on-surface/[0.03] rounded-2xl md:rounded-lg">
                <MapPin className="w-4 h-4 md:w-3.5 md:h-3.5 text-on-surface-variant/40 shrink-0" />
                <div className="flex flex-col md:flex-row md:items-center md:gap-1.5">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-wider text-on-surface-variant/40 md:text-on-surface-variant/60">
                    Dirección
                  </p>
                  <p className="hidden md:block text-[10px] text-on-surface-variant/40">:</p>
                  <p className="text-sm md:text-xs font-bold text-on-surface">{job.direccion}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 p-3 md:py-1.5 md:px-3 bg-on-surface/5 md:bg-on-surface/[0.03] rounded-2xl md:rounded-lg">
              <DollarSign className="w-4 h-4 md:w-3.5 md:h-3.5 text-on-surface-variant/40 shrink-0" />
              <div className="flex flex-col md:flex-row md:items-center md:gap-1.5">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-wider text-on-surface-variant/40 md:text-on-surface-variant/60">
                  Presupuesto
                </p>
                <p className="hidden md:block text-[10px] text-on-surface-variant/40">:</p>
                <p className="text-sm md:text-xs font-bold text-on-surface">
                  ${job.presupuesto.toLocaleString("es-AR")}
                </p>
              </div>
            </div>

            {job.fecha_inicio && (
              <div className="flex items-center gap-2.5 p-3 md:py-1.5 md:px-3 bg-on-surface/5 md:bg-on-surface/[0.03] rounded-2xl md:rounded-lg">
                <Calendar className="w-4 h-4 md:w-3.5 md:h-3.5 text-on-surface-variant/40 shrink-0" />
                <div className="flex flex-col md:flex-row md:items-center md:gap-1.5">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-wider text-on-surface-variant/40 md:text-on-surface-variant/60">
                    Inicio
                  </p>
                  <p className="hidden md:block text-[10px] text-on-surface-variant/40">:</p>
                  <p className="text-sm md:text-xs font-bold text-on-surface">
                    {new Date(job.fecha_inicio).toLocaleDateString("es-AR", { timeZone: "UTC" })}
                  </p>
                </div>
              </div>
            )}

            {job.fecha_fin_estimada && (
              <div className="flex items-center gap-2.5 p-3 md:py-1.5 md:px-3 bg-on-surface/5 md:bg-on-surface/[0.03] rounded-2xl md:rounded-lg">
                <Calendar className="w-4 h-4 md:w-3.5 md:h-3.5 text-on-surface-variant/40 shrink-0" />
                <div className="flex flex-col md:flex-row md:items-center md:gap-1.5">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-wider text-on-surface-variant/40 md:text-on-surface-variant/60">
                    Fin
                  </p>
                  <p className="hidden md:block text-[10px] text-on-surface-variant/40">:</p>
                  <p className="text-sm md:text-xs font-bold text-on-surface">
                    {new Date(job.fecha_fin_estimada).toLocaleDateString("es-AR", { timeZone: "UTC" })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
