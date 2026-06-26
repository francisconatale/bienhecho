"use client";

import React from "react";
import { ChevronLeft, Plus, User, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BudgetList } from "./components/budget-list";
import { useDataStore } from "@/lib/store";

interface TrabajoPageProps {
  params: Promise<{ id: string }>;
}

export default function TrabajoPage({ params }: TrabajoPageProps) {
  const { id } = React.use(params);
  const { jobs, clients } = useDataStore();
  
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    notFound();
  }

  const client = clients.find(c => c.id === job.clientId);

  return (
    <div className="relative w-full min-h-screen">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)' }}>
        <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/20 md:bg-primary/15 blur-[100px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/20 md:bg-primary-container/15 blur-[120px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/25 md:bg-primary/15 blur-[120px] md:blur-[180px] rounded-full transition-all duration-700" />
        <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/35 md:bg-primary-container/25 blur-[120px] md:blur-[160px] rounded-full transition-all duration-700" />
      </div>

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full transition-all max-w-4xl mx-auto space-y-8">
        {/* Header Actions */}
        <div className="flex items-center gap-4 mb-2">
          <Link href="/trabajos">
            <button
              aria-label="Volver"
              className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-on-surface" />
            </button>
          </Link>
          <h1 className="text-[32px] md:text-[38px] leading-tight font-extrabold text-on-surface tracking-tight">
            Detalle del Trabajo
          </h1>
        </div>

        <div className="bg-surface rounded-[32px] p-8 border border-outline-variant/10 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Obra activa</span>
              </div>
              <h2 className="text-2xl font-black text-on-surface tracking-tight leading-none">{job.name}</h2>
              <div className="flex items-center gap-2 text-on-surface-variant/60 font-medium">
                <User className="w-4 h-4" />
                <span className="text-sm font-bold text-on-surface">{client?.name || "Sin cliente"}</span>
              </div>
            </div>
            
            <div className={`self-start text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
              job.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-600' : 
              job.status === 'En Progreso' ? 'bg-primary/10 text-primary' : 'bg-on-surface/5 text-on-surface-variant'
            }`}>
              {job.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-outline-variant/10">
            <div className="flex items-center gap-3 p-4 bg-on-surface/5 rounded-2xl">
                <Calendar className="w-5 h-5 text-on-surface-variant/40" />
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Fecha de inicio</p>
                    <p className="text-sm font-bold text-on-surface">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-on-surface/5 rounded-2xl">
                <Clock className="w-5 h-5 text-on-surface-variant/40" />
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Última actualización</p>
                    <p className="text-sm font-bold text-on-surface">Hace poco</p>
                </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em]">
              Historial de Presupuestos
            </h3>
            <Link href="/presupuestos/nuevo">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95">
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                    <span>Añadir</span>
                </button>
            </Link>
          </div>
          
          <BudgetList jobId={job.id} />
        </section>
      </main>
    </div>
  );
}
