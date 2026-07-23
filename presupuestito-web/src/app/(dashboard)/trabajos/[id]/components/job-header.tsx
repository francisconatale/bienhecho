"use client";

import { useState, useRef, useEffect } from "react";
import { User, Calendar, MapPin, Pencil, Check, Trash2 } from "lucide-react";
import { Job, Client } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/services";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

interface JobHeaderProps {
  job: Job;
  client?: Client;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  onHasChanges?: (hasChanges: boolean) => void;
}

export function JobHeader({ job, client, isEditing: externalEditing, onEditingChange, onHasChanges }: JobHeaderProps) {
  const queryClient = useQueryClient();
  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => jobsService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const [internalEditing, setInternalEditing] = useState(false);
  const isEditing = externalEditing ?? internalEditing;
  const setIsEditing = (val: boolean) => {
    if (val && job.estado === "pagado") return;
    (onEditingChange ?? setInternalEditing)(val);
  };
  const [titulo, setTitulo] = useState(job.titulo);
  const [descripcion, setDescripcion] = useState(job.descripcion || "");
  const [direccion, setDireccion] = useState(job.direccion || "");
  const [fechaInicio, setFechaInicio] = useState(job.fecha_inicio || "");
  const [fechaFin, setFechaFin] = useState(job.fecha_fin_estimada || "");

  const hasChanges = 
    titulo !== job.titulo ||
    descripcion !== (job.descripcion || "") ||
    direccion !== (job.direccion || "") ||
    fechaInicio !== (job.fecha_inicio || "") ||
    fechaFin !== (job.fecha_fin_estimada || "");

  useEffect(() => {
    onHasChanges?.(hasChanges);
  }, [hasChanges, onHasChanges]);

  const handleSave = async () => {
    await updateJobMutation.mutateAsync({
      id: job.id,
      data: {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        direccion: direccion.trim() || undefined,
        fecha_inicio: fechaInicio || undefined,
        fecha_fin_estimada: fechaFin || undefined,
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitulo(job.titulo);
    setDescripcion(job.descripcion || "");
    setDireccion(job.direccion || "");
    setFechaInicio(job.fecha_inicio || "");
    setFechaFin(job.fecha_fin_estimada || "");
    setIsEditing(false);
  };

  const editRef = useRef<HTMLDivElement>(null);
  const editJustStarted = useRef(false);

  useEffect(() => {
    if (isEditing) {
      editJustStarted.current = true;
      requestAnimationFrame(() => { editJustStarted.current = false; });
    }
  }, [isEditing]);

  useClickOutside(editRef, () => {
    if (isEditing && !editJustStarted.current) {
      handleSave();
    }
  });

  return (
    <div className="group relative overflow-hidden bg-surface/80 rounded-xl p-6 md:p-8 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
      
      <div className="relative z-10 space-y-4 md:space-y-3">
        {isEditing ? (
          <div ref={editRef} className="space-y-4 md:space-y-3 relative transition-all">
          <div className="space-y-1.5 md:space-y-1">
            <input 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none transition-all py-1 w-full"
              autoFocus
              placeholder="Título del trabajo"
            />
            <div className="flex items-center gap-2 text-on-surface-variant/60 font-medium pt-1">
              <User className="w-4 h-4" />
              <span className="text-sm font-semibold text-on-surface">
                {client?.nombre || "Sin cliente"}
              </span>
            </div>
          </div>

          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full text-sm text-on-surface-variant/80 font-medium leading-relaxed bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none transition-all py-1 resize-none"
          />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant/70 font-medium">
              <MapPin className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
              <input 
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección..."
                className="bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none transition-all py-0.5 w-40"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-on-surface-variant/70 font-medium">
              <Calendar className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
              <span className="text-on-surface-variant/50 text-xs uppercase tracking-wider font-bold">Inicio:</span>
              <input 
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none transition-all py-0.5 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-on-surface-variant/70 font-medium">
              <Calendar className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
              <span className="text-on-surface-variant/50 text-xs uppercase tracking-wider font-bold">Fin:</span>
              <input 
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none transition-all py-0.5 text-sm"
              />
            </div>
          </div>

          <div className="hidden md:flex justify-end gap-2 pt-2 md:pt-3">
            <button onClick={handleCancel} data-job-header-cancel className="px-4 py-2 rounded-xl text-xs font-bold bg-on-surface/5 text-on-surface hover:bg-on-surface/10 transition-all">
              Cancelar
            </button>
            <button onClick={handleSave} data-job-header-save disabled={!titulo.trim()} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <div className="cursor-default select-none">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 md:space-y-1 flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight cursor-default select-none">
                {job.titulo}
              </h2>
              <div className="flex items-center gap-2 text-on-surface-variant/60 font-medium">
                <User className="w-4 h-4" />
                <span className="text-sm font-semibold text-on-surface cursor-default select-none">
                  {client?.nombre || "Sin cliente"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {job.estado !== "pagado" && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-xl bg-on-surface/5 text-on-surface-variant/70 hover:text-primary hover:bg-primary/10 transition-all hidden md:flex active:scale-95 shrink-0 cursor-pointer"
                  title="Editar información del trabajo"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {job.estado === "borrador" && (
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('delete-job', { detail: job.id }))}
                  className="p-2 rounded-xl bg-on-surface/5 text-on-surface-variant/70 hover:text-red-500 hover:bg-red-500/10 transition-all hidden md:flex active:scale-95 shrink-0 cursor-pointer"
                  title="Eliminar trabajo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {job.descripcion && (
            <p className="text-sm text-on-surface-variant/80 font-medium leading-relaxed pt-1 cursor-default select-none">
              {job.descripcion}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4">
            {job.direccion && (
              <div className="flex items-center gap-2 text-sm text-on-surface-variant/70 font-medium cursor-default select-none">
                <MapPin className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
                <span className="text-on-surface cursor-default select-none">{job.direccion}</span>
              </div>
            )}

            <span className={cn(
              "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest select-none",
              job.estado === "borrador" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
              job.estado === "presupuestado" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
              job.estado === "pagado" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            )}>
              {job.estado === "borrador" && "Borrador"}
              {job.estado === "presupuestado" && "Presupuestado"}
              {job.estado === "pagado" && "Pagado"}
            </span>

            {job.fecha_inicio && (
              <div className="flex items-center gap-2 text-sm text-on-surface-variant/70 font-medium cursor-default select-none">
                <Calendar className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
                <span className="text-on-surface-variant/50 text-xs uppercase tracking-wider font-bold cursor-default select-none">Inicio:</span>
                <span className="text-on-surface cursor-default select-none">
                  {new Date(job.fecha_inicio).toLocaleDateString("es-AR", { timeZone: "UTC" })}
                </span>
              </div>
            )}

            {job.fecha_fin_estimada && (
              <div className="flex items-center gap-2 text-sm text-on-surface-variant/70 font-medium cursor-default select-none">
                <Calendar className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
                <span className="text-on-surface-variant/50 text-xs uppercase tracking-wider font-bold cursor-default select-none">Fin:</span>
                <span className="text-on-surface cursor-default select-none">
                  {new Date(job.fecha_fin_estimada).toLocaleDateString("es-AR", { timeZone: "UTC" })}
                </span>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
