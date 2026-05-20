import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { EditarPerfilContent } from "@/app/ajustes/perfil/components/content";
import { BottomNav } from "@/components/layout/bottom-nav";

export const metadata: Metadata = {
  title: "Presupuestito - Editar Perfil",
  description: "Modificá los datos de tu cuenta personal y empresa",
};

export default function EditarPerfilPage() {
  return (
    <>
      <Header
        title="Editar Perfil"
        leftAction={
          <Link
            href="/ajustes"
            className="text-primary font-medium hover:opacity-70 transition-opacity pb-1 text-sm select-none"
          >
            Cancelar
          </Link>
        }
        rightAction={
          <button
            type="button"
            className="text-primary font-semibold hover:opacity-70 transition-opacity pb-1 text-sm select-none"
          >
            Guardar
          </button>
        }
      />

      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <EditarPerfilContent />
      </main>

      <BottomNav />
    </>
  );
}
