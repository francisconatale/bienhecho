import type { Metadata } from "next";
import { PlusCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { ClientList } from "./components/client-list";

export const metadata: Metadata = {
  title: "Presupuestito - Clientes",
  description: "Gestioná tus clientes y presupuestos",
};

export default function ClientesPage() {
  return (
    <>
      <Header
        title="Clientes"
        rightAction={
          <button
            aria-label="Agregar cliente"
            className="text-primary p-2 -mr-2 rounded-full hover:bg-surface-variant transition-colors"
          >
            <PlusCircle className="w-8 h-8" strokeWidth={1.5} />
          </button>
        }
      />

      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <ClientList />
      </main>
    </>
  );
}
