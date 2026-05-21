"use client";

import { Briefcase, ChevronDown, ChevronUp, Plus, Search } from "lucide-react";
import { ListItem } from "@/components/ui/list-item";
import { useBudgetIdentity } from "../../hooks/use-budget-identity";

export function ProjectSelector() {
  const {
    clientId,
    selectedProject,
    isProjectListOpen,
    projectSearch,
    filteredProjects,
    setProjectSearch,
    handleToggleProjects,
    handleSelectProject,
    openNewProjectModal,
  } = useBudgetIdentity();

  if (!clientId) return null;

  return (
    <div className="flex flex-col border-t border-outline-variant/10">
      <ListItem
        icon={<Briefcase className="w-5 h-5 text-blue-500" />}
        title={selectedProject ? selectedProject.name : "Vincular a Campaña"}
        subtitle={selectedProject ? selectedProject.status : "Opcional"}
        onClick={handleToggleProjects}
        className="!py-5"
        showChevron={false}
        trailing={
          isProjectListOpen ? (
            <ChevronUp className="w-5 h-5 text-primary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-on-surface-variant/40" />
          )
        }
      />
      
      {isProjectListOpen && (
        <div className="px-5 pt-2 pb-5 space-y-4 bg-surface-variant/5 border-t border-outline-variant/5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
            <input
              type="text"
              placeholder="Buscar campaña..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="w-full bg-surface-variant/10 border-none rounded-lg pl-9 pr-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredProjects.map((project) => (
              <ListItem
                key={project.id}
                icon={<Briefcase className="w-4 h-4" />}
                title={project.name}
                subtitle={project.status}
                onClick={() => handleSelectProject(project.id)}
                className="!rounded-lg !py-2 !border-none !px-0"
                showChevron={false}
              />
            ))}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                openNewProjectModal();
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 border border-dashed border-blue-500/30 rounded-xl text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500/5 transition-all active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={3} />
              Crear Nueva Campaña
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
