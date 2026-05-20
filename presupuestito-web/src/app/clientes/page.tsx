import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import { ClientList } from "./components/client-list";

export const metadata: Metadata = {
  title: "Presupuestito - Clientes",
  description: "Gestioná tus clientes y presupuestos",
};

export default function ClientesPage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Aurora Background (difuso, inmersivo) */}
      <div className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none overflow-hidden"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)' }}>
        
        {/* Light Mode Blobs */}
        <div className="absolute top-[-50px] left-[-50px] w-[350px] h-[350px] bg-blue-500/20 blur-[100px] rounded-full dark:hidden" />
        <div className="absolute top-[0px] right-[-100px] w-[300px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-full dark:hidden" />
        
        {/* Dark Mode Blobs */}
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] h-[400px] bg-[#3B82F6]/25 blur-[120px] rounded-full" />
        <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] h-[350px] bg-[#1E3A8A]/35 blur-[120px] rounded-full" />
      </div>

      {/* Main Content */}
      <main className="relative flex-1 px-5 pt-16 pb-32 max-w-3xl mx-auto w-full">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[38px] leading-tight font-extrabold text-gray-900 dark:text-white tracking-tight">
            Mis Clientes
          </h1>
          <button
            aria-label="Agregar cliente"
            className="w-12 h-12 shrink-0 rounded-full bg-black/5 dark:bg-white/[0.03] backdrop-blur-3xl flex items-center justify-center border border-black/[0.05] dark:border-white/[0.05] hover:bg-black/10 dark:hover:bg-white/10 transition-colors active:scale-95"
          >
            <UserPlus className="w-5 h-5 text-gray-800 dark:text-white" strokeWidth={2} />
          </button>
        </div>

        <ClientList />
      </main>
    </div>
  );
}
