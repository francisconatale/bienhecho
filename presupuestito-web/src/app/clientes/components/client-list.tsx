"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Pencil,
  Trash2,
  Briefcase,
  ExternalLink,
  X,
  Save,
} from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { ClientForm } from "./client-form";
import { useClientForm } from "./use-client-form";
import { usePagination } from "@/hooks/use-pagination";
import { MasterDetail } from "@/components/ui/master-detail";
import { MobileHeaderActions } from "@/components/ui/mobile-header-actions";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useNavigationHistory } from "@/hooks/use-navigation-history";

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
  isEditing,
  setIsEditing,
}: {
  client: Client;
  onDelete: (c: Client) => void;
  onBack: () => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
}) {
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  const { pushHistory } = useNavigationHistory();
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
      {/* Overlays removed since they are now global in layout.tsx */}

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
                    <h2 className="text-3xl font-black text-on-surface tracking-tighter truncate leading-none cursor-default select-none">{client.nombre}</h2>
                    <p className="text-sm font-medium text-on-surface-variant truncate mt-1.5 cursor-default select-none">{client.email || "Sin email registrado"}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mt-1.5 cursor-default select-none">
                      Cliente desde {new Date(client.created_at).toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:flex gap-2 shrink-0 ml-4">
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
                    data-client-save
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
                  href={`/trabajos/${job.id}`}
                  onClick={() => {
                    setLoadingJobId(job.id);
                    pushHistory(window.location.pathname + window.location.search);
                  }}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-5 bg-surface/40 dark:bg-surface/20 rounded-[20px] border border-white/10 dark:border-white/5 transition-all duration-300 hover:bg-surface/60 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
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
                    <div className={`w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center transition-all shrink-0 ${
                      loadingJobId === job.id 
                        ? "opacity-100 bg-primary/10" 
                        : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-hover:bg-primary/10 group-active:scale-95"
                    }`}>
                      {loadingJobId === job.id ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ExternalLink className="w-5 h-5 text-on-surface-variant group-hover:text-primary" />
                      )}
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
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => searchParams.get("clienteId") || null
  );

  const handleSelectedIdChange = (id: string | null) => {
    setSelectedId(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("clienteId", id);
    } else {
      params.delete("clienteId");
    }
    window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
  };

  const [showCreationForm, setShowCreationForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { clients, removeClient } = useDataStore();

  // Reset editing state when selection changes
  useEffect(() => { setIsEditing(false); }, [selectedId]);

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
      if (selectedId === client.id) handleSelectedIdChange(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-transparent relative overflow-hidden">

      <MasterDetail
        selectedId={selectedId}
        onSelectedChange={(id) => { handleSelectedIdChange(id); setShowCreationForm(false); }}
        items={filtered}
        getItemId={(c) => c.id}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filtrar clientes..."
        countLabel="cliente(s)"
        mobileTitle="Clientes"
        mobileDescription="Gestioná tus clientes."
        detailTitle={(client) => client.nombre}
        detailRightAction={(client) => (
          <MobileHeaderActions
            isEditing={isEditing}
            hasChanges={isEditing} // Form handles its own disable state via disabled={isLoading} or we can assume always true until hook provides isDirty
            onEditStart={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
            onSave={() => {
              document.querySelector<HTMLButtonElement>('[data-client-save]')?.click();
            }}
            onDelete={() => handleDelete(client)}
          />
        )}
        pagination={pag}
        showCreationForm={showCreationForm}
        onToggleCreation={() => { setShowCreationForm(!showCreationForm); handleSelectedIdChange(null); }}
        renderCreationForm={() => (
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
              <ClientForm onSuccess={(clientId) => {
                setShowCreationForm(false);
                handleSelectedIdChange(clientId);
              }} />
            </div>
          </div>
        )}
        renderItem={(client, isSelected) => {
          const clientJobs = useDataStore.getState().jobs.filter((j) => j.cliente_id === client.id);
          const totalFacturacion = clientJobs.reduce((acc, j) => acc + j.presupuesto, 0);
          return (
            <button
              onClick={() => handleSelectedIdChange(client.id)}
              className={`relative group w-full text-left px-4 md:px-5 py-4 transition-all duration-300 cursor-pointer rounded-[24px] md:rounded-none border border-white/20 dark:border-white/5 md:border-0 md:border-b md:border-outline-variant/5 bg-surface/40 dark:bg-surface/20 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none shadow-[0_4px_12px_rgba(0,0,0,0.02)] md:shadow-none hover:-translate-y-0.5 md:hover:translate-y-0 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:hover:shadow-none ${
                isSelected ? "md:bg-primary/15 dark:md:bg-primary/25 border-primary/30 md:border-b-outline-variant/5" : "md:hover:bg-on-surface/5"
              }`}
            >
              {isSelected && <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-[11px] md:text-sm shrink-0 transition-all ${
                  isSelected ? "bg-primary/20 text-primary shadow-inner" : "bg-primary/8 text-primary/60"
                }`}>
                  {client.nombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm md:text-base truncate transition-colors ${isSelected ? "text-primary" : "text-on-surface"}`}>{client.nombre}</div>
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
        }}
        renderRailItem={(client, isActive) => (
          <button
            onClick={() => { handleSelectedIdChange(client.id); setShowCreationForm(false); }}
            className={`w-10 h-10 rounded-[14px] flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "bg-primary/10 text-primary/70 hover:bg-primary/20"
            }`}
            title={client.nombre}
          >
            {client.nombre.charAt(0)}
          </button>
        )}
        renderDetail={(client) => (
          <DetailPane
            client={client}
            onDelete={handleDelete}
            onBack={() => handleSelectedIdChange(null)}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )}
        emptyDetail={
          <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant">
            <div className="text-center">
              <User className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-15" />
              <p className="text-xs md:text-base font-medium">Seleccioná un cliente</p>
            </div>
          </div>
        }
        emptyState={
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-6 opacity-40"
            >
              <rect x="20" y="30" width="120" height="100" rx="12" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="30" y="45" width="40" height="6" rx="3" fill="currentColor" opacity="0.3" />
              <rect x="30" y="58" width="60" height="4" rx="2" fill="currentColor" opacity="0.15" />
              <rect x="30" y="68" width="50" height="4" rx="2" fill="currentColor" opacity="0.15" />
              <circle cx="108" cy="88" r="22" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M108 80v16M100 88h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <rect x="30" y="90" width="40" height="6" rx="3" fill="currentColor" opacity="0.3" />
              <rect x="30" y="103" width="55" height="4" rx="2" fill="currentColor" opacity="0.15" />
              <rect x="30" y="113" width="35" height="4" rx="2" fill="currentColor" opacity="0.15" />
            </svg>
            <h3 className="text-base md:text-lg font-bold text-on-surface mb-1.5">
              Seleccioná un cliente
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-[260px] leading-relaxed">
              Elegí un cliente de la lista o creá uno nuevo para empezar a gestionar sus trabajos.
            </p>
          </div>
        }
      />
    </div>
  );
}
