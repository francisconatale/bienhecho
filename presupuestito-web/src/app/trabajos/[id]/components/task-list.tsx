"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useDataStore } from "@/lib/store";

import { TaskItem } from "./task-item";
import { TaskForm } from "./task-form";

interface TaskListProps {
  jobId: string;
  onSelectTask?: (taskId: string) => void;
}

export function TaskList({ jobId, onSelectTask }: TaskListProps) {
  const { tasks, addTask } = useDataStore();
  const [isAdding, setIsAdding] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const jobTasks = tasks
    .filter((t) => t.trabajo_id === jobId)
    .sort((a, b) => a.orden - b.orden);

  const initialCount = 5;
  const visibleTasks = showAll ? jobTasks : jobTasks.slice(0, initialCount);
  const hasMore = !showAll && jobTasks.length > initialCount;

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
    <div className="mt-8 relative z-10">
      <div className="flex flex-col bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
        
        {/* Table Header with Title & Action */}
        <div className="flex items-center justify-between gap-4 px-4 py-4 border-b border-outline-variant/10 bg-surface/50">
          <h3 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-widest">
            Tareas del Trabajo
          </h3>
          <button
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/15 transition-colors text-[13px] font-bold text-primary shrink-0"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Agregar
          </button>
        </div>

        {isAdding && (
          <div className="bg-surface/50 p-4 border-b border-outline-variant/10">
            <TaskForm onSave={handleAdd} onCancel={() => setIsAdding(false)} />
          </div>
        )}

        <div className="hidden md:flex items-center px-4 py-2 border-b border-outline-variant/20 bg-surface-variant/20">
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex-1">Descripción</div>
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-32 text-right">Precio</div>
            <div className="w-10"></div>
          </div>

          <div className="flex flex-col divide-y divide-outline-variant/10">
            {visibleTasks.length > 0 ? (
              visibleTasks.map((task, idx) => (
                <div 
                  key={task.id} 
                  className="animate-fade-in-up" 
                  style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
                >
                  <TaskItem task={task} jobId={jobId} onSelect={onSelectTask} />
                </div>
              ))
            ) : (
              !isAdding && (
                <div className="py-12 px-6 text-center">
                  <p className="text-sm font-bold text-on-surface-variant/60">
                    Aún no hay tareas definidas
                  </p>
                  <p className="text-[11px] font-medium text-on-surface-variant/40 mt-2 tracking-wide uppercase">
                    Agregá tareas para calcular el total del trabajo
                  </p>
                </div>
              )
            )}
          </div>
          {hasMore && (
            <div className="pt-3 pb-3 flex justify-center border-t border-outline-variant/10 bg-surface/30">
              <button 
                onClick={() => setShowAll(true)}
                className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-variant/30 text-xs font-semibold text-on-surface-variant hover:text-primary transition-all active:scale-95"
              >
                <span>Mostrar {jobTasks.length - initialCount} tareas más</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform">
                  <path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>
                </svg>
              </button>
            </div>
          )}
        </div>
    </div>
  );
}
