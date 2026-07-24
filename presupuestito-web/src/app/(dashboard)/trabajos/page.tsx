import type { Metadata } from "next";
import { JobList } from "./components/job-list";

export const metadata: Metadata = {
  title: "Trabajos",
  description: "Gestioná tus proyectos y presupuestos activos",
};

export default function TrabajosPage() {
  return (
    <main className="flex-1 min-h-0 flex flex-col w-full">
      <JobList />
    </main>
  );
}
