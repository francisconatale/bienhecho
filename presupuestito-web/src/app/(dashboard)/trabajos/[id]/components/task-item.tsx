"use client";

import { useState } from "react";
import { Check, Trash2, Pencil, Loader2 } from "lucide-react";
import { Task } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService_update, tasksService_delete } from "@/actions/tasks.actions";
import { TaskForm } from "./task-form";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

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
  const [ConfirmDialog, confirm] = useConfirm();

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => tasksService_update(id, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["tasks", jobId], (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map(t => t.id === updatedTask.id ? updatedTask : t);
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const removeTaskMutation = useMutation({
    mutationFn: tasksService_delete,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["tasks", jobId], (old: Task[] | undefined) => {
        if (!old) return old;
        return old.filter(t => t.id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleToggleComplete = async () => {
    await updateTaskMutation.mutateAsync({ id: task.id, data: { completada: !task.completada } });
  };

  const handleSave = async (data: { descripcion: string; cantidad?: number; precio_unitario?: number; precio: number | null; prioridad?: "alta" | "media" | "baja"; fecha_vencimiento?: string }) => {
    await updateTaskMutation.mutateAsync({ id: task.id, data });
    setIsEditing(false);
  };

  const handleDelete = () => {
    confirm({
      title: "Eliminar tarea",
      description: `¿Estás seguro de eliminar "${task.descripcion}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        await removeTaskMutation.mutateAsync(task.id);
      }
    });
  };

  return (
    <>
      <div className="group relative flex flex-col md:flex-row md:items-center px-3 py-2.5 md:px-4 md:py-3 hover:bg-primary/5 transition-colors gap-2 md:gap-0">
        
        <div className="flex-1 min-w-0 pr-14 md:pr-4 flex items-center gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={updateTaskMutation.isPending}
            role="checkbox"
            aria-checked={task.completada}
            aria-label={`Marcar tarea "${task.descripcion}" como ${task.completada ? "pendiente" : "completada"}`}
            className={cn(
              "relative z-10 w-5 h-5 rounded-[6px] border-[2px] flex items-center justify-center shrink-0 transition-colors transition-transform duration-300 active:scale-75",
              task.completada
                ? "bg-primary border-primary shadow-[0_0_8px_rgba(61,139,110,0.4)]"
                : "border-outline-variant/40 group-hover:border-primary/50 bg-transparent",
              updateTaskMutation.isPending && "opacity-50 cursor-not-allowed"
            )}
          >
            {updateTaskMutation.isPending ? (
              <Loader2 className={cn("w-3 h-3 animate-spin", task.completada ? "text-white" : "text-primary")} strokeWidth={4} />
            ) : task.completada ? (
              <Check className="w-3 h-3 text-white" strokeWidth={4} />
            ) : null}
          </button>

          {/* Content */}
          <button
            onClick={() => onSelect?.(task.id)}
            className="flex-1 text-left cursor-pointer min-w-0"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-1.5 md:gap-2">
              <p
                className={cn(
                  "text-[14px] font-bold transition-colors duration-300 break-words",
                  task.completada
                    ? "text-on-surface-variant/40 line-through"
                    : "text-on-surface group-hover:text-primary"
                )}
              >
                {task.descripcion}
              </p>
              {task.prioridad && (
                <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 w-max md:mt-0.5", PRIORITY_BADGE[task.prioridad])}>
                  {task.prioridad}
                </span>
              )}
            </div>
            <div className="md:hidden mt-1.5 flex flex-col gap-0.5">
              {task.cantidad && task.precio_unitario && (
                <span className="text-[11px] font-medium text-on-surface-variant/70">
                  {task.cantidad} x ${task.precio_unitario.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
              )}
              <span className="text-[13px] font-bold text-on-surface">
                {task.precio !== null ? `$${task.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}` : "Sin precio"}
              </span>
            </div>
          </button>
        </div>

        {/* Amount (Desktop) */}
        <div className="hidden md:flex w-40 shrink-0 flex-col items-end justify-center pr-4 group-hover:opacity-0 transition-opacity">
          {task.cantidad && task.precio_unitario && (
            <span className="text-[11px] font-medium text-on-surface-variant/70">
              {task.cantidad} x ${task.precio_unitario.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
          )}
          <span className={cn("text-[14px] font-semibold tabular-nums", task.completada ? "text-on-surface-variant/40" : "text-on-surface")}>
            {task.precio !== null ? `$${task.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}` : "—"}
          </span>
        </div>

        {/* Actions */}
        {!isJobPaid && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity transition-transform duration-300 translate-x-0 md:translate-x-2 md:group-hover:translate-x-0">
            <button
              onClick={() => setIsEditing(true)}
              aria-label={`Editar tarea: ${task.descripcion}`}
              className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors transition-transform duration-300 hover:shadow-sm active:scale-90"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              aria-label={`Eliminar tarea: ${task.descripcion}`}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors transition-transform duration-300 hover:shadow-sm active:scale-90"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Editar tarea">
        <TaskForm
          initialData={{ descripcion: task.descripcion, cantidad: task.cantidad, precio_unitario: task.precio_unitario, precio: task.precio, prioridad: task.prioridad, fecha_vencimiento: task.fecha_vencimiento }}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isSaving={updateTaskMutation.isPending}
        />
      </Modal>

      <ConfirmDialog />
    </>
  );
}
