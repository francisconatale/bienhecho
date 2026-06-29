"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/services";
import { TaskDetailPanel } from "@/app/trabajos/[id]/components/task-detail-panel";

interface TareaPageProps {
  params: Promise<{ id: string }>;
}

export default function TareaPage({ params }: TareaPageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: tasksService.getAll });
  const task = tasks.find((t) => t.id === id);

  if (!task) return null;

  return (
    <TaskDetailPanel
      jobId={task.trabajo_id}
      taskId={task.id}
      onBack={() => router.push("/tareas")}
      backLabel="Tareas"
    />
  );
}
