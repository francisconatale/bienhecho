"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { Task } from "@/types";
import { useDataStore } from "@/lib/store";
import { TaskForm } from "./task-form";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  jobId: string;
}

export function TaskItem({ task, jobId }: TaskItemProps) {
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
      <div className="flex items-center gap-3 p-4 bg-on-surface/[0.02] rounded-2xl group hover:bg-on-surface/[0.04] transition-colors">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={cn(
            "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all active:scale-90",
            task.completada
              ? "bg-primary border-primary"
              : "border-outline-variant/30 hover:border-primary/50"
          )}
        >
          {task.completada && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </button>

        {/* Content - Link to detail page */}
        <Link
          href={`/trabajos/${jobId}/tareas/${task.id}?from=trabajo`}
          className="flex-1 min-w-0"
        >
          <p
            className={cn(
              "text-sm font-bold transition-all",
              task.completada
                ? "text-on-surface-variant/40 line-through"
                : "text-on-surface"
            )}
          >
            {task.descripcion}
          </p>
          <p className="text-xs font-medium text-on-surface-variant/40 mt-0.5">
            {task.precio !== null
              ? `$${task.precio.toLocaleString("es-AR")}`
              : "Sin precio"}
          </p>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-xl hover:bg-red-500/10 text-on-surface-variant/40 hover:text-red-500 transition-all active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
                className="flex-1 py-3 rounded-2xl bg-on-surface/5 text-on-surface font-black text-xs uppercase tracking-widest hover:bg-on-surface/10 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
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
