"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/services";
import { TaskItem } from "./task-item";
import { TaskForm } from "./task-form";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import type { Task } from "@/types";
import { toast } from "sonner";

interface TaskListProps {
  jobId: string;
  isJobPaid?: boolean;
  onSelectTask?: (taskId: string) => void;
}

export function TaskList({ jobId, isJobPaid, onSelectTask }: TaskListProps) {
  const queryClient = useQueryClient();
  const { data: jobTasksUnsorted = [], isLoading } = useQuery({ 
    queryKey: ["tasks", jobId], 
    queryFn: () => tasksService.getByJobId(jobId) 
  });
  const createTaskMutation = useMutation({
    mutationFn: tasksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", jobId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // For global tasks list
    },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const getPriorityScore = (prioridad?: "alta" | "media" | "baja") => {
    switch (prioridad) {
      case "alta": return 3;
      case "media": return 2;
      case "baja": return 1;
      default: return 0;
    }
  };

  const jobTasks = [...jobTasksUnsorted]
    .sort((a, b) => {
      const scoreA = getPriorityScore(a.prioridad);
      const scoreB = getPriorityScore(b.prioridad);
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      return a.orden - b.orden;
    });

  const initialCount = 5;
  const visibleTasks = showAll ? jobTasks : jobTasks.slice(0, initialCount);
  const hasMore = !showAll && jobTasks.length > initialCount;

  const handleAdd = async (data: { descripcion: string; cantidad?: number; precio_unitario?: number; precio: number | null; prioridad?: "alta" | "media" | "baja"; fecha_vencimiento?: string }) => {
    try {
      await createTaskMutation.mutateAsync({
        trabajo_id: jobId,
        descripcion: data.descripcion,
        cantidad: data.cantidad,
        precio_unitario: data.precio_unitario,
        precio: data.precio,
        completada: false,
        orden: jobTasks.length,
        prioridad: data.prioridad,
        fecha_vencimiento: data.fecha_vencimiento,
      });
    } catch (error) {
      toast.error("Error al agregar tarea");
      throw error;
    }
  };

  const columns: Column<Task>[] = [
    { label: "Descripción" },
    { label: "Precio", headerClassName: "w-32 text-right" },
    { label: "", headerClassName: "w-10" },
  ];

  if (isLoading) {
    return (
      <div className="mt-8 bg-surface/60 backdrop-blur-xl rounded-xl border border-outline-variant/15 shadow-sm p-4 animate-in fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/10">
          <div className="w-32 h-4 bg-outline-variant/10 rounded animate-pulse" />
          {!isJobPaid && <div className="w-24 h-8 bg-outline-variant/10 rounded-full animate-pulse" />}
        </div>
        <div className="divide-y divide-outline-variant/10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 py-4">
              <div className="w-6 h-6 rounded border-2 border-outline-variant/10 animate-pulse shrink-0" />
              <div className="flex-1 h-4 bg-outline-variant/10 rounded animate-pulse" />
              <div className="w-16 h-4 bg-outline-variant/10 rounded animate-pulse shrink-0 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 relative z-10">
      <DataTable
        columns={columns}
        items={visibleTasks}
        keyExtractor={(t) => t.id}
        title="Tareas del Trabajo"
        emptyMessage="Aún no hay tareas definidas"
        actions={
          !isJobPaid ? (
            <button
              onClick={() => setIsAdding(true)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/15 transition-colors text-[13px] font-bold text-primary shrink-0"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Agregar
            </button>
          ) : undefined
        }
        renderRow={(task) => (
          <TaskItem task={task} jobId={jobId} isJobPaid={isJobPaid} onSelect={onSelectTask} />
        )}
        footerRow={hasMore ? (
          <div className="pt-3 pb-3 flex justify-center border-t border-outline-variant/10 bg-surface/30">
            <button
              onClick={() => setShowAll(true)}
              className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-variant/30 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors transition-transform active:scale-95"
            >
              <span>Mostrar {jobTasks.length - initialCount} tareas más</span>
              <ChevronDown size={14} strokeWidth={2.5} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        ) : undefined}
      />

      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="Nueva tarea">
        <TaskForm onSave={handleAdd} onCancel={() => setIsAdding(false)} isSaving={createTaskMutation.isPending} />
      </Modal>
    </div>
  );
}
