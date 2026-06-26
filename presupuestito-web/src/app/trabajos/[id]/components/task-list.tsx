"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { TaskItem } from "./task-item";
import { TaskForm } from "./task-form";

interface TaskListProps {
  jobId: string;
}

export function TaskList({ jobId }: TaskListProps) {
  const { tasks, addTask } = useDataStore();
  const [isAdding, setIsAdding] = useState(false);

  const jobTasks = tasks
    .filter((t) => t.trabajo_id === jobId)
    .sort((a, b) => a.orden - b.orden);

  const handleAdd = (data: { descripcion: string; precio: number | null }) => {
    addTask({
      trabajo_id: jobId,
      descripcion: data.descripcion,
      precio: data.precio,
      completada: false,
      orden: jobTasks.length,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
          Tareas
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
          Agregar
        </button>
      </div>

      <div className="bg-surface rounded-[32px] border border-outline-variant/10 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
        {isAdding && (
          <div className="p-4">
            <TaskForm onSave={handleAdd} onCancel={() => setIsAdding(false)} />
          </div>
        )}

        {jobTasks.length > 0 ? (
          jobTasks.map((task) => (
            <div key={task.id} className="px-4 py-2">
              <TaskItem task={task} jobId={jobId} />
            </div>
          ))
        ) : (
          !isAdding && (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-on-surface-variant/40">
                Sin tareas aún
              </p>
              <p className="text-xs font-medium text-on-surface-variant/25 mt-1">
                Agregá tareas para calcular el total del trabajo.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
