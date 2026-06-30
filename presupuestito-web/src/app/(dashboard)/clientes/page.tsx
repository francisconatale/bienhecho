import type { Metadata } from "next";
import { Suspense } from "react";
import { ClientList } from "./components/client-list";
import { MasterDetailSkeleton } from "@/components/ui/master-detail-skeleton";

export const metadata: Metadata = {
  title: "Presupuestito - Clientes",
  description: "Gestioná tus clientes y presupuestos",
};

export default function ClientesPage() {
  return (
    <main className="flex-1 min-h-0 flex flex-col">
      <Suspense fallback={<MasterDetailSkeleton />}>
        <ClientList />
      </Suspense>
    </main>
  );
}
