"use client";

import { useState } from "react";
import { Search, Plus, Phone, MapPin, ArrowLeft, User, ExternalLink, Pencil, Trash2, DollarSign, Briefcase, TrendingUp } from "lucide-react";
import { mockClients, getJobsForClient, formatCurrency, formatDate, getStatusColor } from "../data/fixtures";
import { Client } from "@/types";

export function VariantD() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = mockClients.filter(
    (c) => c.nombre.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = mockClients.find((c) => c.id === selectedId);

  const totalRevenue = mockClients.reduce((a, c) => a + getJobsForClient(c.id).reduce((b, j) => b + j.presupuesto, 0), 0);
  const totalJobs = mockClients.reduce((a, c) => a + getJobsForClient(c.id).length, 0);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* HEADER with inline stats */}
      <div className="px-4 py-3 bg-surface border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-sm font-bold text-on-surface tracking-tight">Clientes</h1>
          <button className="h-7 px-2.5 rounded-lg bg-primary text-white text-[10px] font-semibold flex items-center gap-1 hover:bg-primary-dark transition-colors cursor-pointer">
            <Plus className="w-3 h-3" strokeWidth={2.5} /> Nuevo
          </button>
        </div>
        <div className="flex gap-2 mb-2.5">
          <StatPill icon={<User className="w-3 h-3" />} value={mockClients.length} label="clientes" />
          <StatPill icon={<Briefcase className="w-3 h-3" />} value={totalJobs} label="trabajos" />
          <StatPill icon={<DollarSign className="w-3 h-3" />} value={formatCurrency(totalRevenue)} label="total" />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline pointer-events-none" strokeWidth={2} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-grouped-bg-light rounded-md pl-8 pr-2.5 py-1.5 text-[11px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 border-0"
          />
        </div>
      </div>

      {/* MASTER-DETAIL GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] min-h-0">
        {/* LIST PANE */}
        <div className={`${selectedId ? "hidden md:flex" : "flex"} flex-col border-r border-outline-variant/10 bg-surface`}>
          <div className="flex-1 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((client) => {
                const isSelected = selectedId === client.id;
                const jobs = getJobsForClient(client.id);
                const total = jobs.reduce((a, j) => a + j.presupuesto, 0);
                const activos = jobs.filter((j) => j.estado === "en_curso").length;
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedId(client.id)}
                    className={`w-full text-left px-3 py-2.5 border-b border-outline-variant/5 transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/8" : "hover:bg-primary/3"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isSelected ? "bg-primary/15 text-primary" : "bg-primary/8 text-primary/60"
                      }`}>
                        {client.nombre.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[12px] text-on-surface truncate">{client.nombre}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] text-on-surface-variant">{client.email}</span>
                          {activos > 0 && (
                            <span className="text-[8px] px-1 py-0.5 rounded bg-accent-dark/15 text-accent-dark font-bold">{activos}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-bold text-primary">{formatCurrency(total)}</div>
                        <div className="text-[8px] text-on-surface-variant">{jobs.length} trabajo{jobs.length !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-on-surface-variant">
                <p className="text-[10px]">Sin resultados</p>
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

function StatPill({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-grouped-bg-light rounded-md px-2 py-1 border border-outline-variant/6">
      <span className="text-on-surface-variant">{icon}</span>
      <span className="text-[10px] font-bold text-on-surface">{value}</span>
      <span className="text-[8px] text-on-surface-variant">{label}</span>
    </div>
  );
}

function DetailPane({ client, onBack }: { client: Client; onBack: () => void }) {
  const jobs = getJobsForClient(client.id);
  const total = jobs.reduce((a, j) => a + j.presupuesto, 0);
  const completados = jobs.filter((j) => j.estado === "cobrado" || j.estado === "facturado").length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="md:hidden px-3 py-2 border-b border-outline-variant/8 bg-surface">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[10px] text-primary font-medium cursor-pointer">
          <ArrowLeft className="w-3 h-3" /> Volver
        </button>
      </div>

      <div className="px-4 py-3 bg-surface border-b border-outline-variant/8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center text-primary font-bold text-[11px]">
            {client.nombre.charAt(0)}
          </div>
          <div>
            <h2 className="text-[12px] font-bold text-on-surface">{client.nombre}</h2>
            <p className="text-[9px] text-on-surface-variant">{client.email || "—"}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="h-6 px-2 rounded text-[9px] font-semibold border border-outline-variant/15 text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
            <Pencil className="w-2.5 h-2.5 inline mr-0.5" /> Editar
          </button>
          <button className="h-6 px-2 rounded text-[9px] font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
            <Trash2 className="w-2.5 h-2.5 inline mr-0.5" /> Eliminar
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-surface rounded-lg p-2 border border-outline-variant/6 text-center">
            <p className="text-[7px] font-bold text-on-surface-variant uppercase tracking-wider">Trabajos</p>
            <p className="text-sm font-bold text-on-surface">{jobs.length}</p>
          </div>
          <div className="bg-surface rounded-lg p-2 border border-outline-variant/6 text-center">
            <p className="text-[7px] font-bold text-on-surface-variant uppercase tracking-wider">Completados</p>
            <p className="text-sm font-bold text-success">{completados}</p>
          </div>
          <div className="bg-surface rounded-lg p-2 border border-outline-variant/6 text-center">
            <p className="text-[7px] font-bold text-on-surface-variant uppercase tracking-wider">Facturación</p>
            <p className="text-sm font-bold text-primary">{formatCurrency(total)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center gap-1.5 text-[10px] bg-surface rounded-lg p-2 border border-outline-variant/6">
            <Phone className="w-3 h-3 text-on-surface-variant shrink-0" />
            <span className="text-on-surface truncate">{client.telefono || "—"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] bg-surface rounded-lg p-2 border border-outline-variant/6">
            <MapPin className="w-3 h-3 text-on-surface-variant shrink-0" />
            <span className="text-on-surface truncate">{client.direccion || "—"}</span>
          </div>
        </div>

        <div>
          <h3 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Trabajos</h3>
          {jobs.length > 0 ? (
            <div className="space-y-1">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-2 p-2 bg-surface border border-outline-variant/6 rounded-lg hover:border-primary/20 transition-all group cursor-pointer">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-on-surface group-hover:text-primary transition-colors">{job.titulo}</p>
                    <p className="text-[8px] text-on-surface-variant capitalize">{job.estado.replace(/_/g, " ")}</p>
                  </div>
                  <p className="text-[10px] font-bold text-on-surface font-[tabular-nums]">{formatCurrency(job.presupuesto)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[9px] text-on-surface-variant py-2 text-center bg-surface rounded border border-dashed border-outline-variant/20">Sin trabajos</p>
          )}
        </div>

        <p className="text-[8px] text-outline">Desde {formatDate(client.created_at)}</p>
      </div>
    </div>
  );
}
