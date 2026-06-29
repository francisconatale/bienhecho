"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useDataStore } from "@/lib/store";

import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { TaskItem } from "./task-item";
import { TaskForm } from "./task-form";

interface TaskListProps {
  jobId: string;
  onSelectTask?: (taskId: string) => void;
}

export function TaskList({ jobId, onSelectTask }: TaskListProps) {
  const { tasks, addTask } = useDataStore();
  const [isAdding, setIsAdding] = useState(false);

  const jobTasks = tasks
    .filter((t) => t.trabajo_id === jobId)
    .sort((a, b) => a.orden - b.orden);

  const pag = usePagination(jobTasks, 5);

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
    <div className="space-y-5 mt-8 relative z-10">
      <div className="flex items-end justify-between px-2">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-on-surface-variant/50">
          Tareas del Trabajo
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-[11px] font-bold text-on-surface uppercase tracking-wider active:scale-95"
        >
          <Plus className="w-4 h-4 text-primary transition-transform group-hover:rotate-90 duration-300" strokeWidth={2.5} />
          Agregar
        </button>
      </div>

      <div className="flex flex-col mt-4">
        {isAdding && (
          <div className="mb-4 bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-4 border border-outline-variant/20 shadow-sm">
            <TaskForm onSave={handleAdd} onCancel={() => setIsAdding(false)} />
          </div>
        )}

        <div className="flex flex-col bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
          <div className="hidden md:flex items-center px-4 py-2 border-b border-outline-variant/20 bg-surface-variant/20">
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex-1">Descripción</div>
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-32 text-right">Precio</div>
            <div className="w-10"></div>
          </div>

          <div className="flex flex-col divide-y divide-outline-variant/10">
            {pag.paginatedItems.length > 0 ? (
              pag.paginatedItems.map((task, idx) => (
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
        </div>
      </div>
      <PaginationButtons
        currentPage={pag.currentPage}
        totalPages={pag.totalPages}
        totalItems={pag.totalItems}
        pageSize={pag.pageSize}
        onPageChange={pag.goToPage}
      />
    </div>
  );
}
