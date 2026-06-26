"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  ArrowLeft,
  User,
  Pencil,
  Trash2,
  Briefcase,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { ClientForm } from "./client-form";
import { useClientForm } from "./use-client-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

function getStatusColor(estado: string): string {
  switch (estado) {
    case "cobrado":
    case "facturado":
      return "bg-success";
    case "en_curso":
      return "bg-accent-dark";
    case "listo_para_facturar":
      return "bg-primary";
    default:
      return "bg-outline";
  }
}

function DetailPane({
  client,
  onDelete,
  onBack,
}: {
  client: Client;
  onDelete: (c: Client) => void;
  onBack: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { jobs } = useDataStore();
  const clientJobs = jobs.filter((j) => j.cliente_id === client.id);
  const total = clientJobs.reduce((a, j) => a + j.presupuesto, 0);

  const handleSuccess = () => setIsEditing(false);
  const { form, onSubmit, isLoading } = useClientForm(client, handleSuccess);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="md:hidden px-4 py-2.5 border-b border-outline-variant/8 bg-surface">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-primary font-medium cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="px-5 py-4 bg-surface border-b border-outline-variant/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/12 flex items-center justify-center text-primary font-bold text-sm md:text-base shrink-0">
              {client.nombre.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    {...register("nombre")}
                    className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-lg px-3 py-1.5 text-sm md:text-lg font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  {errors.nombre && <p className="text-xs text-error">{errors.nombre.message}</p>}
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="cliente@ejemplo.com"
                    className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-lg px-3 py-1.5 text-[11px] md:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
                </div>
              ) : (
                <>
                  <h2 className="text-sm md:text-lg font-semibold text-on-surface truncate">{client.nombre}</h2>
                  <p className="text-[11px] md:text-sm text-on-surface-variant truncate">{client.email || "—"}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="h-7 md:h-9 px-2.5 md:px-3.5 rounded-lg text-[10px] md:text-xs font-medium text-on-surface-variant hover:bg-outline-variant/10 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-7 md:h-9 px-2.5 md:px-3.5 rounded-lg text-[10px] md:text-xs font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="h-7 md:h-9 px-2.5 md:px-3.5 rounded-lg text-[10px] md:text-xs font-medium text-on-surface-variant hover:bg-grouped-bg-light transition-colors cursor-pointer"
                >
                  <Pencil className="w-3 h-3 md:w-4 md:h-4 inline mr-1" /> Editar
                </button>
                <button
                  onClick={() => onDelete(client)}
                  className="h-7 md:h-9 px-2.5 md:px-3.5 rounded-lg text-[10px] md:text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4 inline mr-1" /> Eliminar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-5">
          <div className="grid grid-cols-2 gap-2.5 md:gap-4">
            <div className="bg-surface rounded-lg p-3 md:p-4 border border-outline-variant/6">
              <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Telefono</p>
              {isEditing ? (
                <input
                  type="tel"
                  {...register("telefono")}
                  placeholder="+54 11..."
                  className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-lg px-3 py-1.5 text-xs md:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              ) : (
                <p className="text-xs md:text-sm font-semibold text-on-surface">{client.telefono || "—"}</p>
              )}
            </div>
            <div className="bg-surface rounded-lg p-3 md:p-4 border border-outline-variant/6">
              <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Direccion</p>
              {isEditing ? (
                <input
                  type="text"
                  {...register("direccion")}
                  placeholder="Av. Corrientes 1234"
                  className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-lg px-3 py-1.5 text-xs md:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              ) : (
                <p className="text-xs md:text-sm font-semibold text-on-surface truncate">{client.direccion || "—"}</p>
              )}
            </div>
            <div className="bg-surface rounded-lg p-3 md:p-4 border border-outline-variant/6">
              <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Trabajos</p>
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm font-semibold text-on-surface">{clientJobs.length}</p>
                <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-primary/60" />
              </div>
            </div>
            <div className="bg-surface rounded-lg p-3 md:p-4 border border-outline-variant/6">
              <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Facturacion</p>
              <p className="text-xs md:text-sm font-semibold text-primary">{formatCurrency(total)}</p>
            </div>
          </div>

          {clientJobs.length > 0 && (
            <div className="space-y-1.5 md:space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-wider">Trabajos</h3>
                <Link
                  href={`/trabajos/nuevo?clienteId=${client.id}`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] md:text-xs font-semibold text-primary hover:bg-primary/8 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                  Nuevo
                </Link>
              </div>
              {clientJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/trabajos/${job.id}?from=clientes&clienteId=${client.id}`}
                  className="flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3.5 bg-surface border border-outline-variant/6 rounded-lg hover:border-primary/20 transition-all group cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{job.titulo}</p>
                    <p className="text-[10px] md:text-xs text-on-surface-variant capitalize">{job.estado.replace(/_/g, " ")}</p>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-on-surface font-[tabular-nums]">{formatCurrency(job.presupuesto)}</p>
                  <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          )}

          <p className="text-[9px] md:text-xs text-outline">
            Cliente desde {new Date(client.created_at).toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
          </p>
        </div>
      </form>
    </div>
  );
}

export function ClientList() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => searchParams.get("clienteId") || null
  );
  const [showCreationForm, setShowCreationForm] = useState(false);
  const { clients, removeClient } = useDataStore();

  const filtered = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      false
  );

  const selected = clients.find((c) => c.id === selectedId) || null;

  const handleDelete = (client: Client) => {
    if (window.confirm(`Estas seguro de que queres eliminar a ${client.nombre}?`)) {
      removeClient(client.id);
      if (selectedId === client.id) setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* HEADER */}
      <div className="px-4 md:px-5 py-3 bg-surface border-b border-outline-variant/10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-outline pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar clientes..."
              className="w-full bg-grouped-bg-light rounded-lg pl-9 md:pl-10 pr-3 py-2 md:py-2.5 text-xs md:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 border-0"
            />
          </div>
          <button
            onClick={() => {
              setShowCreationForm(!showCreationForm);
              setSelectedId(null);
            }}
            className={`h-8 w-8 md:h-9 md:w-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              showCreationForm
                ? "bg-outline-variant/15 text-on-surface"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {showCreationForm ? (
              <span className="text-lg md:text-xl leading-none">&times;</span>
            ) : (
              <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* MASTER-DETAIL GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[360px_1fr] min-h-0">
        {/* LIST PANE */}
        <div
          className={`${
            selectedId && !showCreationForm ? "hidden md:flex" : "flex"
          } flex-col border-r border-outline-variant/10 bg-surface`}
        >
          <div className="px-4 md:px-5 py-2.5 md:py-3 border-b border-outline-variant/6">
            <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((client) => {
                const isSelected = selectedId === client.id;
                const clientJobs = useDataStore.getState().jobs.filter((j) => j.cliente_id === client.id);
                const totalFacturacion = clientJobs.reduce((acc, j) => acc + j.presupuesto, 0);
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedId(client.id)}
                    className={`w-full text-left px-4 md:px-5 py-3 md:py-4 border-b border-outline-variant/5 transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/8" : "hover:bg-primary/3"
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-[11px] md:text-sm shrink-0 transition-all ${
                        isSelected ? "bg-primary/15 text-primary" : "bg-primary/8 text-primary/60"
                      }`}>
                        {client.nombre.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm md:text-base text-on-surface truncate">{client.nombre}</div>
                        <div className="text-[11px] md:text-sm text-on-surface-variant truncate">{client.email}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] md:text-sm font-bold text-primary">{clientJobs.length}</div>
                        <div className="text-[9px] md:text-xs text-on-surface-variant font-[tabular-nums]">
                          ${totalFacturacion >= 1000000
                            ? `${(totalFacturacion / 1000000).toFixed(1)}M`
                            : `${(totalFacturacion / 1000).toFixed(0)}K`}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-on-surface-variant">
                <p className="text-xs md:text-sm">Sin resultados</p>
              </div>
            )}
          </div>
        </div>

        {/* DETAIL PANE */}
        <div
          className={`${
            selectedId || showCreationForm ? "flex" : "hidden md:flex"
          } flex-col bg-grouped-bg-light min-w-0`}
        >
          {showCreationForm ? (
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-3 border-b border-outline-variant/8 bg-surface flex items-center gap-2.5">
                <button
                  onClick={() => setShowCreationForm(false)}
                  className="w-7 h-7 md:w-9 md:h-9 rounded-lg hover:bg-outline-variant/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 md:w-5 md:h-5 text-on-surface-variant" />
                </button>
                <h2 className="text-sm md:text-lg font-bold text-on-surface">Nuevo Cliente</h2>
              </div>
              <div className="p-4 md:p-6">
                <ClientForm onSuccess={() => setShowCreationForm(false)} />
              </div>
            </div>
          ) : selected ? (
            <DetailPane
              client={selected}
              onDelete={handleDelete}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant">
              <div className="text-center">
                <User className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-15" />
                <p className="text-xs md:text-base font-medium">Seleccioná un cliente</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
