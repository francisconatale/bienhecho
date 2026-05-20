"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ProjectRow } from "./project-row";
import { ProjectSearch } from "./project-search";
import { ListGroup } from "@/components/ui/list-group";
import { MOCK_PROJECTS, MOCK_CLIENTS } from "@/mocks";

export function ProjectList() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_PROJECTS.filter((p) => {
    const client = MOCK_CLIENTS.find(c => c.id === p.clientId);
    const clientName = client ? client.name.toLowerCase() : "";
    return p.name.toLowerCase().includes(search.toLowerCase()) || clientName.includes(search.toLowerCase());
  });

  return (
    <>
      <ProjectSearch value={search} onChange={setSearch} />

      <section>
        <div className="flex items-center justify-between px-2 mb-3">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Todos los proyectos
          </h3>
          <span className="text-xs text-on-surface-variant">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <ListGroup>
          {filtered.length > 0 ? (
            filtered.map((project) => (
              <ProjectRow key={project.id} project={project} clientName={MOCK_CLIENTS.find(c => c.id === project.clientId)?.name || "Cliente Desconocido"} />
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
    </>
  );
}
