import type { Metadata } from "next";
import { Suspense } from "react";
import { ClientList } from "./components/client-list";

export const metadata: Metadata = {
  title: "Presupuestito - Clientes",
  description: "Gestioná tus clientes y presupuestos",
};

export default function ClientesPage() {
  return (
    <main className="flex-1 min-h-0 flex flex-col">
      <Suspense>
        <ClientList />
      </Suspense>
    </main>
  );
}
