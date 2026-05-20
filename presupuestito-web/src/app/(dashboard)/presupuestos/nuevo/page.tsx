import { NuevoPresupuestoHeader } from "@/app/(dashboard)/presupuestos/nuevo/components/header";
import { NuevoPresupuestoContent } from "@/app/(dashboard)/presupuestos/nuevo/components/content";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Presupuesto | Presupuestito",
  description: "Crea un nuevo presupuesto para tus clientes",
};

export default function NuevoPresupuestoPage() {
  return (
    <>
      <NuevoPresupuestoHeader />
      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <NuevoPresupuestoContent />
      </main>
      <BottomNav />
    </>
  );
}
