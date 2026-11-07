"use client";

import { useState, useEffect, useCallback } from "react";
import { JobStatus, Job } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService_update } from "@/actions/jobs.actions";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

const STATUS_ORDER: JobStatus[] = [
  "borrador",
  "presupuestado",
  "pagado",
];

const STATUS_LABELS: Record<JobStatus, string> = {
  borrador: "Borrador",
  presupuestado: "Presupuestado",
  pagado: "Pagado",
};

const STATUS_COLORS: Record<JobStatus, string> = {
  borrador:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  presupuestado:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  pagado:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

interface JobStatusProps {
  job: Job;
  variant?: "badge" | "card";
}

export function JobStatusSelector({ job }: JobStatusProps) {
  const queryClient = useQueryClient();
  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => jobsService_update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const currentIndex = STATUS_ORDER.indexOf(job.estado);

  const handleStatusChange = async (newStatus: JobStatus) => {
    const newIndex = STATUS_ORDER.indexOf(newStatus);

    if (newIndex < currentIndex) {
      confirm({
        title: "¿Cambiar estado?",
        description: `Vas a volver de "${STATUS_LABELS[job.estado]}" a "${STATUS_LABELS[newStatus]}". ¿Estás seguro?`,
        confirmText: "Confirmar",
        action: async () => {
          await updateJobMutation.mutateAsync({ id: job.id, data: { estado: newStatus } });
          setIsOpen(false);
        }
      });
      return;
    }

    await updateJobMutation.mutateAsync({ id: job.id, data: { estado: newStatus } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "text-[11px] font-bold px-4 py-2 rounded-full transition-transform active:scale-95",
          STATUS_COLORS[job.estado]
        )}
      >
        {STATUS_LABELS[job.estado]}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-surface border border-outline-variant/20 rounded-2xl shadow-2xl p-2 z-50 min-w-[200px] animate-in fade-in zoom-in-95 duration-150" role="menu">
          {STATUS_ORDER.map((status, index) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              role="menuitem"
              aria-label={STATUS_LABELS[status]}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors",
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

      <ConfirmDialog />
    </div>
  );
}
