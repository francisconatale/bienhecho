import type { Metadata } from "next";
import { TareasContent } from "./tareas-content";

export const metadata: Metadata = {
  title: "Tareas",
  description: "Gestioná y seguí tus tareas operativas por prioridad",
};

export default function TareasPage() {
  return <TareasContent />;
}
