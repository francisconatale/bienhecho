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
      <div className="group relative overflow-hidden bg-surface/80 rounded-[20px] p-4 flex items-center gap-4 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={cn(
            "relative z-10 w-6 h-6 rounded-[8px] border-[2.5px] flex items-center justify-center shrink-0 transition-all duration-300 active:scale-75",
            task.completada
              ? "bg-primary border-primary shadow-[0_0_12px_rgba(61,139,110,0.4)]"
              : "border-outline-variant/30 group-hover:border-primary/50 bg-surface/50"
          )}
        >
          {task.completada && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
        </button>

        {/* Content - click to view detail */}
        <button
          onClick={() => onSelect?.(task.id)}
          className="relative z-10 flex-1 min-w-0 pr-8 text-left cursor-pointer"
        >
          <p
            className={cn(
              "text-base font-bold transition-all duration-300 tracking-tight",
              task.completada
                ? "text-on-surface-variant/30 line-through decoration-2"
                : "text-on-surface group-hover:text-primary"
            )}
          >
            {task.descripcion}
          </p>
          <p className="text-[11px] font-black tracking-widest text-on-surface-variant/50 mt-1 uppercase">
            {task.precio !== null
              ? `$${task.precio.toLocaleString("es-AR")}`
              : "Sin precio estimado"}
          </p>
        </button>

        {/* Actions */}
        <div className="absolute right-4 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-[12px] bg-red-500/10 text-red-500/70 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)] active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-surface/80 ">
          <div className="bg-surface rounded-[28px] p-6 mx-4 max-w-sm w-full shadow-2xl space-y-4">
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
