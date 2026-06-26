"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useDataStore } from "@/lib/store";
import { Header } from "@/components/layout/header";
import { PaymentsDashboard } from "../components/payments-dashboard";

interface PagosPageProps {
  params: Promise<{ id: string }>;
}

export default function PagosPage({ params }: PagosPageProps) {
  const { id } = React.use(params);
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const clienteId = searchParams.get("clienteId");
  const backHref = `/trabajos/${id}${from ? `?from=${from}${clienteId ? `&clienteId=${clienteId}` : ""}` : ""}`;
  const { jobs } = useDataStore();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  const leftAction = (
    <Link href={backHref}>
      <button
        aria-label="Volver"
        className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
      >
        <ChevronLeft className="w-6 h-6 text-on-surface" />
      </button>
    </Link>
  );

  return (
    <div className="relative w-full min-h-screen">
      {/* Grain / Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[100] dark:opacity-[0.06]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

      {/* Aurora Background */}
      <div
        className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-1000"
        style={{
          zIndex: -1,
          WebkitMaskImage:
            "linear-gradient(to bottom, black 10%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
        }}
      >
        <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/30 md:bg-primary/20 blur-[100px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/30 md:bg-primary-container/20 blur-[120px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000" />
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/35 md:bg-primary/25 blur-[120px] md:blur-[180px] rounded-full transition-all duration-1000" />
        <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/40 md:bg-primary-container/30 blur-[120px] md:blur-[160px] rounded-full transition-all duration-1000" />
      </div>

      <div className="md:hidden">
        <Header
          title="Plan de Pagos y Cobros"
          leftAction={leftAction}
          actionContainerClassName="flex items-center shrink-0 w-auto min-w-[40px]"
        />
      </div>

      <main className="relative flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-4xl mx-auto w-full mt-20 md:mt-0 space-y-6">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
            <Link 
              href={backHref}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a {job.titulo}
            </Link>
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
