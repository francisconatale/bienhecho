"use client";

import { useState } from "react";
import { Search, Plus, Phone, MapPin, ArrowLeft, User, ExternalLink, Pencil, Trash2, X } from "lucide-react";
import { mockClients, getJobsForClient, formatCurrency, formatDate, getStatusColor } from "../data/fixtures";
import { Client } from "@/types";

export function VariantE() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = mockClients.filter(
    (c) => c.nombre.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = mockClients.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* HEADER - Ultra compact */}
      <div className="px-3 py-2 bg-surface border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-outline pointer-events-none" strokeWidth={2.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar..."
              className="w-full bg-grouped-bg-light rounded pl-6 pr-2 py-1 text-[10px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 border-0"
            />
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setSelectedId(null); }}
            className={`h-6 w-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
              showForm ? "bg-outline-variant/15 text-on-surface" : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* MASTER-DETAIL GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-0">
        {/* LIST PANE - Ultra dense */}
        <div className={`${selectedId && !showForm ? "hidden md:flex" : "flex"} flex-col border-r border-outline-variant/10 bg-surface`}>
          <div className="flex-1 overflow-y-auto">
            {showForm ? (
              <CompactForm onClose={() => setShowForm(false)} />
            ) : filtered.length > 0 ? (
              filtered.map((client) => {
                const isSelected = selectedId === client.id;
                const jobs = getJobsForClient(client.id);
                const total = jobs.reduce((a, j) => a + j.presupuesto, 0);
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedId(client.id)}
                    className={`w-full text-left px-3 py-2 border-b border-outline-variant/4 transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/8" : "hover:bg-primary/3"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[9px] shrink-0 ${
                        isSelected ? "bg-primary/15 text-primary" : "bg-primary/8 text-primary/60"
                      }`}>
                        {client.nombre.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[11px] text-on-surface truncate">{client.nombre}</div>
                        <div className="text-[9px] text-on-surface-variant truncate">{client.email}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[9px] font-bold text-primary">{jobs.length}</div>
                        <div className="text-[8px] text-on-surface-variant">{formatCurrency(total)}</div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-on-surface-variant">
                <p className="text-[9px]">Sin resultados</p>
              </div>
            )}
          </div>
          {!showForm && (
            <div className="px-3 py-1 border-t border-outline-variant/6 text-[8px] text-outline font-medium">
              {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* DETAIL PANE */}
        <div className={`${selectedId || showForm ? "flex" : "hidden md:flex"} flex-col bg-grouped-bg-light min-w-0`}>
          {showForm ? (
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 py-2 border-b border-outline-variant/8 bg-surface flex items-center gap-2">
                <button onClick={() => setShowForm(false)} className="w-6 h-6 rounded hover:bg-outline-variant/10 flex items-center justify-center transition-colors cursor-pointer">
                  <ArrowLeft className="w-3 h-3 text-on-surface-variant" />
                </button>
                <h2 className="text-[11px] font-bold text-on-surface">Nuevo Cliente</h2>
              </div>
              <div className="p-3">
                <CompactForm onClose={() => setShowForm(false)} />
              </div>
            </div>
          ) : selected ? (
            <DetailPane client={selected} onBack={() => setSelectedId(null)} />
          ) : (
            <div className="flex-1 flex items-start justify-center pt-12 text-on-surface-variant">
              <div className="text-center">
                <User className="w-5 h-5 mx-auto mb-1 opacity-15" />
                <p className="text-[9px]">Seleccioná un cliente</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompactForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-3 space-y-2.5">
      <div>
        <label className="block text-[8px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Nombre *</label>
        <input type="text" placeholder="Nombre o empresa" className="w-full bg-grouped-bg-light border border-outline-variant/10 rounded px-2 py-1.5 text-[10px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20" />
      </div>
      <div>
        <label className="block text-[8px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Email</label>
        <input type="email" placeholder="email@ejemplo.com" className="w-full bg-grouped-bg-light border border-outline-variant/10 rounded px-2 py-1.5 text-[10px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div>
          <label className="block text-[8px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Teléfono</label>
          <input type="tel" placeholder="11-..." className="w-full bg-grouped-bg-light border border-outline-variant/10 rounded px-2 py-1.5 text-[10px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20" />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Dirección</label>
          <input type="text" placeholder="Av. ..." className="w-full bg-grouped-bg-light border border-outline-variant/10 rounded px-2 py-1.5 text-[10px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20" />
        </div>
      </div>
      <div className="flex gap-1.5 pt-0.5">
        <button onClick={onClose} className="flex-1 h-7 rounded text-[9px] font-semibold text-on-surface-variant hover:bg-outline-variant/10 transition-colors cursor-pointer">
          Cancelar
        </button>
        <button className="flex-1 h-7 rounded bg-primary text-white text-[9px] font-semibold hover:bg-primary-dark transition-colors cursor-pointer">
          Guardar
        </button>
      </div>
    </div>
  );
}

function DetailPane({ client, onBack }: { client: Client; onBack: () => void }) {
  const jobs = getJobsForClient(client.id);
  const total = jobs.reduce((a, j) => a + j.presupuesto, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="md:hidden px-3 py-1.5 border-b border-outline-variant/8 bg-surface">
        <button onClick={onBack} className="flex items-center gap-1 text-[9px] text-primary font-medium cursor-pointer">
          <ArrowLeft className="w-2.5 h-2.5" /> Volver
        </button>
      </div>

      <div className="px-3 py-2 bg-surface border-b border-outline-variant/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary/12 flex items-center justify-center text-primary font-bold text-[9px]">
            {client.nombre.charAt(0)}
          </div>
          <div>
            <h2 className="text-[11px] font-semibold text-on-surface">{client.nombre}</h2>
            <p className="text-[8px] text-on-surface-variant">{client.email || "—"}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          <button className="h-5 px-1.5 rounded text-[8px] font-medium text-on-surface-variant hover:bg-grouped-bg-light transition-colors cursor-pointer">
            <Pencil className="w-2 h-2 inline mr-0.5" /> Editar
          </button>
          <button className="h-5 px-1.5 rounded text-[8px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
            <Trash2 className="w-2 h-2 inline mr-0.5" /> Elim
          </button>
        </div>
      </div>

      <div className="p-2.5 space-y-2.5">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-surface rounded p-1.5 border border-outline-variant/6">
            <p className="text-[7px] font-bold text-on-surface-variant uppercase tracking-wider">Tel</p>
            <p className="text-[9px] font-medium text-on-surface">{client.telefono || "—"}</p>
          </div>
          <div className="bg-surface rounded p-1.5 border border-outline-variant/6">
            <p className="text-[7px] font-bold text-on-surface-variant uppercase tracking-wider">Dir</p>
            <p className="text-[9px] font-medium text-on-surface truncate">{client.direccion || "—"}</p>
          </div>
          <div className="bg-surface rounded p-1.5 border border-outline-variant/6">
            <p className="text-[7px] font-bold text-on-surface-variant uppercase tracking-wider">Trab</p>
            <p className="text-[9px] font-medium text-on-surface">{jobs.length}</p>
          </div>
          <div className="bg-surface rounded p-1.5 border border-outline-variant/6">
            <p className="text-[7px] font-bold text-on-surface-variant uppercase tracking-wider">Fact</p>
            <p className="text-[9px] font-semibold text-primary">{formatCurrency(total)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Trabajos</h3>
          {jobs.length > 0 ? (
            <div className="space-y-0.5">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-1.5 p-1.5 bg-surface border border-outline-variant/6 rounded hover:border-primary/20 transition-all group cursor-pointer">
                  <div className={`w-1 h-1 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-medium text-on-surface group-hover:text-primary transition-colors truncate">{job.titulo}</p>
                  </div>
                  <p className="text-[9px] font-semibold text-on-surface font-[tabular-nums]">{formatCurrency(job.presupuesto)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[8px] text-on-surface-variant py-1.5 text-center bg-surface rounded border border-dashed border-outline-variant/20">Sin trabajos</p>
          )}
        </div>

        <p className="text-[7px] text-outline">Desde {formatDate(client.created_at)}</p>
      </div>
    </div>
  );
}
