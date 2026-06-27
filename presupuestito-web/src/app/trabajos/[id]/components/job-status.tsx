"use client";

import { useState } from "react";
import { JobStatus, Job } from "@/types";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_ORDER: JobStatus[] = [
  "presupuestado",
  "en_curso",
  "listo_para_facturar",
  "facturado",
  "cobrado",
];

const STATUS_LABELS: Record<JobStatus, string> = {
  presupuestado: "Presupuestado",
  en_curso: "En Curso",
  listo_para_facturar: "Listo p/ Facturar",
  facturado: "Facturado",
  cobrado: "Cobrado",
};

const STATUS_COLORS: Record<JobStatus, string> = {
  presupuestado:
    "bg-on-surface/10 text-on-surface-variant",
  en_curso:
    "bg-primary/10 text-primary",
  listo_para_facturar:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  facturado:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  cobrado:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

interface JobStatusProps {
  job: Job;
  variant?: "badge" | "card";
}

export function JobStatusSelector({ job }: JobStatusProps) {
  const { updateJob } = useDataStore();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmBackward, setConfirmBackward] = useState<JobStatus | null>(null);

  const currentIndex = STATUS_ORDER.indexOf(job.estado);

  const handleStatusChange = (newStatus: JobStatus) => {
    const newIndex = STATUS_ORDER.indexOf(newStatus);

    if (newIndex < currentIndex) {
      setConfirmBackward(newStatus);
      return;
    }

    updateJob(job.id, { estado: newStatus });
    setIsOpen(false);
  };

  const confirmBackwardChange = () => {
    if (confirmBackward) {
      updateJob(job.id, { estado: confirmBackward });
      setConfirmBackward(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest transition-all active:scale-95",
          STATUS_COLORS[job.estado]
        )}
      >
        {STATUS_LABELS[job.estado]}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-surface border border-outline-variant/20 rounded-2xl shadow-2xl p-2 z-50 min-w-[200px] animate-in fade-in zoom-in-95 duration-150">
          {STATUS_ORDER.map((status, index) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                status === job.estado
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface hover:bg-on-surface/5",
                index < currentIndex && "opacity-60"
              )}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      )}

      {/* Backward confirmation modal */}
      {confirmBackward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-[28px] p-6 mx-4 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-on-surface">
              ¿Cambiar estado?
            </h3>
            <p className="text-sm text-on-surface-variant/70 font-medium">
              Vas a volver de &quot;{STATUS_LABELS[job.estado]}&quot; a &quot;
              {STATUS_LABELS[confirmBackward]}&quot;. ¿Estás seguro?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmBackward(null)}
                className="flex-1 py-3 rounded-2xl bg-on-surface/5 text-on-surface font-black text-xs uppercase tracking-widest hover:bg-on-surface/10 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBackwardChange}
                className="flex-1 py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
