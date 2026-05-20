import type { Metadata } from "next";
import { EditarPerfilHeader } from "@/app/ajustes/perfil/components/header";
import { EditarPerfilContent } from "@/app/ajustes/perfil/components/content";
import { BottomNav } from "@/components/layout/bottom-nav";

export const metadata: Metadata = {
  title: "Presupuestito - Editar Perfil",
  description: "Modificá los datos de tu cuenta personal y empresa",
};

export default function EditarPerfilPage() {
  return (
    <>
      <EditarPerfilHeader />

      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <EditarPerfilContent />
      </main>

      <BottomNav />
    </>
  );
}
