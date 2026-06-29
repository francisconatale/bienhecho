"use client";

import { useState } from "react";
import { Check, Trash2, Pencil } from "lucide-react";
import { Task } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/services";
import { TaskForm } from "./task-form";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

const PRIORITY_BADGE: Record<string, string> = {
  alta: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  media: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  baja: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
};

interface TaskItemProps {
  task: Task;
  jobId: string;
  isJobPaid?: boolean;
  onSelect?: (taskId: string) => void;
}

export function TaskItem({ task, jobId, isJobPaid, onSelect }: TaskItemProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => tasksService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const removeTaskMutation = useMutation({
    mutationFn: tasksService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleToggleComplete = async () => {
    await updateTaskMutation.mutateAsync({ id: task.id, data: { completada: !task.completada } });
  };

  const handleSave = async (data: { descripcion: string; precio: number | null; prioridad?: "alta" | "media" | "baja"; fecha_vencimiento?: string }) => {
    await updateTaskMutation.mutateAsync({ id: task.id, data });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await removeTaskMutation.mutateAsync(task.id);
    setConfirmDelete(false);
  };

  return (
    <>
      <div className="group relative flex flex-col md:flex-row md:items-center px-4 py-3 hover:bg-primary/5 transition-colors gap-3 md:gap-0">
        
        <div className="flex-1 min-w-0 pr-14 md:pr-4 flex items-center gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            className={cn(
              "relative z-10 w-5 h-5 rounded-[6px] border-[2px] flex items-center justify-center shrink-0 transition-all duration-300 active:scale-75",
              task.completada
                ? "bg-primary border-primary shadow-[0_0_8px_rgba(61,139,110,0.4)]"
                : "border-outline-variant/40 group-hover:border-primary/50 bg-transparent"
            )}
          >
            {task.completada && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
          </button>

          {/* Content */}
          <button
            onClick={() => onSelect?.(task.id)}
            className="flex-1 text-left cursor-pointer min-w-0"
          >
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  "text-[14px] font-bold transition-all duration-300 truncate",
                  task.completada
                    ? "text-on-surface-variant/40 line-through"
                    : "text-on-surface group-hover:text-primary"
                )}
              >
                {task.descripcion}
              </p>
              {task.prioridad && (
                <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0", PRIORITY_BADGE[task.prioridad])}>
                  {task.prioridad}
                </span>
              )}
            </div>
            <div className="md:hidden mt-0.5">
              <span className="text-[12px] font-medium text-on-surface-variant">
                {task.precio !== null ? `$${task.precio.toLocaleString("es-AR")}` : "Sin precio"}
              </span>
            </div>
          </button>
        </div>

        {/* Amount (Desktop) */}
        <div className="hidden md:flex w-32 shrink-0 items-center justify-end pr-4 group-hover:opacity-0 transition-opacity">
          <span className={cn("text-[14px] font-semibold tabular-nums", task.completada ? "text-on-surface-variant/40" : "text-on-surface")}>
            {task.precio !== null ? `$${task.precio.toLocaleString("es-AR")}` : "—"}
          </span>
        </div>

        {/* Actions */}
        {!isJobPaid && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-sm active:scale-90"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-sm active:scale-90"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Editar tarea">
        <TaskForm
          initialData={{ descripcion: task.descripcion, precio: task.precio, prioridad: task.prioridad, fecha_vencimiento: task.fecha_vencimiento }}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Eliminar tarea">
        <p className="text-sm text-on-surface-variant/70 font-medium">
          ¿Estás seguro de eliminar &quot;{task.descripcion}&quot;? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setConfirmDelete(false)}
            className="flex-1 py-3 rounded-xl bg-on-surface/5 text-on-surface font-black text-xs uppercase tracking-widest hover:bg-on-surface/10 transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </>
  );
}
