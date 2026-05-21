"use client";

import React from "react";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BudgetList } from "./components/budget-list";
import { useDataStore } from "@/lib/store";

interface TrabajoPageProps {
  params: Promise<{ id: string }>;
}

export default function TrabajoPage({ params }: TrabajoPageProps) {
  const { id } = React.use(params);
  const { works, projects } = useDataStore();
  const work = works.find(w => w.id === id);
  
  if (!work) {
    notFound();
  }

  const project = projects.find(p => p.id === work.projectId);

  return (
    <div className="relative w-full min-h-screen">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)' }}>
        <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-blue-500/20 md:bg-blue-500/15 blur-[100px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/20 md:bg-indigo-500/15 blur-[120px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#3B82F6]/25 md:bg-[#3B82F6]/15 blur-[120px] md:blur-[180px] rounded-full transition-all duration-700" />
        <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-[#1E3A8A]/35 md:bg-[#1E3A8A]/25 blur-[120px] md:blur-[160px] rounded-full transition-all duration-700" />
      </div>

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full transition-all max-w-4xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center gap-4 mb-2">
          <Link href={`/proyectos/${work.projectId}`}>
            <button
              aria-label="Volver"
              className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          </Link>
          <h1 className="text-[32px] md:text-[38px] leading-tight font-extrabold text-gray-900 dark:text-white tracking-tight">
            Trabajo
          </h1>
        </div>

        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-1">{work.name}</h2>
              <p className="text-sm font-medium text-on-surface-variant">{project?.name || 'Proyecto desconocido'}</p>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300`}>
              {work.status}
            </span>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Presupuestos
            </h3>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Nuevo</span>
            </button>
          </div>
          
          <BudgetList workId={work.id} />
        </section>
      </main>
    </div>
  );
}
