"use client";

import { useState } from "react";
import { Search, PlusCircle, X } from "lucide-react";
import { ProjectRow } from "./project-row";
import { ProjectSearch } from "./project-search";
import { ListGroup } from "@/components/ui/list-group";
import { useDataStore } from "@/lib/store";
import { ProjectForm } from "../nuevo/components/project-form";

export function ProjectList() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { projects, clients } = useDataStore();

  const filtered = projects.filter((p) => {
    const client = clients.find(c => c.id === p.clientId);
    const clientName = client ? client.name.toLowerCase() : "";
    return p.name.toLowerCase().includes(search.toLowerCase()) || clientName.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 w-full">
          <ProjectSearch value={search} onChange={setSearch} />
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`h-14 px-6 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 w-full md:w-auto shadow-lg ${
            showForm 
              ? "bg-surface-variant/20 text-on-surface border border-outline-variant/10" 
              : "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700"
          }`}
        >
          {showForm ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          {showForm ? "Cancelar" : "Nuevo Proyecto"}
        </button>
      </div>

      {showForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-surface/50 backdrop-blur-xl p-1 rounded-[32px] border border-primary/20 shadow-xl overflow-hidden">
             <div className="p-2">
                <ProjectForm onSuccess={() => setShowForm(false)} />
             </div>
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            {showForm ? "Tus proyectos" : "Todos los proyectos"}
          </h3>
          <span className="text-xs text-on-surface-variant">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <ListGroup>
          {filtered.length > 0 ? (
            filtered.map((project) => (
              <ProjectRow 
                key={project.id} 
                project={project} 
                clientName={clients.find(c => c.id === project.clientId)?.name || "Cliente Desconocido"} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <Search className="w-10 h-10 mb-3 opacity-30" strokeWidth={1.5} />
              <p className="text-sm font-medium">Sin resultados</p>
              <p className="text-xs opacity-60 mt-1">Probá con otro término</p>
            </div>
          )}
        </ListGroup>
      </section>
    </div>
  );
}
