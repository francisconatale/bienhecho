"use client";

import { useState } from "react";
import { User, ChevronRight, Briefcase, Hammer, Plus } from "lucide-react";
import { useBudgetStore } from "../hooks/use-budget";
import { MOCK_CLIENTS, MOCK_PROJECTS, MOCK_WORKS } from "@/mocks";
import { Modal } from "@/components/ui/modal";
import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";
import { ProjectForm } from "@/app/proyectos/nuevo/components/project-form";
import { WorkForm } from "@/app/trabajos/components/work-form";
import { ClientForm } from "@/app/clientes/nuevo/components/client-form";

export function ClientSelector() {
  const { clientId, projectId, workId, setClient, setProject, setWork } = useBudgetStore();
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewWorkModalOpen, setIsNewWorkModalOpen] = useState(false);

  const selectedClient = MOCK_CLIENTS.find((c) => c.id === clientId);
  const selectedProject = MOCK_PROJECTS.find((p) => p.id === projectId);
  const selectedWork = MOCK_WORKS.find((w) => w.id === workId);
  
  const clientProjects = MOCK_PROJECTS.filter((p) => p.clientId === clientId);
  const projectWorks = MOCK_WORKS.filter((w) => w.projectId === projectId);

  const handleNewClientSuccess = (newClientId: string) => {
    setClient(newClientId);
    setIsNewClientModalOpen(false);
    setIsClientModalOpen(false);
  };

  const handleNewProjectSuccess = (newProjectId: string) => {
    setProject(newProjectId);
    setIsNewProjectModalOpen(false);
    setIsProjectModalOpen(false);
  };

  const handleNewWorkSuccess = (newWorkId: string) => {
    setWork(newWorkId);
    setIsNewWorkModalOpen(false);
    setIsWorkModalOpen(false);
  };

  return (
    <section className="space-y-4">
      {/* Selector de Cliente */}
      <div>
        <div className="flex items-center justify-between px-4 pb-2">
          <h2 className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
            Cliente
          </h2>
          <button 
            onClick={() => setIsNewClientModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-3 h-3" /> NUEVO
          </button>
        </div>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <button 
            onClick={() => setIsClientModalOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-variant/30 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <span className="block font-semibold text-on-surface">
                  {selectedClient ? selectedClient.name : "Seleccionar Cliente"}
                </span>
                {selectedClient && (
                  <span className="text-xs text-on-surface-variant">{selectedClient.email}</span>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Selector de Proyecto - Solo visible si hay un cliente seleccionado */}
      {clientId && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between px-4 pb-2">
            <h2 className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
              Proyecto
            </h2>
            <button 
              onClick={() => setIsNewProjectModalOpen(true)}
              className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-3 h-3" /> NUEVO
            </button>
          </div>
          <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-variant/30 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                  <Briefcase className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block font-semibold text-on-surface">
                    {selectedProject ? selectedProject.name : "Seleccionar Proyecto"}
                  </span>
                  {selectedProject && (
                    <span className="text-xs text-on-surface-variant">{selectedProject.status}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Selector de Trabajo - Solo visible si hay un proyecto seleccionado */}
      {projectId && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between px-4 pb-2">
            <h2 className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
              Trabajo / Fase
            </h2>
            <button 
              onClick={() => setIsNewWorkModalOpen(true)}
              className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-3 h-3" /> NUEVO
            </button>
          </div>
          <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <button 
              onClick={() => setIsWorkModalOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-variant/30 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                  <Hammer className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block font-semibold text-on-surface">
                    {selectedWork ? selectedWork.name : "Seleccionar Trabajo"}
                  </span>
                  {selectedWork && (
                    <span className="text-xs text-on-surface-variant">{selectedWork.status}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Selección de Cliente */}
      <Modal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
        title="Seleccionar Cliente"
      >
        <div className="p-4 pt-0">
          <button 
            onClick={() => setIsNewClientModalOpen(true)}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all font-semibold text-sm"
          >
            <Plus className="w-4 h-4" /> Crear Nuevo Cliente
          </button>
        </div>

        <ListGroup>
          {MOCK_CLIENTS.map((client) => (
            <ListItem
              key={client.id}
              icon={client.name.charAt(0)}
              title={client.name}
              subtitle={client.email}
              onClick={() => {
                setClient(client.id);
                setIsClientModalOpen(false);
              }}
            />
          ))}
        </ListGroup>
      </Modal>

      {/* Modal de Selección de Proyecto */}
      <Modal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        title="Seleccionar Proyecto"
      >
        <div className="p-4 pt-0">
          <button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all font-semibold text-sm"
          >
            <Plus className="w-4 h-4" /> Crear Nuevo Proyecto
          </button>
        </div>
        
        {clientProjects.length > 0 ? (
          <ListGroup>
            {clientProjects.map((project) => (
              <ListItem
                key={project.id}
                icon={<Briefcase className="w-5 h-5" />}
                title={project.name}
                subtitle={project.status}
                onClick={() => {
                  setProject(project.id);
                  setIsProjectModalOpen(false);
                }}
              />
            ))}
          </ListGroup>
        ) : (
          <div className="py-8 text-center text-on-surface-variant text-sm">
            No hay proyectos para este cliente.
          </div>
        )}
      </Modal>

      {/* Modal de Nuevo Proyecto */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="Nuevo Proyecto"
      >
        <div className="p-1">
          <ProjectForm 
            initialClientId={clientId || ""} 
            hideClientSelection={!!clientId}
            onSuccess={handleNewProjectSuccess} 
          />
        </div>
      </Modal>

      {/* Modal de Nuevo Cliente */}
      <Modal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        title="Nuevo Cliente"
      >
        <div className="p-1">
          <ClientForm 
            onSuccess={handleNewClientSuccess} 
          />
        </div>
      </Modal>

      {/* Modal de Selección de Trabajo */}
      <Modal 
        isOpen={isWorkModalOpen} 
        onClose={() => setIsWorkModalOpen(false)} 
        title="Seleccionar Trabajo"
      >
        <div className="p-4 pt-0">
          <button 
            onClick={() => setIsNewWorkModalOpen(true)}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all font-semibold text-sm"
          >
            <Plus className="w-4 h-4" /> Crear Nuevo Trabajo
          </button>
        </div>

        {projectWorks.length > 0 ? (
          <ListGroup>
            {projectWorks.map((work) => (
              <ListItem
                key={work.id}
                icon={<Hammer className="w-5 h-5" />}
                title={work.name}
                subtitle={work.status}
                onClick={() => {
                  setWork(work.id);
                  setIsWorkModalOpen(false);
                }}
              />
            ))}
          </ListGroup>
        ) : (
          <div className="py-8 text-center text-on-surface-variant">
            No hay trabajos registrados para este proyecto.
          </div>
        )}
      </Modal>

      {/* Modal de Nuevo Trabajo */}
      <Modal
        isOpen={isNewWorkModalOpen}
        onClose={() => setIsNewWorkModalOpen(false)}
        title="Nuevo Trabajo"
      >
        <div className="p-1">
          <WorkForm 
            initialProjectId={projectId || ""} 
            hideProjectSelection={!!projectId}
            onSuccess={handleNewWorkSuccess} 
          />
        </div>
      </Modal>
    </section>
  );
}
