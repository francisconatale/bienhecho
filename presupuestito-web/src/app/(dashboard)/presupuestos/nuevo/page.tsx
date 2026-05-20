import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { ClientSelector } from "./components/client-selector";
import { ConceptList } from "./components/concept-list";
import { TotalsSummary } from "./components/totals-summary";
import { NotesField } from "./components/notes-field";

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
        <ClientSelector />
        <ConceptList />
        <TotalsSummary
          subtotal="970,00 €"
          ivaRate={21}
          iva="203,70 €"
          total="1.173,70 €"
        />
        <NotesField />
      </main>
    </>
  );
}
