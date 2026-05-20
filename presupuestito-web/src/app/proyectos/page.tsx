import type { Metadata } from "next";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { ProjectList } from "./components/project-list";

export const metadata: Metadata = {
  title: "Presupuestito - Proyectos",
  description: "Gestioná tus proyectos y trabajos",
};

export default function ProyectosPage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)' }}>
        <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-blue-500/20 md:bg-blue-500/15 blur-[100px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/20 md:bg-indigo-500/15 blur-[120px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#3B82F6]/25 md:bg-[#3B82F6]/15 blur-[120px] md:blur-[180px] rounded-full transition-all duration-700" />
        <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-[#1E3A8A]/35 md:bg-[#1E3A8A]/25 blur-[120px] md:blur-[160px] rounded-full transition-all duration-700" />
      </div>

      {/* Main Content */}
      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full transition-all max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[38px] leading-tight font-extrabold text-gray-900 dark:text-white tracking-tight">
            Mis Proyectos
          </h1>
          <Link href="/proyectos/nuevo">
            <button
              aria-label="Nuevo proyecto"
              className="w-12 h-12 shrink-0 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors active:scale-95"
            >
              <PlusCircle className="w-6 h-6" strokeWidth={2} />
            </button>
          </Link>
        </div>

        <ProjectList />
      </main>
    </div>
  );
}
