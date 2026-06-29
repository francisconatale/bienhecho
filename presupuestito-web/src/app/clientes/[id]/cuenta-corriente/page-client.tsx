"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useQuery } from "@tanstack/react-query";
import { clientsService } from "@/services";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MetricasCuenta } from "./components/metricas-cuenta";
import { TransaccionesList } from "./components/transacciones-list";

export function CuentaCorrientePageClient({ id }: { id: string }) {
  const router = useRouter();
  const { popHistory } = useNavigationHistory();
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: clientsService.getAll });
  const client = clients.find((c) => c.id === id);

  if (!client) {
    notFound();
  }

  return (
    <div className="relative w-full min-h-screen animate-fade-in-up bg-transparent">
      <AuroraBackground preset="perfil" />

      {/* Mobile: simple back button */}
      <div className="md:hidden px-4 py-2.5 relative z-10">
        <button onClick={() => router.push(popHistory(`/clientes?clienteId=${id}`))} className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant font-medium hover:text-on-surface transition-colors active:scale-95 cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      <main className="relative z-10 flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-[1200px] mx-auto w-full md:mt-0 space-y-6">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
            <button 
              onClick={() => router.push(popHistory(`/clientes?clienteId=${id}`))}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a {client.nombre}
            </button>
          </div>
        </div>

        <div className="space-y-2 cursor-default select-none pb-4">
          <h1 className="text-4xl md:text-5xl font-black text-on-surface leading-[1.1] tracking-tighter">
            Cuenta Corriente
          </h1>
        </div>

        <div className="space-y-6 relative">
          <MetricasCuenta clienteId={client.id} />
          
          <div className="grid grid-cols-1 gap-6">
            <TransaccionesList clienteId={client.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
