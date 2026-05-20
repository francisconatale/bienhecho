import type { Metadata } from "next";
import { ClientsHeader } from "@/app/clientes/components/header";
import { ClientsContent } from "@/app/clientes/components/content";
import { BottomNav } from "@/components/layout/bottom-nav";

export const metadata: Metadata = {
  title: "Presupuestito - Clientes",
  description: "Gestioná tus clientes y presupuestos",
};

export default function ClientesPage() {
  return (
    <>
      <ClientsHeader />

      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <ClientsContent />
      </main>

      <BottomNav />
    </>
  );
}
