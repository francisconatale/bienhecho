import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProjectForm } from "./components/project-form";

export const metadata: Metadata = {
  title: "Nuevo Proyecto - Presupuestito",
  description: "Crear un nuevo proyecto",
};

export default function NuevoProyectoPage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Aurora Background (difuso, inmersivo) */}
      <div className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)' }}>
        <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-blue-500/20 md:bg-blue-500/15 blur-[100px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/20 md:bg-indigo-500/15 blur-[120px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#3B82F6]/25 md:bg-[#3B82F6]/15 blur-[120px] md:blur-[180px] rounded-full transition-all duration-700" />
        <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-[#1E3A8A]/35 md:bg-[#1E3A8A]/25 blur-[120px] md:blur-[160px] rounded-full transition-all duration-700" />
      </div>

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full transition-all max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/proyectos" 
            className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-on-surface" />
          </Link>
          <h1 className="text-[32px] md:text-[38px] leading-tight font-extrabold text-gray-900 dark:text-white tracking-tight">
            Nuevo Proyecto
          </h1>
        </div>

        <div className="max-w-2xl">
          <ProjectForm />
        </div>
      </main>
    </div>
  );
}
