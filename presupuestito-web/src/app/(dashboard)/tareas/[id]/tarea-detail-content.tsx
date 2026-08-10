"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { tasksService_getById } from "@/actions/tasks.actions";
import { TaskDetailPanel } from "@/app/(dashboard)/trabajos/[id]/components/task-detail-panel";
import { TareaDetailSkeleton } from "@/components/ui/skeletons";

interface TareaPageClientProps {
  id: string;
}

export function TareaDetailContent({ id }: TareaPageClientProps) {
  const router = useRouter();
  const { data: task, isLoading } = useQuery({ queryKey: ["tasks", id], queryFn: () => tasksService_getById(id) });

  if (isLoading) {
    return <TareaDetailSkeleton />;
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <h2 className="text-lg font-bold text-on-surface">Tarea no encontrada</h2>
        <p className="text-sm text-on-surface-variant mt-1">La tarea que buscás no existe o fue eliminada.</p>
        <button onClick={() => router.push("/tareas")} className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">
          Volver a Tareas
        </button>
      </div>
    );
  }

  return (
    <TaskDetailPanel
      jobId={task.trabajo_id}
      taskId={task.id}
      onBack={() => router.push("/tareas")}
      backLabel="Tareas"
      onDelete={() => router.push("/tareas")}
    />
  );
}
