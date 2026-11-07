import type { Metadata } from "next";
import { TareasContent } from "./tareas-content";
import { tasksService_getCounts, tasksService_getResumen } from "@/actions/tasks.actions";

export const metadata: Metadata = {
  title: "Tareas",
  description: "Gestioná y seguí tus tareas operativas por prioridad",
};

export default async function TareasPage() {
  const [counts, resumen] = await Promise.all([
    tasksService_getCounts(),
    tasksService_getResumen(),
  ]);

  return <TareasContent initialData={{ counts, resumen }} />;
}
