"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ClientRow, type Client } from "./client-row";
import { ClientSearch } from "./client-search";
import { ListGroup } from "@/components/ui/list-group";

// TODO: Replace with real data from hook
const CLIENTS: Client[] = [
  { id: 1, name: "Aperture Science", category: "Portal Tech & Research", status: "Activo" },
  { id: 2, name: "Oscorp Industries", category: "Genetics & Applied Science", status: "Pendiente" },
  { id: 3, name: "Stark Industries", category: "Defense & Clean Energy", status: "Activo" },
  { id: 4, name: "Wayne Enterprises", category: "Global Conglomerate", status: "Activo" },
  { id: 5, name: "Acme Corp", category: "Anvils & Explosives", status: "Inactivo" },
];

export function ClientList() {
  const [search, setSearch] = useState("");

  const filtered = CLIENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <ClientSearch value={search} onChange={setSearch} />

      <section>
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Todos los clientes
          </h3>
          <span className="text-xs text-on-surface-variant">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <ListGroup>
          {filtered.length > 0 ? (
            filtered.map((client) => <ClientRow key={client.id} client={client} />)
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
