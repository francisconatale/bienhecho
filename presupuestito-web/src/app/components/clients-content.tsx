"use client";

import { Search, ChevronRight, PlusCircle } from "lucide-react";
import { useState } from "react";

type ClientStatus = "Activo" | "Pendiente" | "Inactivo";

interface Client {
  id: number;
  name: string;
  category: string;
  status: ClientStatus;
}

const STATUS_CONFIG: Record<
  ClientStatus,
  { label: string; classes: string }
> = {
  Activo: {
    label: "Activo",
    classes: "text-success-dark bg-success/10",
  },
  Pendiente: {
    label: "Pendiente",
    classes: "text-on-error-container bg-error-container",
  },
  Inactivo: {
    label: "Inactivo",
    classes: "text-on-surface-variant bg-surface-container-highest",
  },
};

interface ClientRowProps {
  client: Client;
}

function ClientRow({ client }: ClientRowProps) {
  const status = STATUS_CONFIG[client.status];
  return (
    <button
      className="w-full flex items-center gap-3 px-4 py-3 border-b border-outline-variant/10 last:border-0 hover:bg-surface-variant/30 transition-colors cursor-pointer text-left group"
      aria-label={`Ver cliente ${client.name}`}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
        {client.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-on-surface truncate">{client.name}</h4>
        <p className="text-xs text-on-surface-variant truncate">{client.category}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${status.classes}`}
        >
          {status.label}
        </span>
        <ChevronRight
          className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors"
          strokeWidth={2.5}
        />
      </div>
    </button>
  );
}

const CLIENTS: Client[] = [
  { id: 1, name: "Aperture Science", category: "Portal Tech & Research", status: "Activo" },
  { id: 2, name: "Oscorp Industries", category: "Genetics & Applied Science", status: "Pendiente" },
  { id: 3, name: "Stark Industries", category: "Defense & Clean Energy", status: "Activo" },
  { id: 4, name: "Wayne Enterprises", category: "Global Conglomerate", status: "Activo" },
  { id: 5, name: "Acme Corp", category: "Anvils & Explosives", status: "Inactivo" },
];

export function ClientsContent() {
  const [search, setSearch] = useState("");

  const filtered = CLIENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search Bar */}
      <div className="relative w-full">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant pointer-events-none"
          strokeWidth={2}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar clientes..."
          className="w-full bg-surface rounded-2xl border border-outline-variant/30 shadow-sm pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Client List */}
      <section>
        <div className="flex items-center justify-between px-2 mb-3">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Todos los clientes
          </h3>
          <span className="text-xs text-on-surface-variant">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          {filtered.length > 0 ? (
            filtered.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <Search className="w-10 h-10 mb-3 opacity-30" strokeWidth={1.5} />
              <p className="text-sm font-medium">Sin resultados</p>
              <p className="text-xs opacity-60 mt-1">Probá con otro término</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
