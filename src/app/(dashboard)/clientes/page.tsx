import type { Metadata } from "next";
import { ClientList } from "./components/client-list";
import { clientsService_getPaginated } from "@/actions/clients.actions";

export const metadata: Metadata = {
  title: "Clientes",
  description: "Gestioná tus clientes y presupuestos",
};

export default async function ClientesPage() {
  const initialData = await clientsService_getPaginated(1, 10, "");

  return (
    <main className="flex-1 min-h-0 flex flex-col">
      <ClientList initialData={initialData} />
    </main>
  );
}
