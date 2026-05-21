"use client";

import { useState } from "react";
import { User, ChevronDown, ChevronUp, Briefcase, Plus, Search, X, FileText } from "lucide-react";
import { useBudgetStore } from "../hooks/use-budget";
import { useDataStore } from "@/lib/store";
import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";
import { ProjectForm } from "@/app/proyectos/nuevo/components/project-form";
import { ClientForm } from "@/app/clientes/components/client-form";

export function BudgetIdentity() {
  const { budgetName, setBudgetName, clientId, projectId, setClient, setProject } = useBudgetStore();
  const { clients, projects } = useDataStore();
  
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const [clientSearch, setClientSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const selectedClient = clients.find((c) => c.id === clientId);
  const selectedProject = projects.find((p) => p.id === projectId);
  
  const clientProjects = projects.filter((p) => p.clientId === clientId);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
    c.email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredProjects = clientProjects.filter(p => 
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const handleNewClientSuccess = (newClientId: string) => {
    setClient(newClientId);
    setIsNewClientModalOpen(false);
    setIsClientListOpen(false);
  };

  const handleNewProjectSuccess = (newProjectId: string) => {
    setProject(newProjectId);
    setIsNewProjectModalOpen(false);
    setIsProjectListOpen(false);
  };

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, state: boolean) => {
    setIsClientListOpen(false);
    setIsProjectListOpen(false);
    setter(!state);
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
          Identificación
        </h2>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                placeholder="Ej: Reforma Cocina - Fase 1"
                className="w-full bg-transparent border-none rounded-xl pl-10 pr-4 py-0 text-sm font-bold text-on-surface focus:ring-0 outline-none placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
         <h2 className="px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
          Contexto
        </h2>
        <ListGroup>
          {/* Client Selector */}
          <div className="flex flex-col">
            <ListItem
              icon={<User className="w-5 h-5 text-primary" />}
              title={selectedClient ? selectedClient.name : "Seleccionar Cliente"}
              subtitle={selectedClient ? selectedClient.email : "Requerido"}
              onClick={() => handleToggle(setIsClientListOpen, isClientListOpen)}
              trailing={
                <div className="flex items-center gap-3">
                   <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNewClientModalOpen(true);
                      }}
                      className="p-1 text-primary/80 hover:text-primary"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  {isClientListOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-on-surface-variant" />}
                </div>
              }
            />
            {isClientListOpen && (
              <div className="px-4 pt-2 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="relative mx-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
                  <input type="text" placeholder="Buscar cliente..." value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} className="w-full bg-surface-variant/20 border-none rounded-lg pl-9 pr-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/30 outline-none" />
                </div>
                <div className="max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredClients.map((client) => (
                    <ListItem key={client.id} icon={client.name.charAt(0)} title={client.name} subtitle={client.email} onClick={() => { setClient(client.id); setIsClientListOpen(false); }} className="!rounded-lg !py-2 !border-none !px-2" showChevron={false} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Project Selector */}
          {clientId && (
            <div className="flex flex-col border-t border-outline-variant/10">
              <ListItem
                icon={<Briefcase className="w-5 h-5 text-blue-500" />}
                title={selectedProject ? selectedProject.name : "Seleccionar Campaña"}
                subtitle="Opcional"
                onClick={() => handleToggle(setIsProjectListOpen, isProjectListOpen)}
                trailing={
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); setIsNewProjectModalOpen(true);}} className="p-1 text-primary/80 hover:text-primary">
                      <Plus className="w-5 h-5" />
                    </button>
                    {isProjectListOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-on-surface-variant" />}
                  </div>
                }
              />
              {isProjectListOpen && (
                 <div className="px-4 pt-2 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative mx-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
                      <input type="text" placeholder="Buscar campaña..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className="w-full bg-surface-variant/20 border-none rounded-lg pl-9 pr-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/30 outline-none" />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                      {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                        <ListItem key={project.id} icon={<Briefcase className="w-4 h-4" />} title={project.name} subtitle={project.status} onClick={() => { setProject(project.id); setIsProjectListOpen(false); }} className="!rounded-lg !py-2 !border-none !px-2" showChevron={false} />
                      )) : <div className="py-4 text-center text-on-surface-variant text-[10px] font-medium">Sin campañas para este cliente.</div>}
                    </div>
                  </div>
              )}
            </div>
          )}
        </ListGroup>

        {isNewClientModalOpen && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center animate-in fade-in duration-300">
                <div className="relative bg-surface rounded-3xl shadow-2xl m-4 w-full max-w-lg">
                    <button onClick={() => setIsNewClientModalOpen(false)} className="absolute -top-2 -right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-outline-variant/30 z-10 text-on-surface-variant hover:scale-110 transition-transform">
                        <X className="w-4 h-4"/>
                    </button>
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-on-surface text-center mb-1">Nuevo Cliente</h3>
                        <p className="text-sm text-on-surface-variant text-center mb-6">Añade un nuevo cliente a tu base de datos.</p>
                        <ClientForm onSuccess={handleNewClientSuccess} onCancel={() => setIsNewClientModalOpen(false)} />
                    </div>
                </div>
            </div>
        )}

        {isNewProjectModalOpen && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center animate-in fade-in duration-300">
                <div className="relative bg-surface rounded-3xl shadow-2xl m-4 w-full max-w-lg">
                     <button onClick={() => setIsNewProjectModalOpen(false)} className="absolute -top-2 -right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-outline-variant/30 z-10 text-on-surface-variant hover:scale-110 transition-transform">
                        <X className="w-4 h-4"/>
                    </button>
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-on-surface text-center mb-1">Nueva Campaña</h3>
                        <p className="text-sm text-on-surface-variant text-center mb-6">Crea una campaña para organizar tus presupuestos.</p>
                        <ProjectForm initialClientId={clientId} hideClientSelection={true} onSuccess={handleNewProjectSuccess} onCancel={() => setIsNewProjectModalOpen(false)} />
                    </div>
                </div>
            </div>
        )}
      </div>
    </section>
  );
}

