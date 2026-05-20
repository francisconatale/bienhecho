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
    <div className="relative w-full min-h-screen">
      {/* Aurora Background (difuso, inmersivo) único para Nuevo Presupuesto */}
      <div className="absolute top-0 left-0 right-0 h-[450px] pointer-events-none overflow-hidden"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 15%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 15%, transparent 100%)' }}>
        
        {/* Light Mode Blobs */}
        <div className="absolute top-[-50px] right-[10%] w-[350px] h-[350px] bg-blue-500/20 blur-[100px] rounded-full dark:hidden" />
        <div className="absolute top-[80px] left-[10%] w-[300px] h-[300px] bg-indigo-500/20 blur-[110px] rounded-full dark:hidden" />
        
        {/* Dark Mode Blobs (Centro disperso) */}
        <div className="hidden dark:block absolute top-[50px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#3B82F6]/25 blur-[140px] rounded-[100%]" />
        <div className="hidden dark:block absolute top-[-50px] right-[10%] w-[350px] h-[350px] bg-[#1E3A8A]/35 blur-[120px] rounded-full" />
      </div>

      <main className="relative flex-1 px-5 pt-14 md:pt-20 pb-32 md:pb-16 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto w-full space-y-6 transition-all">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors pb-1 text-[15px] select-none"
          >
            Cancelar
          </Link>
          <h1 className="text-[20px] leading-tight font-bold text-gray-900 dark:text-white tracking-tight absolute left-1/2 -translate-x-1/2">
            Nuevo Presupuesto
          </h1>
          <button
            className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors pb-1 text-[15px] select-none"
          >
            Guardar
          </button>
        </div>

        <ClientSelector />
        <ConceptList />
        <TotalsSummary />
        <NotesField />
      </main>
    </div>
  );
}
