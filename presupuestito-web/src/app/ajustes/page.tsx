import type { Metadata } from "next";
import { AjustesContent } from "@/app/ajustes/components/content";

export const metadata: Metadata = {
  title: "Presupuestito - Ajustes",
  description: "Configurá tu cuenta y preferencias",
};

export default function AjustesPage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Aurora Background (difuso, inmersivo) único para Ajustes */}
      <div className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)' }}>
        
        {/* Light Mode Blobs (Centro alto y derecha media) */}
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[500px] md:w-[800px] h-[400px] md:h-[600px] bg-blue-500/20 md:bg-blue-500/15 blur-[110px] md:blur-[140px] rounded-[100%] dark:hidden transition-all duration-700" />
        <div className="absolute top-[80px] right-[-50px] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-indigo-500/15 md:bg-indigo-500/10 blur-[100px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        
        {/* Dark Mode Blobs (Foco superior derecho masivo y destello izquierdo) */}
        <div className="hidden dark:block absolute top-[-150px] right-[-100px] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-[#3B82F6]/25 md:bg-[#3B82F6]/15 blur-[130px] md:blur-[180px] rounded-full transition-all duration-700" />
        <div className="hidden dark:block absolute top-[120px] left-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-[#1E3A8A]/35 md:bg-[#1E3A8A]/25 blur-[120px] md:blur-[160px] rounded-full transition-all duration-700" />
      </div>

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full transition-all">
        <div className="mb-8 pl-1">
          <h1 className="text-[38px] leading-tight font-extrabold text-gray-900 dark:text-white tracking-tight">
            Ajustes
          </h1>
        </div>
        <div className="space-y-6">
          <AjustesContent />
        </div>
      </main>
    </div>
  );
}
