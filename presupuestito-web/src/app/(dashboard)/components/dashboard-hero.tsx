"use client";

import { FileText, Wallet } from "lucide-react";

interface DashboardHeroProps {
  name?: string;
  activeBudgets?: number;
  totalPending?: string;
}

export function DashboardHero({
  name = "Francisco",
  activeBudgets = 12,
  totalPending = "$4,500",
}: DashboardHeroProps) {
  return (
    <div className="relative w-full">
      {/* Aurora Background (difuso, inmersivo, sin cortes secos) */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden"
        style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)' }}>

        {/* Light Mode Blobs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/30 blur-[100px] rounded-full -translate-y-1/4 translate-x-1/4 dark:hidden" />
        <div className="absolute top-[100px] left-[-100px] w-[350px] h-[350px] bg-indigo-500/20 blur-[120px] rounded-full dark:hidden" />

        {/* Dark Mode Blobs (Azul/Índigo original respetado, pero en estilo Aurora) */}
        <div className="hidden dark:block absolute top-[-50px] right-[-50px] w-[500px] h-[500px] bg-[#3B82F6]/25 blur-[120px] rounded-full" />
        <div className="hidden dark:block absolute top-[150px] left-[-150px] w-[400px] h-[400px] bg-[#1E3A8A]/40 blur-[130px] rounded-full" />
      </div>

      {/* Main Foreground Content */}
      <div className="relative pt-16 px-5">
        {/* Título */}
        <div className="mb-10 px-2">
          <h1 className="text-[38px] leading-tight font-extrabold text-gray-900 dark:text-white tracking-tight">
            ¡Hola, {name}!
          </h1>
        </div>

        {/* Grid de Stats (Estilo Floating Soft Cards) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 dark:bg-[#1A1C20]/60 backdrop-blur-2xl rounded-[32px] p-5 flex flex-col justify-between min-h-[140px] border border-white/50 dark:border-white/[0.08] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)]">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-[#3B82F6]/20 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-[#60A5FA]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white text-[32px] font-bold tracking-tight leading-none mb-2">{activeBudgets}</p>
              <p className="text-gray-600 dark:text-gray-400 text-[13px] font-semibold tracking-wide">
                Presupuestos
              </p>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-[#1A1C20]/60 backdrop-blur-2xl rounded-[32px] p-5 flex flex-col justify-between min-h-[140px] border border-white/50 dark:border-white/[0.08] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)]">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-[#3B82F6]/20 flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-[#60A5FA]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white text-[32px] font-bold tracking-tight leading-none mb-2">{totalPending}</p>
              <p className="text-gray-600 dark:text-gray-400 text-[13px] font-semibold tracking-wide">
                Por Cobrar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
