import type { Metadata } from "next";
import Link from "next/link";
import { EditarPerfilContent } from "@/app/ajustes/perfil/components/content";

export const metadata: Metadata = {
  title: "Presupuestito - Editar Perfil",
  description: "Modificá los datos de tu cuenta personal y empresa",
};

export default function EditarPerfilPage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Aurora Background (difuso, inmersivo) único para Perfil */}
      <div className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none overflow-hidden"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)' }}>
        
        {/* Light Mode Blobs (Centro Izquierda) */}
        <div className="absolute top-[20px] left-[-80px] w-[300px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-[100%] dark:hidden" />
        <div className="absolute top-[10px] right-[50px] w-[200px] h-[200px] bg-blue-500/15 blur-[90px] rounded-full dark:hidden" />
        
        {/* Dark Mode Blobs (Foco superior medio e izquierdo masivo) */}
        <div className="hidden dark:block absolute top-[0px] left-[-150px] w-[450px] h-[450px] bg-[#3B82F6]/30 blur-[130px] rounded-full" />
        <div className="hidden dark:block absolute top-[-50px] right-[50px] w-[250px] h-[250px] bg-[#1E3A8A]/40 blur-[110px] rounded-full" />
      </div>

      <main className="relative flex-1 px-5 pt-14 pb-32 max-w-3xl mx-auto w-full space-y-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/ajustes"
            className="text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors pb-1 text-[15px] select-none"
          >
            Cancelar
          </Link>
          <h1 className="text-[20px] leading-tight font-bold text-gray-900 dark:text-white tracking-tight absolute left-1/2 -translate-x-1/2">
            Editar Perfil
          </h1>
          <button
            type="button"
            className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors pb-1 text-[15px] select-none"
          >
            Guardar
          </button>
        </div>

        <EditarPerfilContent />
      </main>
    </div>
  );
}
