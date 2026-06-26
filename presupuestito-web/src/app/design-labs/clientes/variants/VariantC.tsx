"use client";

import { useState } from "react";
import { Search, Plus, Phone, MapPin, ArrowLeft, User, ExternalLink, Pencil, Trash2, ChevronRight } from "lucide-react";
import { mockClients, getJobsForClient, formatCurrency, formatDate, getStatusColor } from "../data/fixtures";
import { Client } from "@/types";

export function VariantC() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = mockClients.filter(
    (c) => c.nombre.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = mockClients.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* HEADER */}
      <div className="px-4 py-3 bg-surface border-b border-outline-variant/10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar clientes..."
              className="w-full bg-grouped-bg-light rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 border-0"
            />
          </div>
          <button className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors cursor-pointer">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* MASTER-DETAIL GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] min-h-0">
        {/* LIST PANE */}
        <div className={`${selectedId ? "hidden md:flex" : "flex"} flex-col border-r border-outline-variant/10 bg-surface`}>
          <div className="px-4 py-2.5 border-b border-outline-variant/6">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{filtered.length} clientes</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((client) => {
                const isSelected = selectedId === client.id;
                const jobs = getJobsForClient(client.id);
                const total = jobs.reduce((a, j) => a + j.presupuesto, 0);
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedId(client.id)}
                    className={`w-full text-left px-4 py-3 border-b border-outline-variant/5 transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/8" : "hover:bg-primary/3"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isSelected ? "bg-primary/15 text-primary" : "bg-primary/8 text-primary/60"
                      }`}>
                        {client.nombre.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-on-surface truncate">{client.nombre}</div>
                        <div className="text-[11px] text-on-surface-variant truncate">{client.email}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-on-surface-variant">
                <p className="text-xs">Sin resultados</p>
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
                <User className="w-8 h-8 mx-auto mb-2 opacity-15" />
                <p className="text-xs font-medium">Seleccioná un cliente</p>
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
      <div className="md:hidden px-4 py-2.5 border-b border-outline-variant/8 bg-surface">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-primary font-medium cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver
        </button>
      </div>

      <div className="px-5 py-4 bg-surface border-b border-outline-variant/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center text-primary font-bold text-sm">
            {client.nombre.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-on-surface">{client.nombre}</h2>
            <p className="text-[11px] text-on-surface-variant">{client.email || "—"}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button className="h-7 px-2.5 rounded-lg text-[10px] font-medium text-on-surface-variant hover:bg-grouped-bg-light transition-colors cursor-pointer">
            <Pencil className="w-3 h-3 inline mr-1" /> Editar
          </button>
          <button className="h-7 px-2.5 rounded-lg text-[10px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
            <Trash2 className="w-3 h-3 inline mr-1" /> Eliminar
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2.5">
          <MiniStat label="Teléfono" value={client.telefono || "—"} />
          <MiniStat label="Dirección" value={client.direccion || "—"} />
          <MiniStat label="Trabajos" value={`${jobs.length}`} />
          <MiniStat label="Facturación" value={formatCurrency(total)} highlight />
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Trabajos</h3>
          {jobs.length > 0 ? (
            <div className="space-y-1.5">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-2.5 p-2.5 bg-surface border border-outline-variant/6 rounded-lg hover:border-primary/20 transition-all group cursor-pointer">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">{job.titulo}</p>
                    <p className="text-[10px] text-on-surface-variant capitalize">{job.estado.replace(/_/g, " ")}</p>
                  </div>
                  <p className="text-xs font-semibold text-on-surface font-[tabular-nums]">{formatCurrency(job.presupuesto)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-on-surface-variant py-3 text-center bg-surface rounded-lg border border-dashed border-outline-variant/20">Sin trabajos</p>
          )}
        </div>

        <p className="text-[9px] text-outline">Desde {formatDate(client.created_at)}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-surface rounded-lg p-3 border border-outline-variant/6">
      <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xs font-semibold ${highlight ? "text-primary" : "text-on-surface"} truncate`}>{value}</p>
    </div>
  );
}
