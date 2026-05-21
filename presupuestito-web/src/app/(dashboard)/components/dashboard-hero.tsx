"use client";

import { FileText, Wallet } from "lucide-react";
import { useUserStore } from "@/lib/user-store";
import { useEffect, useState } from "react";

interface DashboardHeroProps {
  name?: string;
  activeBudgets?: number;
  totalPending?: string;
}

export function DashboardHero({
  name,
  activeBudgets = 12,
  totalPending = "$4,500",
}: DashboardHeroProps) {
  const user = useUserStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = name || (mounted ? user?.name : null) || "Francisco";

  return (
    <div className="relative w-full">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[500px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700"
        style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)' }}>

        {/* Light Mode Blobs */}
        <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-500/30 md:bg-blue-500/20 blur-[100px] md:blur-[160px] rounded-full -translate-y-1/4 translate-x-1/4 dark:hidden transition-all duration-700" />
        <div className="absolute top-[100px] left-[-100px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-indigo-500/20 md:bg-indigo-500/15 blur-[120px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />

        {/* Dark Mode Blobs */}
        <div className="hidden dark:block absolute top-[-50px] md:top-[-100px] right-[-50px] md:right-[-200px] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-[#3B82F6]/25 md:bg-[#3B82F6]/20 blur-[120px] md:blur-[180px] rounded-full transition-all duration-700" />
        <div className="hidden dark:block absolute top-[150px] md:top-[50px] left-[-150px] md:left-[-100px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#1E3A8A]/40 md:bg-[#1E3A8A]/30 blur-[130px] md:blur-[160px] rounded-full transition-all duration-700" />
      </div>

      {/* Main Foreground Content */}
      <div className="relative pt-16 md:pt-24 px-5 md:px-8 lg:px-12">
        <div className="md:flex md:items-end md:justify-between md:gap-8">
          
          {/* Título */}
          <div className="mb-10 md:mb-0 px-2 md:px-0 md:flex-1">
            <h1 className="text-[38px] md:text-[56px] lg:text-[64px] leading-tight font-extrabold text-gray-900 dark:text-white tracking-tight md:tracking-tighter transition-all">
              ¡Hola, {displayName}!
            </h1>
            <p className="hidden md:block mt-4 text-lg text-gray-600 dark:text-gray-400 font-medium max-w-md">
              Aquí tienes el resumen de tu actividad financiera. Administra tus presupuestos de manera profesional.
            </p>
          </div>

          {/* Grid de Stats */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 md:w-[500px] shrink-0">
            <div className="bg-white/60 dark:bg-[#1A1C20]/60 backdrop-blur-2xl rounded-[32px] p-5 md:p-6 flex flex-col justify-between min-h-[140px] md:min-h-[160px] border border-white/50 dark:border-white/[0.08] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/80 dark:hover:bg-[#1A1C20]/80">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-100 dark:bg-[#3B82F6]/20 flex items-center justify-center mb-4 md:mb-6">
                <FileText className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-[#60A5FA]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-[32px] md:text-[40px] font-bold tracking-tight leading-none mb-2 md:mb-3">{activeBudgets}</p>
                <p className="text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px] font-semibold tracking-wide">
                  Presupuestos
                </p>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-[#1A1C20]/60 backdrop-blur-2xl rounded-[32px] p-5 md:p-6 flex flex-col justify-between min-h-[140px] md:min-h-[160px] border border-white/50 dark:border-white/[0.08] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/80 dark:hover:bg-[#1A1C20]/80">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-100 dark:bg-[#3B82F6]/20 flex items-center justify-center mb-4 md:mb-6">
                <Wallet className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-[#60A5FA]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-[32px] md:text-[40px] font-bold tracking-tight leading-none mb-2 md:mb-3">{totalPending}</p>
                <p className="text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px] font-semibold tracking-wide">
                  Por Cobrar
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
