import { useState } from "react";
import { Pencil, Trash2, Plus, Phone, MapPin, Mail, Briefcase, FileText, CalendarDays, Hammer, CheckCircle2, DollarSign } from "lucide-react";
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
  const { saldo: deudaTotal, transacciones } = useCuentaCorriente(client.id);

  const totalCargos = transacciones.filter(t => t.tipo === "cargo").reduce((acc, t) => acc + t.monto, 0);
  const totalAbonos = transacciones.filter(t => t.tipo === "abono").reduce((acc, t) => acc + t.monto, 0);
  const totalMovimientos = transacciones.length;
  const totalCobrosCount = transacciones.filter(t => t.tipo === "abono").length;

  const handleSuccess = () => setIsEditing(false);
  const { form, onSubmit, isLoading } = useClientForm(client, handleSuccess);
  const { register, formState: { errors } } = form;

  return (
    <div className="flex-1 overflow-y-auto relative w-full min-h-screen">
      <AuroraBackground preset="perfil" />

      <form onSubmit={onSubmit} className="relative z-10 px-4 py-6 md:py-8 max-w-[1200px] mx-auto flex flex-col gap-6 pb-32">
        
        {/* 1. Header Card */}
        <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6 w-full">
            <div className="w-20 h-20 rounded-[16px] bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#2E7D32]/20 dark:text-[#81C784] flex items-center justify-center font-bold text-3xl shrink-0">
              {client.nombre.charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col gap-2">
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
                  <h2 className="text-2xl md:text-[28px] font-bold text-on-surface tracking-tight leading-none">{client.nombre}</h2>
                  <span className="text-[13px] text-on-surface-variant/70">
                    Cliente desde {new Date(client.created_at).toLocaleDateString("es-AR", { month: "short", year: "numeric" })}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                    {client.email && (
                      <span className="flex items-center gap-2 text-[13px] text-on-surface-variant">
                        <Mail className="w-3.5 h-3.5 opacity-60" /> {client.email}
                      </span>
                    )}
                    {client.telefono && (
                      <span className="flex items-center gap-2 text-[13px] text-on-surface-variant">
                        <Phone className="w-3.5 h-3.5 opacity-60" /> {client.telefono}
                      </span>
                    )}
                    {client.direccion && (
                      <span className="flex items-center gap-2 text-[13px] text-on-surface-variant">
                        <MapPin className="w-3.5 h-3.5 opacity-60" /> {client.direccion}
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

        {/* 2. Top Metrics Grid - Simplificado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col gap-1 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Cuenta Corriente</span>
              <span className={cn("text-3xl font-bold tracking-tight mt-1", deudaTotal > 0 ? "text-[#EF4444]" : deudaTotal < 0 ? "text-[#22C55E]" : "text-on-surface")}>
                {formatCurrency(Math.abs(deudaTotal))}
              </span>
              <div className="flex items-center gap-2 mt-2 text-[13px] text-on-surface-variant/80">
                <div className={cn("w-2 h-2 rounded-full", deudaTotal > 0 ? "bg-[#EF4444]" : deudaTotal < 0 ? "bg-[#22C55E]" : "bg-on-surface-variant/40")} />
                {deudaTotal > 0 ? "Saldo en deuda" : deudaTotal < 0 ? "Saldo a favor" : "Al día"}
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/10">
                <Link
                  href={`/clientes/${client.id}/cuenta-corriente`}
                  className="flex items-center justify-between text-sm font-bold text-primary group-hover:text-primary-dark transition-colors"
                >
                  Ver movimientos de cuenta
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Decors */}
            <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Resumen General</h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="bg-surface/40 dark:bg-white/[0.03] rounded-[16px] p-4 flex flex-col justify-center gap-1 border border-outline-variant/10 dark:border-white/5">
                <span className="text-xl font-bold text-on-surface">{clientJobs.length}</span>
                <span className="text-[11px] text-on-surface-variant/70">Trabajos activos</span>
              </div>
              <div className="bg-surface/40 dark:bg-white/[0.03] rounded-[16px] p-4 flex flex-col justify-center gap-1 border border-outline-variant/10 dark:border-white/5">
                <span className="text-xl font-bold text-on-surface">{totalMovimientos}</span>
                <span className="text-[11px] text-on-surface-variant/70">Movimientos</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Master-Detail Grid */}
        <div className="space-y-6">
          {/* Trabajos Activos */}
          <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Trabajos Activos</h3>
              <Link
                href={`/trabajos/nuevo?clienteId=${client.id}`}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-[12px] border border-outline-variant/30 dark:border-white/10 hover:bg-on-surface/5 transition-colors text-sm font-semibold"
              >
                <Briefcase className="w-4 h-4" />
                Nuevo trabajo
              </Link>
            </div>

            <div className="space-y-3">
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
                      className="group block p-4 md:p-5 bg-surface/40 dark:bg-white/[0.03] rounded-[18px] border border-outline-variant/10 dark:border-white/5 hover:bg-surface/80 dark:hover:bg-white/[0.06] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300"
                    >
                      {/* Top row: Title + Status + Price */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0", getStatusDotColor(job.estado))} />
                          <div className="flex flex-col gap-1.5 min-w-0">
                            <p className="text-sm md:text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-tight line-clamp-2">{job.titulo}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md", getStatusColor(job.estado))}>
                                {job.estado.replace(/_/g, " ")}
                              </span>
                              {job.direccion && (
                                <span className="flex items-center gap-1 text-[11px] text-on-surface-variant/60">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-[160px]">{job.direccion}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-base md:text-lg font-bold tracking-tight text-on-surface">
                            {job.presupuesto > 0 ? formatCurrency(job.presupuesto) : "S/P"}
                          </span>
                        </div>
                      </div>

                      {/* Saldo pendiente para presupuestados */}
                      {job.estado === "presupuestado" && totalEstimado > 0 && (
                        <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 rounded-[12px] border border-amber-200/60 dark:border-amber-500/20">
                          <DollarSign className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span className="text-[12px] font-semibold text-amber-700 dark:text-amber-400">
                            Falta cobrar {formatCurrency(saldoPendiente)}
                          </span>
                        </div>
                      )}

                      {/* Progress bar */}
                      {totalTasks > 0 && (
                        <div className="mb-3">
                          <div className="h-1.5 bg-on-surface/5 dark:bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Bottom metadata row */}
                      <div className="flex items-center gap-4 text-[11px] text-on-surface-variant/60">
                        {totalTasks > 0 && (
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {completedTasks}/{totalTasks} tareas
                          </span>
                        )}
                        {jobMaterials.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Hammer className="w-3.5 h-3.5" />
                            {formatCurrency(materialsCost)} en materiales
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 ml-auto">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {daysSinceCreation === 0 ? "Hoy" : `Hace ${daysSinceCreation}d`}
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="py-8 text-center text-[13px] font-medium text-on-surface-variant/60">
                  No hay trabajos activos.
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
