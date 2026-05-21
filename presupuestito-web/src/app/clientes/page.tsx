import type { Metadata } from "next";
import { ClientList } from "./components/client-list";

export const metadata: Metadata = {
  title: "Presupuestito - Clientes",
  description: "Gestioná tus clientes y presupuestos",
};

export default function ClientesPage() {
  return (
    <main className="flex-1 px-4 md:px-6 lg:px-8 py-8 space-y-8 mt-4 pb-24 max-w-6xl mx-auto w-full">
      <div className="px-2">
        <h1 className="text-[32px] font-extrabold text-on-surface tracking-tight">
          Mis Clientes
        </h1>
      </div>
      <ClientList />
    </main>
  );
}
