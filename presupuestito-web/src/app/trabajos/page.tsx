"use client";

import { useState } from "react";
import { Search, Filter, Briefcase, User, ChevronRight, Plus } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";
import Link from "next/link";

export default function TrabajosPage() {
  const { works, projects, clients } = useDataStore();
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Filter logic
  const filteredWorks = works.filter((work) => {
    const project = projects.find((p) => p.id === work.projectId);
    
    const matchesSearch = work.name.toLowerCase().includes(search.toLowerCase()) ||
                         (project?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
    
    const matchesClient = !selectedClientId || project?.clientId === selectedClientId;
    const matchesProject = !selectedProjectId || work.projectId === selectedProjectId;

    return matchesSearch && matchesClient && matchesProject;
  });

  const availableProjects = selectedClientId 
    ? projects.filter(p => p.clientId === selectedClientId)
    : projects;

  return (
    <main className="flex-1 pb-32 w-full pt-10 transition-all max-w-4xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">
            Trabajos
          </h1>
          <p className="text-base text-on-surface-variant/60 font-medium">
            Gestiona el estado de tus obras y servicios en curso.
          </p>
        </div>
        
        <Link href="/presupuestos/nuevo">
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2563EB] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#2563EB]/20 hover:bg-[#1D4ED8] transition-all active:scale-95">
            <Plus className="w-4 h-4" strokeWidth={3} />
            Nuevo Presupuesto
          </button>
        </Link>
      </div>

      <div className="space-y-8">
        {/* Filtros */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
            <input
              type="text"
              placeholder="Buscar por nombre de trabajo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all placeholder:text-on-surface-variant/30"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <User className="w-3 h-3 text-on-surface-variant/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">Filtrar por Cliente</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
               <button
                onClick={() => {
                  setSelectedClientId(null);
                  setSelectedProjectId(null);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedClientId === null 
                  ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20' 
                  : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:border-[#2563EB]/30'
                }`}
              >
                Todos
              </button>
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedClientId(client.id);
                    setSelectedProjectId(null);
                  }}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedClientId === client.id 
                    ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20' 
                    : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:border-[#2563EB]/30'
                  }`}
                >
                  {client.name}
                </button>
              ))}
            </div>
          </div>

          {availableProjects.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 px-1">
                <Briefcase className="w-3 h-3 text-on-surface-variant/40" />
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">Filtrar por Proyecto</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                  onClick={() => setSelectedProjectId(null)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedProjectId === null 
                    ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20' 
                    : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:border-[#2563EB]/30'
                  }`}
                >
                  Todos los proyectos
                </button>
                {availableProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedProjectId === project.id 
                      ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20' 
                      : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:border-[#2563EB]/30'
                    }`}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lista de Trabajos */}
        <div className="bg-surface rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
          {filteredWorks.length > 0 ? (
            filteredWorks.map((work) => {
              const project = projects.find(p => p.id === work.projectId);
              const client = project ? clients.find(c => c.id === project.clientId) : null;
              
              return (
                <Link 
                  key={work.id} 
                  href={`/trabajos/${work.id}`}
                  className="flex items-center justify-between p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-base text-on-surface truncate">{work.name}</h3>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          work.status === 'Finalizado' ? 'bg-success/10 text-success' : 
                          work.status === 'En Progreso' ? 'bg-blue-500/10 text-blue-500' : 'bg-on-surface/5 text-on-surface-variant'
                        }`}>
                          {work.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant/60 font-medium">
                        <User className="w-3 h-3" />
                        <span>{client?.name}</span>
                        <span className="opacity-30">•</span>
                        <span>{project?.name}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-on-surface-variant/20 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })
          ) : (
            <div className="py-20 text-center">
              <div className="bg-on-surface/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-on-surface-variant/20" />
              </div>
              <p className="text-sm font-bold text-on-surface-variant/40">No se encontraron trabajos.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
