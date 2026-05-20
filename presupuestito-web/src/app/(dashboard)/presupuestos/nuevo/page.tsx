import Link from "next/link";
import { Header } from "@/components/layout/header";
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
      <Header
        title="Nuevo Presupuesto"
        leftAction={
          <Link 
            href="/" 
            className="text-primary font-medium text-body px-2 -ml-2 hover:bg-surface-variant rounded-lg py-1 transition-colors min-w-20"
          >
            Cancelar
          </Link>
        }
        rightAction={
          <button 
            className="text-primary font-bold text-headline px-2 -mr-2 hover:bg-surface-variant rounded-lg py-1 transition-colors min-w-20 text-right"
          >
            Guardar
          </button>
        }
      />
      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <NuevoPresupuestoContent />
      </main>
      <BottomNav />
    </>
  );
}
