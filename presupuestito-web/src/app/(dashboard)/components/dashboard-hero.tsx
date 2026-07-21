"use client";

import { FileText } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";

interface DashboardHeroProps {
  name?: string;
  activeBudgets?: number;
}

export function DashboardHero({
  name,
  activeBudgets = 12,
}: DashboardHeroProps) {
  const { profile, isLoading } = useProfile();

  const displayName = name || profile?.nombre || "Francisco";

  return (
    <div className="relative w-full pt-4 pb-2 md:pt-8 md:pb-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight">
          ¡Hola, {displayName}!
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant font-medium max-w-2xl">
          Aquí tienes el resumen de tu actividad. Administra tus presupuestos de manera profesional.
        </p>
      </div>
    </div>
  );
}
