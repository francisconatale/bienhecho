import { useState } from "react";
import { Pencil, Trash2, Briefcase, ExternalLink } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { useClientForm } from "./use-client-form";
import Link from "next/link";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { formatCurrency } from "@/lib/utils";

export function getStatusColor(estado: string): string {
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

export function ClientDetailPane({
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
      <form onSubmit={onSubmit} className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="group relative overflow-hidden bg-surface/80 rounded-[28px] p-6 md:p-8 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">

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
          <div className="relative bg-surface/80 rounded-[28px] p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">

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
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-5 bg-surface dark:bg-surface/20 rounded-[20px] border border-white/10 dark:border-white/5 transition-all duration-300 hover:bg-surface/60 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
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
