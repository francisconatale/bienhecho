"use client";

import { useState } from "react";
import { Search, Plus, Phone, MapPin, ArrowLeft, User, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { mockClients, getJobsForClient, formatCurrency, formatDate, getStatusColor } from "../data/fixtures";
import { Client } from "@/types";

export function VariantB() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = mockClients.filter(
    (c) => c.nombre.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = mockClients.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* HEADER - Stripe style: clean, minimal */}
      <div className="px-5 py-4 bg-surface border-b border-outline-variant/8">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-semibold text-on-surface">Clientes</h1>
          <button className="h-8 px-3.5 rounded-lg bg-primary text-white text-[11px] font-medium flex items-center gap-1.5 hover:bg-primary-dark transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Nuevo cliente
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full bg-grouped-bg-light rounded-lg pl-9 pr-3 py-2 text-[12px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border-0"
          />
        </div>
      </div>

      {/* MASTER-DETAIL GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-0">
        {/* LIST PANE - Stripe style: clean borders, subtle */}
        <div className={`${selectedId ? "hidden md:flex" : "flex"} flex-col border-r border-outline-variant/8 bg-surface`}>
          <div className="flex-1 overflow-y-auto">
            {filtered.length > 0 ? (
              <div className="divide-y divide-outline-variant/6">
                {filtered.map((client) => {
                  const isSelected = selectedId === client.id;
                  const jobs = getJobsForClient(client.id);
                  const total = jobs.reduce((a, j) => a + j.presupuesto, 0);
                  return (
                    <button
                      key={client.id}
                      onClick={() => setSelectedId(client.id)}
                      className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                        isSelected ? "bg-primary/5" : "hover:bg-grouped-bg-light"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[11px] shrink-0 ${
                          isSelected ? "bg-primary/15 text-primary" : "bg-grouped-bg-light text-on-surface-variant"
                        }`}>
                          {client.nombre.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[13px] text-on-surface truncate">{client.nombre}</div>
                          <div className="text-[11px] text-on-surface-variant truncate">{client.email}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-semibold text-on-surface">{formatCurrency(total)}</div>
                          <div className="text-[9px] text-on-surface-variant">{jobs.length} trabajo{jobs.length !== 1 ? "s" : ""}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-on-surface-variant">
                <p className="text-[11px]">No se encontraron clientes</p>
              </div>
            )}
          </div>
        </div>

        {/* DETAIL PANE */}
        <div className={`${selectedId ? "flex" : "hidden md:flex"} flex-col bg-grouped-bg-light min-w-0`}>
          {selected ? (
            <DetailPane client={selected} onBack={() => setSelectedId(null)} />
          ) : (
            <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-grouped-bg-light flex items-center justify-center mx-auto mb-2">
                  <User className="w-5 h-5 text-outline" strokeWidth={1.5} />
                </div>
                <p className="text-[12px] font-medium text-on-surface">Seleccioná un cliente</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">de la lista para ver sus detalles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailPane({ client, onBack }: { client: Client; onBack: () => void }) {
  const jobs = getJobsForClient(client.id);
  const total = jobs.reduce((a, j) => a + j.presupuesto, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="md:hidden px-4 py-3 border-b border-outline-variant/8 bg-surface">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[11px] text-primary font-medium cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver
        </button>
      </div>

      <div className="px-5 py-4 bg-surface border-b border-outline-variant/8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {client.nombre.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-on-surface">{client.nombre}</h2>
              <p className="text-[11px] text-on-surface-variant">{client.email || "—"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="h-8 px-3 rounded-lg text-[11px] font-medium text-on-surface-variant hover:bg-grouped-bg-light transition-colors cursor-pointer">
              <Pencil className="w-3.5 h-3.5 inline mr-1.5" /> Editar
            </button>
            <button className="h-8 px-3 rounded-lg text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
              <Trash2 className="w-3.5 h-3.5 inline mr-1.5" /> Eliminar
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface rounded-xl p-3.5 border border-outline-variant/8">
            <p className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Teléfono</p>
            <p className="text-[12px] font-medium text-on-surface">{client.telefono || "—"}</p>
          </div>
          <div className="bg-surface rounded-xl p-3.5 border border-outline-variant/8">
            <p className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Dirección</p>
            <p className="text-[12px] font-medium text-on-surface truncate">{client.direccion || "—"}</p>
          </div>
          <div className="bg-surface rounded-xl p-3.5 border border-outline-variant/8">
            <p className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Trabajos</p>
            <p className="text-[12px] font-medium text-on-surface">{jobs.length}</p>
          </div>
          <div className="bg-surface rounded-xl p-3.5 border border-outline-variant/8">
            <p className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Facturación</p>
            <p className="text-[12px] font-semibold text-primary">{formatCurrency(total)}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-semibold text-on-surface">Trabajos</h3>
            <span className="text-[9px] text-on-surface-variant">{jobs.length} total</span>
          </div>
          {jobs.length > 0 ? (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/8 hover:border-primary/20 transition-all group cursor-pointer">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-on-surface group-hover:text-primary transition-colors">{job.titulo}</p>
                    <p className="text-[10px] text-on-surface-variant capitalize">{job.estado.replace(/_/g, " ")}</p>
                  </div>
                  <p className="text-[12px] font-semibold text-on-surface font-[tabular-nums]">{formatCurrency(job.presupuesto)}</p>
                  <ExternalLink className="w-3.5 h-3.5 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center bg-surface rounded-xl border border-dashed border-outline-variant/20">
              <p className="text-[11px] text-on-surface-variant">Sin trabajos asignados</p>
            </div>
          )}
        </div>

        <p className="text-[10px] text-outline">Cliente desde {formatDate(client.created_at)}</p>
      </div>
    </div>
  );
}
