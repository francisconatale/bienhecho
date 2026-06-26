"use client";

import React, { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { WorkList } from "./components/work-list";
import { WorkForm } from "./components/work-form";
import { useDataStore } from "@/lib/store";
import { notFound } from "next/navigation";
import { Modal } from "@/components/ui/modal";

interface ProyectoPageProps {
  params: Promise<{ id: string }>;
}

export default function ProyectoPage({ params }: ProyectoPageProps) {
  const { id } = React.use(params);
  const { projects, clients } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const project = projects.find(p => p.id === id);
  
  if (!project) {
    notFound();
  }

  const client = clients.find(c => c.id === project.clientId);

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

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full transition-all max-w-4xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center gap-4 mb-2">
          <Link href="/proyectos">
            <button
              aria-label="Volver"
              className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-on-surface" />
            </button>
          </Link>
          <h1 className="text-[32px] md:text-[38px] leading-tight font-extrabold text-on-surface tracking-tight">
            Proyecto
          </h1>
        </div>

        {/* Project Header Info */}
        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-1">{project.name}</h2>
              <p className="text-sm font-medium text-on-surface-variant">{client?.name || 'Cliente desconocido'}</p>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-primary/10 text-primary`}>
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Works Section */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Trabajos
            </h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </div>
          
          <WorkList projectId={project.id} />
        </section>
      </main>

      {/* New Work Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nuevo Trabajo / Fase"
      >
        <WorkForm 
          projectId={project.id} 
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}

