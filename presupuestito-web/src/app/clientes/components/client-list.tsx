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
import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { PageHeader } from "@/components/ui/page-header";
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
    <div className="flex-1 overflow-y-auto relative w-full min-h-screen">
      {/* Grain / Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[100] dark:opacity-[0.06]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

      {/* Aurora Background */}
      <div
        className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-1000"
        style={{
          zIndex: -1,
          WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
        }}
      >
        <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/30 md:bg-primary/20 blur-[100px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/30 md:bg-primary-container/20 blur-[120px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000" />
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/35 md:bg-primary/25 blur-[120px] md:blur-[180px] rounded-full transition-all duration-1000" />
        <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/40 md:bg-primary-container/30 blur-[120px] md:blur-[160px] rounded-full transition-all duration-1000" />
      </div>

      <div className="md:hidden px-4 py-2.5 border-b border-outline-variant/10 bg-surface/30 backdrop-blur-xl">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-primary font-medium cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="group relative overflow-hidden bg-surface/30 dark:bg-surface/10 backdrop-blur-2xl rounded-[28px] p-6 md:p-8 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary font-black text-xl md:text-2xl shrink-0 shadow-inner">
                {client.nombre.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 pt-1 cursor-default select-none">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      {...register("nombre")}
                      className="w-full bg-transparent border-b border-outline-variant/30 text-2xl md:text-3xl font-black text-on-surface tracking-tighter leading-none focus:outline-none focus:border-primary transition-all py-1"
                      placeholder="Nombre del cliente"
                      autoFocus
                    />
                    {errors.nombre && <p className="text-xs font-bold text-error mt-1">{errors.nombre.message}</p>}

                    <input
                      type="email"
                      {...register("email")}
                      placeholder="Email del cliente (opcional)"
                      className="w-full bg-transparent border-b border-outline-variant/30 text-sm font-medium text-on-surface-variant focus:outline-none focus:border-primary transition-all py-1 mt-2"
                    />
                    {errors.email && <p className="text-xs font-bold text-error mt-1">{errors.email.message}</p>}
                  </div>
                ) : (
                  <div className="group relative flex flex-col">
                    <h2 className="text-3xl font-black text-on-surface tracking-tighter truncate leading-none">{client.nombre}</h2>
                    <p className="text-sm font-medium text-on-surface-variant truncate mt-1.5">{client.email || "Sin email registrado"}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mt-1.5">
                      Cliente desde {new Date(client.created_at).toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 shrink-0 ml-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-2.5 rounded-xl bg-on-surface/5 text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 transition-all active:scale-95"
                    title="Cancelar"
                  >
                    <span className="text-xs font-bold px-1">Cancelar</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95 flex items-center gap-1.5 shadow-md"
                  >
                    <span className="text-xs font-bold px-1">{isLoading ? "Guardando..." : "Guardar"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-2.5 rounded-xl bg-on-surface/5 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all active:scale-95 group/btn"
                    title="Editar información"
                  >
                    <Pencil className="w-4 h-4 group-hover/btn:scale-110 transition-transform" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(client)}
                    className="p-2.5 rounded-xl bg-on-surface/5 text-on-surface-variant hover:text-error hover:bg-error/10 transition-all active:scale-95 group/btn"
                    title="Eliminar cliente"
                  >
                    <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 mt-6 border-t border-outline-variant/10">
            <div className="flex flex-col gap-1.5 cursor-default select-none">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50">Teléfono</span>
              {isEditing ? (
                <input
                  type="tel"
                  {...register("telefono")}
                  placeholder="+54 11..."
                  className="w-full bg-transparent border-b border-outline-variant/30 px-0 py-0.5 text-sm font-semibold text-on-surface focus:outline-none focus:border-primary transition-all placeholder:text-on-surface-variant/30"
                />
              ) : (
                <span className="text-sm font-semibold text-on-surface">{client.telefono || "—"}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 cursor-default select-none">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50">Dirección</span>
              {isEditing ? (
                <input
                  type="text"
                  {...register("direccion")}
                  placeholder="Av. Corrientes 1234"
                  className="w-full bg-transparent border-b border-outline-variant/30 px-0 py-0.5 text-sm font-semibold text-on-surface focus:outline-none focus:border-primary transition-all placeholder:text-on-surface-variant/30"
                />
              ) : (
                <span className="text-sm font-semibold text-on-surface truncate">{client.direccion || "—"}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 cursor-default select-none">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50">Trabajos</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-on-surface">{clientJobs.length}</span>
                <Briefcase className="w-3.5 h-3.5 text-primary/60" strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 cursor-default select-none">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50">Presupuestado</span>
              <span className="text-lg font-black tracking-tight text-primary leading-none mt-auto">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {clientJobs.length > 0 && (
          <div className="relative bg-surface/30 dark:bg-surface/10 backdrop-blur-2xl rounded-[28px] p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none rounded-[28px]" />

            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant/50">Trabajos del Cliente</h3>
              <Link
                href={`/trabajos/nuevo?clienteId=${client.id}`}
                className="px-3 py-1.5 rounded-[12px] text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 hover:bg-primary/20 transition-all active:scale-95 border border-primary/10"
              >
                Nuevo
              </Link>
            </div>

            <div className="relative z-10 space-y-3">
              {clientJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/trabajos/${job.id}?from=clientes&clienteId=${client.id}`}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-5 bg-surface/40 dark:bg-surface/20 rounded-[20px] border border-white/10 dark:border-white/5 transition-all duration-300 hover:bg-surface/60 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${getStatusColor(job.estado)} shadow-[0_0_12px_currentColor] opacity-80 group-hover:opacity-100 transition-opacity`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">{job.titulo}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mt-1">{job.estado.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:pl-4 md:border-l border-white/10 dark:border-white/5">
                    {job.presupuesto > 0 ? (
                      <p className="text-lg font-black tracking-tight text-on-surface">{formatCurrency(job.presupuesto)}</p>
                    ) : (
                      <p className="text-sm font-semibold text-on-surface-variant/50">S/P</p>
                    )}
                    <div className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:bg-primary/10 group-active:scale-95 shrink-0">
                      <ExternalLink className="w-5 h-5 text-on-surface-variant group-hover:text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
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

  const pag = usePagination(filtered, 10);

  const selected = clients.find((c) => c.id === selectedId) || null;

  const handleDelete = (client: Client) => {
    if (window.confirm(`Estas seguro de que queres eliminar a ${client.nombre}?`)) {
      removeClient(client.id);
      if (selectedId === client.id) setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* Mobile PageHeader */}
      <div className="md:hidden pt-8 pb-2 px-4">
        <PageHeader title="Clientes" description="Gestioná tus clientes." />
      </div>

      {/* HEADER */}
      <div className="px-4 md:px-5 py-3 bg-surface md:bg-background border-b border-outline-variant/10">
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
            {pag.paginatedItems.length > 0 ? (
              pag.paginatedItems.map((client) => {
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
                        <div className="text-[9px] md:text-xs text-on-surface-variant tabular-nums">
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
          <PaginationButtons
            currentPage={pag.currentPage}
            totalPages={pag.totalPages}
            totalItems={pag.totalItems}
            pageSize={pag.pageSize}
            onPageChange={pag.goToPage}
            className="px-4 md:px-5 pb-4"
          />
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
