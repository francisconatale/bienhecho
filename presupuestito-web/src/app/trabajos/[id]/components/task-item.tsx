"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Task } from "@/types";
import { useDataStore } from "@/lib/store";
import { TaskForm } from "./task-form";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  jobId: string;
  onSelect?: (taskId: string) => void;
}

export function TaskItem({ task, jobId, onSelect }: TaskItemProps) {
  const { updateTask, removeTask } = useDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggleComplete = () => {
    updateTask(task.id, { completada: !task.completada });
  };

  const handleSave = (data: { descripcion: string; precio: number | null }) => {
    updateTask(task.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    removeTask(task.id);
    setConfirmDelete(false);
  };

  if (isEditing) {
    return (
      <TaskForm
        initialData={{ descripcion: task.descripcion, precio: task.precio }}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className="group relative flex flex-col md:flex-row md:items-center px-4 py-3 hover:bg-primary/5 transition-colors gap-3 md:gap-0">
        
        <div className="flex-1 min-w-0 pr-4 flex items-center gap-3">
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
            <div className="md:hidden mt-0.5">
              <span className="text-[12px] font-medium text-on-surface-variant">
                {task.precio !== null ? `$${task.precio.toLocaleString("es-AR")}` : "Sin precio"}
              </span>
            </div>
          </button>
        </div>

        {/* Amount (Desktop) */}
        <div className="hidden md:flex w-32 shrink-0 items-center justify-end pr-4">
          <span className={cn("text-[14px] font-semibold tabular-nums", task.completada ? "text-on-surface-variant/40" : "text-on-surface")}>
            {task.precio !== null ? `$${task.precio.toLocaleString("es-AR")}` : "—"}
          </span>
        </div>

        {/* Actions */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-sm active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-surface/80 ">
          <div className="bg-surface/90 dark:bg-surface/70 backdrop-blur-xl rounded-xl p-6 mx-4 max-w-sm w-full shadow-2xl space-y-4 border border-outline-variant/20">
            <h3 className="text-lg font-black text-on-surface">
              Eliminar tarea
            </h3>
            <p className="text-sm text-on-surface-variant/70 font-medium">
              ¿Estás seguro de eliminar &quot;{task.descripcion}&quot;? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 pt-2">
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
          </div>
        </div>
      )}
    </>
  );
}
