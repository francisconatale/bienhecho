"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { useDataStore } from "@/lib/store";

import { TaskItem } from "./task-item";
import { TaskForm } from "./task-form";
import { DataTable, type Column } from "@/components/ui/data-table";
import type { Task } from "@/types";

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

  const columns: Column<Task>[] = [
    { label: "Descripción" },
    { label: "Precio", headerClassName: "w-32 text-right" },
    { label: "", headerClassName: "w-10" },
  ];

  return (
    <div className="mt-8 relative z-10">
      <DataTable
        columns={columns}
        items={visibleTasks}
        keyExtractor={(t) => t.id}
        title="Tareas del Trabajo"
        emptyMessage={isAdding ? "" : "Aún no hay tareas definidas"}
        actions={
          <button
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/15 transition-colors text-[13px] font-bold text-primary shrink-0"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Agregar
          </button>
        }
        topContent={isAdding && (
          <div className="bg-surface/50 p-4 border-b border-outline-variant/10">
            <TaskForm onSave={handleAdd} onCancel={() => setIsAdding(false)} />
          </div>
        )}
        renderRow={(task) => (
          <TaskItem task={task} jobId={jobId} onSelect={onSelectTask} />
        )}
        footerRow={hasMore ? (
          <div className="pt-3 pb-3 flex justify-center border-t border-outline-variant/10 bg-surface/30">
            <button
              onClick={() => setShowAll(true)}
              className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-variant/30 text-xs font-semibold text-on-surface-variant hover:text-primary transition-all active:scale-95"
            >
              <span>Mostrar {jobTasks.length - initialCount} tareas más</span>
              <ChevronDown size={14} strokeWidth={2.5} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        ) : undefined}
      />
    </div>
  );
}
