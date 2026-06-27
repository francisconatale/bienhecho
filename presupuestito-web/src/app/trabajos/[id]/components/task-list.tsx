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
}

export function TaskList({ jobId }: TaskListProps) {
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
          className="group flex items-center gap-1.5 px-4 py-2 rounded-[14px] border border-outline-variant/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-[11px] font-bold text-on-surface uppercase tracking-wider active:scale-95"
        >
          <Plus className="w-4 h-4 text-primary transition-transform group-hover:rotate-90 duration-300" strokeWidth={2.5} />
          Agregar
        </button>
      </div>

      <div className="space-y-3">
        {isAdding && (
          <div className="p-4">
            <TaskForm onSave={handleAdd} onCancel={() => setIsAdding(false)} />
          </div>
        )}

        {pag.paginatedItems.length > 0 ? (
          pag.paginatedItems.map((task, idx) => (
            <div 
              key={task.id} 
              className="animate-fade-in-up" 
              style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
            >
              <TaskItem task={task} jobId={jobId} />
            </div>
          ))
        ) : (
          !isAdding && (
            <div className="py-20 px-6 text-center bg-surface border border-dashed border-outline-variant/20 rounded-[24px] bg-surface/80 ">
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
