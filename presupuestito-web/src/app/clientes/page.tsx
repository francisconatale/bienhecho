import type { Metadata } from "next";
import { ClientList } from "./components/client-list";

export const metadata: Metadata = {
  title: "Presupuestito - Clientes",
  description: "Gestioná tus clientes y presupuestos",
};

export default function ClientesPage() {
  return (
    <main className="flex-1 h-[calc(100dvh-64px)] md:h-dvh mt-0 md:mt-0 pb-20 md:pb-0">
      <ClientList />
    </main>
  );
}
