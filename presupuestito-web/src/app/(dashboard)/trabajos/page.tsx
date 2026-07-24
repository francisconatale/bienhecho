import type { Metadata } from "next";
import { JobList } from "./components/job-list";
import { jobsService_getPaginated } from "@/actions/jobs.actions";

export const metadata: Metadata = {
  title: "Trabajos",
  description: "Gestioná tus proyectos y presupuestos activos",
};

export default async function TrabajosPage() {
  const initialData = await jobsService_getPaginated(1, 10, "");

  return (
    <main className="flex-1 min-h-0 flex flex-col w-full">
      <JobList initialData={initialData} />
    </main>
  );
}
