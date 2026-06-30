import type { Metadata } from "next";
import { Suspense } from "react";
import { JobList } from "./components/job-list";
import { MasterDetailSkeleton } from "@/components/ui/master-detail-skeleton";

export const metadata: Metadata = {
  title: "Presupuestito - Trabajos",
  description: "Gestioná tus proyectos y presupuestos activos",
};

export default function TrabajosPage() {
  return (
    <main className="flex-1 min-h-0 flex flex-col w-full">
      <Suspense fallback={<MasterDetailSkeleton />}>
        <JobList />
      </Suspense>
    </main>
  );
}
