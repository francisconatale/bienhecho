"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useDataStore } from "@/lib/store";
import { PaymentsDashboard } from "../components/payments-dashboard";

interface PagosPageProps {
  params: Promise<{ id: string }>;
}

export default function PagosPage({ params }: PagosPageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { popHistory } = useNavigationHistory();
  const { jobs } = useDataStore();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  return (
    <div className="relative w-full min-h-screen animate-slide-in-right bg-transparent">

      {/* Mobile: simple back button */}
      <div className="md:hidden px-4 py-2.5 relative z-10">
        <button onClick={() => router.push(popHistory(`/trabajos?id=${id}`))} className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant font-medium hover:text-on-surface transition-colors active:scale-95 cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      <main className="relative flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-4xl mx-auto w-full md:mt-0 space-y-6">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
            <button 
              onClick={() => router.push(popHistory(`/trabajos?id=${id}`))}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a {job.titulo}
            </button>
          </div>
        </div>

        <div className="space-y-2 cursor-default select-none">
          <h1 className="text-4xl md:text-5xl font-black text-on-surface leading-[1.1] tracking-tighter">
            Cuentas a Cobrar
          </h1>
          <p className="text-sm font-medium text-on-surface-variant/60">
            Gestión de saldo pendiente, cuotas y cobros recibidos
          </p>
        </div>

        <div className="relative">
          <PaymentsDashboard jobId={job.id} />
        </div>
      </main>
    </div>
  );
}
