import type { Metadata } from "next";
import { Suspense } from "react";
import { JobList } from "./components/job-list";

export const metadata: Metadata = {
  title: "Presupuestito - Trabajos",
  description: "Gestioná tus proyectos y presupuestos activos",
};

export default function TrabajosPage() {
  return (
    <main className="flex-1 min-h-0 flex flex-col w-full">
      <Suspense fallback={<div className="flex-1 min-h-screen bg-transparent" />}>
        <JobList />
      </Suspense>
    </main>
  );
}
