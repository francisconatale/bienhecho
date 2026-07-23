"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/services";
import { TaskDetailPanel } from "@/app/(dashboard)/trabajos/[id]/components/task-detail-panel";

interface TareaPageProps {
  params: Promise<{ id: string }>;
}

export default function TareaPage({ params }: TareaPageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: tasksService.getAll });
  const task = tasks.find((t) => t.id === id);

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
    />
  );
}
