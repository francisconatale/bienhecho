"use client";

import { useState, useMemo } from "react";
import { Search, Briefcase, User, ChevronRight, Plus, X, Filter, Check, ListFilter } from "lucide-react";
import { useDataStore } from "@/lib/store";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TrabajosPage() {
  const { works, projects, clients } = useDataStore();
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter logic
  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const project = projects.find((p) => p.id === work.projectId);
      const client = project ? clients.find((c) => c.id === project.clientId) : null;
      
      const matchesSearch = work.name.toLowerCase().includes(search.toLowerCase()) ||
                           (project?.name.toLowerCase().includes(search.toLowerCase()) ?? false) ||
                           (client?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
      
      const matchesClient = !selectedClientId || project?.clientId === selectedClientId;
      const matchesProject = !selectedProjectId || work.projectId === selectedProjectId;

      return matchesSearch && matchesClient && matchesProject;
    });
  }, [works, projects, clients, search, selectedClientId, selectedProjectId]);

  const availableProjects = useMemo(() => {
    return selectedClientId 
      ? projects.filter(p => p.clientId === selectedClientId)
      : projects;
  }, [projects, selectedClientId]);

  const activeFiltersCount = (selectedClientId ? 1 : 0) + (selectedProjectId ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setSelectedClientId(null);
    setSelectedProjectId(null);
  };

  return (
    <main className="flex-1 pb-32 w-full pt-10 transition-all max-w-4xl mx-auto px-4 md:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">
            Trabajos
          </h1>
          <p className="text-base text-on-surface-variant/60 font-medium">
            Gestiona tus obras y servicios activos.
          </p>
        </div>
        
        <Link href="/presupuestos/nuevo">
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2563EB] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#2563EB]/20 hover:bg-[#1D4ED8] transition-all active:scale-95">
            <Plus className="w-4 h-4" strokeWidth={3} />
            Nuevo Presupuesto
          </button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Scalable Search & Filter Bar */}
        <div className="relative z-20">
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/30 group-focus-within:text-[#2563EB] transition-colors" />
              <input
                type="text"
                placeholder="Buscar trabajo, proyecto o cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-2xl pl-14 pr-12 py-4 text-base font-bold text-on-surface focus:ring-4 focus:ring-[#2563EB]/5 focus:border-[#2563EB] outline-none transition-all placeholder:text-on-surface-variant/20 shadow-sm"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-on-surface/5 rounded-full"
                >
                  <X className="w-4 h-4 text-on-surface-variant/40" />
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "px-5 rounded-2xl border transition-all flex items-center gap-2 font-black text-[11px] uppercase tracking-widest relative",
                isFilterOpen || activeFiltersCount > 0
                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-lg shadow-[#2563EB]/20"
                : "bg-surface border-outline-variant/30 text-on-surface-variant hover:border-[#2563EB]/30"
              )}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden md:block">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-grouped-bg-light">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel (Scalable Dropdown) */}
          {isFilterOpen && (
            <div className="absolute top-full mt-3 right-0 left-0 md:left-auto md:w-[400px] bg-surface border border-outline-variant/30 rounded-[32px] shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-on-surface">Ajustar Filtros</h3>
                    <button 
                        onClick={clearFilters}
                        className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] hover:opacity-70 transition-opacity"
                    >
                        Limpiar todo
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Cliente Selector (Scalable with scroll) */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Seleccionar Cliente</label>
                        <div className="max-h-[160px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                            <button
                                onClick={() => {
                                    setSelectedClientId(null);
                                    setSelectedProjectId(null);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                    selectedClientId === null ? "bg-[#2563EB]/10 text-[#2563EB]" : "hover:bg-on-surface/5 text-on-surface"
                                )}
                            >
                                Todos los clientes
                                {selectedClientId === null && <Check className="w-4 h-4" />}
                            </button>
                            {clients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => {
                                        setSelectedClientId(client.id);
                                        setSelectedProjectId(null);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                        selectedClientId === client.id ? "bg-[#2563EB]/10 text-[#2563EB]" : "hover:bg-on-surface/5 text-on-surface"
                                    )}
                                >
                                    {client.name}
                                    {selectedClientId === client.id && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Proyecto Selector (Contextual) */}
                    {(selectedClientId || availableProjects.length > 0) && (
                        <div className="space-y-3 pt-4 border-t border-outline-variant/10">
                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Seleccionar Proyecto</label>
                            <div className="max-h-[160px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                                <button
                                    onClick={() => setSelectedProjectId(null)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                        selectedProjectId === null ? "bg-[#2563EB]/10 text-[#2563EB]" : "hover:bg-on-surface/5 text-on-surface"
                                    )}
                                >
                                    Todos los proyectos
                                    {selectedProjectId === null && <Check className="w-4 h-4" />}
                                </button>
                                {availableProjects.map(project => (
                                    <button
                                        key={project.id}
                                        onClick={() => setSelectedProjectId(project.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                            selectedProjectId === project.id ? "bg-[#2563EB]/10 text-[#2563EB]" : "hover:bg-on-surface/5 text-on-surface"
                                        )}
                                    >
                                        {project.name}
                                        {selectedProjectId === project.id && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full mt-8 py-4 bg-[#2563EB] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#2563EB]/20 active:scale-95 transition-all"
                >
                    Aplicar Filtros
                </button>
            </div>
          )}
        </div>

        {/* Status bar de resultados */}
        <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
                {filteredWorks.length} {filteredWorks.length === 1 ? 'Trabajo encontrado' : 'Trabajos encontrados'}
            </span>
            {(search || activeFiltersCount > 0) && (
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Vista filtrada</span>
                </div>
            )}
        </div>

        {/* Lista de Trabajos */}
        <div className="bg-surface rounded-[32px] border border-outline-variant/30 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
          {filteredWorks.length > 0 ? (
            filteredWorks.map((work) => {
              const project = projects.find(p => p.id === work.projectId);
              const client = project ? clients.find(c => c.id === project.clientId) : null;
              
              return (
                <Link 
                  key={work.id} 
                  href={`/trabajos/${work.id}`}
                  className="flex items-center justify-between p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/5 flex items-center justify-center shrink-0 border border-[#2563EB]/10">
                      <Briefcase className="w-7 h-7 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="font-bold text-lg text-on-surface truncate tracking-tight">{work.name}</h3>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          work.status === 'Finalizado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                          work.status === 'En Progreso' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-on-surface/5 text-on-surface-variant'
                        }`}>
                          {work.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-on-surface-variant/60 font-medium">
                        <span className="text-on-surface font-bold">{client?.name}</span>
                        <span className="opacity-30">/</span>
                        <span>{project?.name}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-on-surface-variant/20 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })
          ) : (
            <div className="py-24 text-center">
              <div className="bg-on-surface/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-on-surface-variant/20" />
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-1">Sin resultados</h3>
              <p className="text-sm font-medium text-on-surface-variant/40">No hay trabajos que coincidan con tu búsqueda.</p>
              <button 
                onClick={clearFilters}
                className="mt-6 text-[#2563EB] font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
              >
                Ver todos los trabajos
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
