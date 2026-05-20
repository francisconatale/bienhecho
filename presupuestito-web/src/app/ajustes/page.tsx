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
      <div className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none overflow-hidden"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)' }}>
        
        {/* Light Mode Blobs (Centro alto y derecha media) */}
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-blue-500/20 blur-[110px] rounded-[100%] dark:hidden" />
        <div className="absolute top-[80px] right-[-50px] w-[250px] h-[250px] bg-indigo-500/15 blur-[100px] rounded-full dark:hidden" />
        
        {/* Dark Mode Blobs (Foco superior derecho masivo y destello izquierdo) */}
        <div className="hidden dark:block absolute top-[-150px] right-[-100px] w-[500px] h-[500px] bg-[#3B82F6]/25 blur-[130px] rounded-full" />
        <div className="hidden dark:block absolute top-[120px] left-[-150px] w-[350px] h-[350px] bg-[#1E3A8A]/35 blur-[120px] rounded-full" />
      </div>

      <main className="relative flex-1 px-5 pt-16 pb-32 max-w-3xl mx-auto w-full">
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
