"use client";

import { useState } from "react";
import { Search, Plus, Phone, MapPin, ArrowLeft, User, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { mockClients, getJobsForClient, formatCurrency, formatDate, getStatusColor } from "../data/fixtures";
import { Client } from "@/types";

export function VariantA() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = mockClients.filter(
    (c) => c.nombre.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = mockClients.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* HEADER - usando patrón MASTER.md */}
      <div className="px-4 py-3 md:px-6 md:py-4 bg-surface border-b border-outline-variant/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-on-surface tracking-tight">Clientes</h1>
            <p className="text-[11px] text-on-surface-variant">{filtered.length} registros</p>
          </div>
          <button className="h-8 px-3 rounded-xl bg-primary text-white text-[11px] font-semibold flex items-center gap-1.5 hover:bg-primary-dark transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Nuevo
          </button>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline pointer-events-none" strokeWidth={2} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar clientes..."
            className="w-full bg-grouped-bg-light rounded-lg pl-8 pr-2.5 py-1.5 text-[11px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 border border-outline-variant/10"
          />
        </div>
      </div>

      {/* MASTER-DETAIL GRID - MASTER.md §2.3 */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] min-h-0">
        {/* LIST PANE */}
        <div className={`${selectedId ? "hidden md:flex" : "flex"} flex-col border-r border-outline-variant/10 bg-surface`}>
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
                    className={`w-full text-left px-4 py-3 border-b border-outline-variant/6 transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/8" : "hover:bg-primary/3"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isSelected ? "bg-primary/15 text-primary" : "bg-primary/8 text-primary/70"
                      }`}>
                        {client.nombre.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] text-on-surface truncate">{client.nombre}</div>
                        <div className="text-[11px] text-on-surface-variant truncate">{client.email}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-bold text-primary">{jobs.length}</div>
                        <div className="text-[9px] text-on-surface-variant font-[tabular-nums]">{formatCurrency(total)}</div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-on-surface-variant">
                <Search className="w-5 h-5 mx-auto mb-1.5 opacity-30" />
                <p className="text-[11px] font-medium">Sin resultados</p>
              </div>
            )}
          </div>
          <div className="px-4 py-1.5 border-t border-outline-variant/6 text-[9px] text-outline font-medium">
            {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* DETAIL PANE */}
        <div className={`${selectedId ? "flex" : "hidden md:flex"} flex-col bg-grouped-bg-light min-w-0`}>
          {selected ? (
            <DetailPane client={selected} onBack={() => setSelectedId(null)} />
          ) : (
            <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant">
              <div className="text-center">
                <User className="w-7 h-7 mx-auto mb-1.5 opacity-15" />
                <p className="text-[11px] font-medium">Seleccioná un cliente</p>
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
      <div className="md:hidden px-3 py-2 border-b border-outline-variant/8 bg-surface">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[11px] text-primary font-medium cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver
        </button>
      </div>

      <div className="px-4 py-3 md:px-5 md:py-4 bg-surface border-b border-outline-variant/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center text-primary font-bold text-sm">
            {client.nombre.charAt(0)}
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-on-surface">{client.nombre}</h2>
            <p className="text-[10px] text-on-surface-variant">{client.email || "—"}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button className="h-7 px-2.5 rounded-lg border border-outline-variant/15 text-[10px] font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
            <Pencil className="w-3 h-3 inline mr-1" /> Editar
          </button>
          <button className="h-7 px-2.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-semibold hover:bg-red-100 transition-colors cursor-pointer">
            <Trash2 className="w-3 h-3 inline mr-1" /> Eliminar
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <InfoCard label="Teléfono" value={client.telefono || "—"} icon={<Phone className="w-3 h-3" />} />
          <InfoCard label="Dirección" value={client.direccion || "—"} icon={<MapPin className="w-3 h-3" />} />
          <InfoCard label="Trabajos" value={`${jobs.length}`} icon={<ExternalLink className="w-3 h-3" />} />
          <InfoCard label="Facturación" value={formatCurrency(total)} icon={<span className="text-[10px]">$</span>} />
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Trabajos</h3>
          {jobs.length > 0 ? (
            <div className="space-y-1.5">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-2.5 p-2.5 bg-surface border border-outline-variant/8 rounded-lg hover:border-primary/20 transition-all group cursor-pointer">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-on-surface group-hover:text-primary transition-colors">{job.titulo}</p>
                    <p className="text-[9px] text-on-surface-variant capitalize">{job.estado.replace(/_/g, " ")}</p>
                  </div>
                  <p className="text-[11px] font-bold text-on-surface font-[tabular-nums]">{formatCurrency(job.presupuesto)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-on-surface-variant py-3 text-center bg-surface rounded-lg border border-dashed border-outline-variant/20">Sin trabajos</p>
          )}
        </div>

        <p className="text-[9px] text-outline">Cliente desde {formatDate(client.created_at)}</p>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-grouped-bg-light rounded-lg p-2.5 border border-outline-variant/8">
      <div className="flex items-center gap-1 mb-0.5 text-on-surface-variant">{icon}<span className="text-[8px] font-bold uppercase tracking-wider">{label}</span></div>
      <p className="text-[11px] font-semibold text-on-surface truncate">{value}</p>
    </div>
  );
}
