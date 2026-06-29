import { useState } from "react";
import { Pencil, Trash2, Plus, Phone, MapPin, Mail, CalendarDays, Hammer, CheckCircle2, DollarSign } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { useClientForm } from "./use-client-form";
import { useCuentaCorriente } from "@/hooks/use-cuenta-corriente";

import { AjusteManualForm } from "./ajuste-manual-form";
import Link from "next/link";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { cn, formatCurrency } from "@/lib/utils";
import { AuroraBackground } from "@/components/ui/aurora-background";

export function getStatusColor(estado: string): string {
  switch (estado) {
    case "pagado":
      return "bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#2E7D32]/20 dark:text-[#81C784]";
    case "presupuestado":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    case "borrador":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    default:
      return "bg-surface text-on-surface-variant";
  }
}

export function getStatusDotColor(estado: string): string {
  switch (estado) {
    case "pagado":
      return "bg-[#4CAF50]";
    case "presupuestado":
      return "bg-amber-500";
    case "borrador":
      return "bg-blue-500";
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
  const [showAjuste, setShowAjuste] = useState(false);
  const { pushHistory } = useNavigationHistory();
  const { jobs, tasks, materiales, cobros } = useDataStore();

  const clientJobs = jobs.filter((j) => j.cliente_id === client.id);
  const { saldo: deudaTotal } = useCuentaCorriente(client.id);

  const handleSuccess = () => setIsEditing(false);
  const { form, onSubmit, isLoading } = useClientForm(client, handleSuccess);
  const { register, formState: { errors } } = form;

  return (
    <div className="flex-1 overflow-y-auto relative w-full min-h-screen">
      <AuroraBackground preset="perfil" />

      <form onSubmit={onSubmit} className="relative z-10 px-4 pt-28 pb-6 md:pt-8 md:pb-8 max-w-[1200px] mx-auto flex flex-col gap-6 pb-32">
        
        {/* 1. Header Card */}
        <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-5 md:p-6 border border-outline-variant/20 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-row items-start gap-4 md:gap-6 w-full">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#2E7D32]/20 dark:text-[#81C784] flex items-center justify-center font-bold text-3xl shrink-0 mt-0.5">
              {client.nombre.charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col gap-1 md:gap-2">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Nombre</label>
                    <input type="text" {...register("nombre")} className="w-full bg-transparent border-b border-outline-variant/30 py-1 text-lg font-bold focus:border-primary focus:outline-none transition-colors" autoFocus />
                    {errors.nombre && <p className="text-xs font-bold text-error mt-1">{errors.nombre.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Email</label>
                    <input type="email" {...register("email")} className="w-full bg-transparent border-b border-outline-variant/30 py-1 text-sm focus:border-primary focus:outline-none transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Teléfono</label>
                    <input type="tel" {...register("telefono")} className="w-full bg-transparent border-b border-outline-variant/30 py-1 text-sm focus:border-primary focus:outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Dirección</label>
                    <input type="text" {...register("direccion")} className="w-full bg-transparent border-b border-outline-variant/30 py-1 text-sm focus:border-primary focus:outline-none transition-colors" />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-[28px] font-bold text-on-surface tracking-tight leading-none">{client.nombre}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[13px] text-on-surface-variant/70 cursor-default select-none">
                      Cliente desde {new Date(client.created_at).toLocaleDateString("es-AR", { month: "short", year: "numeric" })}
                    </span>
                    <Link
                      href={`/clientes/${client.id}/cuenta-corriente`}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors",
                        deudaTotal > 0
                          ? "bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] dark:bg-[#DC2626]/20 dark:text-[#FCA5A5] dark:hover:bg-[#DC2626]/30"
                          : deudaTotal < 0
                            ? "bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0] dark:bg-[#16A34A]/20 dark:text-[#86EFAC] dark:hover:bg-[#16A34A]/30"
                            : "bg-on-surface/5 text-on-surface-variant hover:bg-on-surface/10"
                      )}
                    >
                      {deudaTotal > 0 ? `Debe ${formatCurrency(Math.abs(deudaTotal))}` : deudaTotal < 0 ? `A favor ${formatCurrency(Math.abs(deudaTotal))}` : "Al día"}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 md:mt-2">
                    {client.email && (
                      <span className="flex items-center gap-2 text-[13px] text-on-surface-variant cursor-default select-none">
                        <Mail className="w-3.5 h-3.5 opacity-60" aria-hidden="true" /> {client.email}
                      </span>
                    )}
                    {client.telefono && (
                      <span className="flex items-center gap-2 text-[13px] text-on-surface-variant cursor-default select-none">
                        <Phone className="w-3.5 h-3.5 opacity-60" aria-hidden="true" /> {client.telefono}
                      </span>
                    )}
                    {client.direccion && (
                      <span className="flex items-center gap-2 text-[13px] text-on-surface-variant cursor-default select-none">
                        <MapPin className="w-3.5 h-3.5 opacity-60" aria-hidden="true" /> {client.direccion}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex gap-2 shrink-0">
            {isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl bg-on-surface/5 hover:bg-on-surface/10 text-sm font-bold transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="px-5 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark text-sm font-bold shadow-sm transition-all active:scale-95">
                  {isLoading ? "..." : "Guardar"}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setIsEditing(true)} className="w-10 h-10 flex items-center justify-center rounded-[12px] border border-outline-variant/20 dark:border-white/10 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors group">
                  <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                <button type="button" onClick={() => onDelete(client)} className="w-10 h-10 flex items-center justify-center rounded-[12px] border border-outline-variant/20 dark:border-white/10 text-on-surface-variant hover:text-error hover:bg-error/5 transition-colors group">
                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3. Main Master-Detail Grid */}
        <div className="space-y-6">
          {/* Trabajos Activos */}
          <div className="relative group">
            <div className="flex flex-col bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm mt-2">
              <div className="flex flex-row items-center justify-between gap-4 px-4 py-4 border-b border-outline-variant/10 bg-surface/50">
                <h2 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-widest">Trabajos Activos</h2>
                <Link
                  href={`/trabajos/nuevo?clienteId=${client.id}`}
                  className="text-[13px] font-bold text-primary hover:bg-primary/15 transition-colors flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Nuevo trabajo
                </Link>
              </div>

              <div className="hidden md:flex items-center px-4 py-2 border-b border-outline-variant/20 bg-surface-variant/20">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex-1">Trabajo</div>
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-48">Estado / Avance</div>
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-32 text-right">Importe</div>
              </div>
              
              <div className="flex flex-col divide-y divide-outline-variant/10">
              {clientJobs.length > 0 ? (
                clientJobs.map((job) => {
                  const jobTasks = tasks.filter((t) => t.trabajo_id === job.id);
                  const completedTasks = jobTasks.filter((t) => t.completada).length;
                  const totalTasks = jobTasks.length;
                  const jobMaterials = materiales.filter((m) => m.trabajo_id === job.id);
                  const materialsCost = jobMaterials.reduce((sum, m) => sum + m.subtotal, 0);
                  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                  const daysSinceCreation = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24));

                  const totalEstimado = jobTasks.reduce((sum, t) => sum + (t.precio ?? 0), 0) + materialsCost;
                  const totalCobrado = cobros.filter((c) => c.trabajo_id === job.id).reduce((s, c) => s + c.monto_cobrado, 0);
                  const saldoPendiente = Math.max(0, totalEstimado - totalCobrado);

                  return (
                    <Link
                      key={job.id}
                      href={`/trabajos/${job.id}`}
                      onClick={() => {
                         setLoadingJobId(job.id);
                         pushHistory(window.location.pathname + window.location.search);
                      }}
                      className="flex flex-col md:flex-row md:items-center px-4 py-3 md:py-4 hover:bg-primary/5 cursor-pointer transition-colors group gap-3 md:gap-0"
                    >
                      {/* Title & Metadata Column */}
                      <div className="flex-1 min-w-0 pr-4 flex flex-col gap-1">
                        <div className="text-[15px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                          {job.titulo}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-on-surface-variant/70">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {daysSinceCreation === 0 ? "Hoy" : `Hace ${daysSinceCreation}d`}
                          </span>
                          {job.direccion && (
                            <span className="flex items-center gap-1 truncate max-w-[200px]">
                              <MapPin className="w-3 h-3" />
                              {job.direccion}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status & Progress Column */}
                      <div className="w-full md:w-48 shrink-0 flex flex-col gap-1.5 md:pr-4">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", getStatusDotColor(job.estado))} />
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", getStatusColor(job.estado))}>
                            {job.estado.replace(/_/g, " ")}
                          </span>
                        </div>
                        {totalTasks > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-on-surface/5 dark:bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-[10px] font-medium text-on-surface-variant/70 w-7 text-right">
                              {progress}%
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/60">
                          {totalTasks > 0 && <span>{completedTasks}/{totalTasks} Tareas</span>}
                          {jobMaterials.length > 0 && <span>• {jobMaterials.length} Mats</span>}
                        </div>
                      </div>

                      {/* Amount Column */}
                      <div className="w-full md:w-32 shrink-0 flex flex-col md:items-end justify-center pt-2 md:pt-0 border-t border-outline-variant/10 md:border-0">
                        <span className="text-base font-bold text-on-surface tabular-nums">
                          {job.presupuesto > 0 ? formatCurrency(job.presupuesto) : "S/P"}
                        </span>
                        {job.estado === "presupuestado" && totalEstimado > 0 && saldoPendiente > 0 && (
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                            Debe {formatCurrency(saldoPendiente)}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="py-8 text-center text-[14px] text-on-surface-variant/60 italic">
                  No hay trabajos activos.
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
