"use client";

import { useState } from "react";
import { User, ChevronDown, ChevronUp, Briefcase, Hammer, Plus, Search, X, Info, FileText } from "lucide-react";
import { useBudgetStore } from "../hooks/use-budget";
import { useDataStore } from "@/lib/store";
import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";
import { ProjectForm } from "@/app/proyectos/nuevo/components/project-form";
import { WorkForm } from "@/app/trabajos/components/work-form";
import { ClientForm } from "@/app/clientes/components/client-form";

export function BudgetIdentity() {
  const { budgetName, setBudgetName, clientId, projectId, workId, setClient, setProject, setWork } = useBudgetStore();
  const { clients, projects, works } = useDataStore();
  
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  const [isWorkListOpen, setIsWorkListOpen] = useState(false);
  
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showNewWorkForm, setShowNewWorkForm] = useState(false);

  const [clientSearch, setClientSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const selectedClient = clients.find((c) => c.id === clientId);
  const selectedProject = projects.find((p) => p.id === projectId);
  const selectedWork = works.find((w) => w.id === workId);
  
  const clientProjects = projects.filter((p) => p.clientId === clientId);
  const projectWorks = works.filter((w) => w.projectId === projectId);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
    c.email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredProjects = clientProjects.filter(p => 
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const handleNewClientSuccess = (newClientId: string) => {
    setClient(newClientId);
    setShowNewClientForm(false);
    setIsClientListOpen(false);
  };

  const handleNewProjectSuccess = (newProjectId: string) => {
    setProject(newProjectId);
    setShowNewProjectForm(false);
    setIsProjectListOpen(false);
  };

  const handleNewWorkSuccess = (newWorkId: string) => {
    setWork(newWorkId);
    setShowNewWorkForm(false);
    setIsWorkListOpen(false);
  };

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, state: boolean) => {
    // Close all lists before opening a new one
    setIsClientListOpen(false);
    setIsProjectListOpen(false);
    setIsWorkListOpen(false);
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
                <div className="flex items-center gap-2">
                   <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNewClientForm(!showNewClientForm);
                        setIsClientListOpen(false);
                      }}
                      className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${showNewClientForm ? 'text-on-surface-variant' : 'text-primary'} z-10`}
                    >
                      {showNewClientForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      {showNewClientForm ? "CERRAR" : "NUEVO"}
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
            {showNewClientForm && (
              <div className="p-4 animate-in fade-in zoom-in-95 duration-300">
                <ClientForm onSuccess={handleNewClientSuccess} onCancel={() => setShowNewClientForm(false)} />
              </div>
            )}
          </div>

          {/* Project Selector */}
          {clientId && !showNewClientForm && (
            <div className="flex flex-col border-t border-outline-variant/10">
              <ListItem
                icon={<Briefcase className="w-5 h-5 text-blue-500" />}
                title={selectedProject ? selectedProject.name : "Seleccionar Campaña"}
                subtitle="Opcional"
                onClick={() => handleToggle(setIsProjectListOpen, isProjectListOpen)}
                trailing={
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setShowNewProjectForm(!showNewProjectForm); setIsProjectListOpen(false); }} className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${showNewProjectForm ? 'text-on-surface-variant' : 'text-primary'} z-10`}>
                      {showNewProjectForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      {showNewProjectForm ? "CERRAR" : "NUEVA"}
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
               {showNewProjectForm && (
                <div className="p-4 animate-in fade-in zoom-in-95 duration-300">
                  <ProjectForm initialClientId={clientId} hideClientSelection={true} onSuccess={handleNewProjectSuccess} onCancel={() => setShowNewProjectForm(false)} />
                </div>
              )}
            </div>
          )}

          {/* Work Selector */}
          {projectId && !showNewClientForm && !showNewProjectForm && (
             <div className="flex flex-col border-t border-outline-variant/10">
               <ListItem
                  icon={<Hammer className="w-5 h-5 text-amber-500" />}
                  title={selectedWork ? selectedWork.name : "Seleccionar Etapa"}
                  subtitle="Opcional"
                  onClick={() => handleToggle(setIsWorkListOpen, isWorkListOpen)}
                  trailing={
                     <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setShowNewWorkForm(!showNewWorkForm); setIsWorkListOpen(false);}} className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${showNewWorkForm ? 'text-on-surface-variant' : 'text-primary'} z-10`}>
                        {showNewWorkForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {showNewWorkForm ? "CERRAR" : "NUEVA"}
                      </button>
                      {isWorkListOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-on-surface-variant" />}
                    </div>
                  }
                />
                {isWorkListOpen && (
                  <div className="px-4 pt-2 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                      {projectWorks.length > 0 ? projectWorks.map((work) => (
                        <ListItem key={work.id} icon={<Hammer className="w-4 h-4" />} title={work.name} subtitle={work.status} onClick={() => { setWork(work.id); setIsWorkListOpen(false); }} className="!rounded-lg !py-2 !border-none !px-2" showChevron={false} />
                      )) : <div className="py-4 text-center text-on-surface-variant text-[10px] font-medium">Sin etapas registradas.</div>}
                    </div>
                  </div>
                )}
                {showNewWorkForm && (
                  <div className="p-4 animate-in fade-in zoom-in-95 duration-300">
                    <WorkForm initialProjectId={projectId} hideProjectSelection={true} onSuccess={handleNewWorkSuccess} onCancel={() => setShowNewWorkForm(false)} />
                  </div>
                )}
             </div>
          )}
        </ListGroup>
      </div>
    </section>
  );
}

