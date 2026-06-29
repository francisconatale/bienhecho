import { useState } from "react";
import { Pencil, Trash2, Plus, Phone, MapPin, Mail, Briefcase, FileText } from "lucide-react";
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
  const { jobs } = useDataStore();
  
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
          
          <div className="flex gap-2 shrink-0">
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

        {/* 2. Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Balance</span>
            <span className={cn("text-3xl font-bold tracking-tight mt-1", deudaTotal > 0 ? "text-[#EF4444]" : deudaTotal < 0 ? "text-[#22C55E]" : "text-on-surface")}>
              {formatCurrency(Math.abs(deudaTotal))}
            </span>
            <div className="flex items-center gap-2 mt-4 text-[13px] text-on-surface-variant/80">
              <div className={cn("w-2 h-2 rounded-full", deudaTotal > 0 ? "bg-[#EF4444]" : deudaTotal < 0 ? "bg-[#22C55E]" : "bg-on-surface-variant/40")} />
              {deudaTotal > 0 ? "En deuda" : deudaTotal < 0 ? "A favor" : "Al día"}
            </div>
          </div>

          <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Total Facturado</span>
            <span className="text-3xl font-bold tracking-tight mt-1 text-on-surface">
              {formatCurrency(totalCargos)}
            </span>
            <div className="flex items-center gap-2 mt-4 text-[13px] text-on-surface-variant/80">
              Histórico acumulado
            </div>
          </div>

          <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Total Cobrado</span>
            <span className="text-3xl font-bold tracking-tight mt-1 text-[#22C55E]">
              {formatCurrency(totalAbonos)}
            </span>
            <div className="flex items-center gap-2 mt-4 text-[13px] text-on-surface-variant/80">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              {totalCobrosCount} cobros registrados
            </div>
          </div>
        </div>

        {/* 3. Main Master-Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          
          {/* Columna Izquierda */}
          <div className="space-y-6">
            
            {/* Trabajos Activos */}
            <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Trabajos Activos</h3>
                <Link
                  href={`/trabajos/nuevo?clienteId=${client.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-[12px] border border-outline-variant/30 dark:border-white/10 hover:bg-on-surface/5 transition-colors text-sm font-semibold"
                >
                  <Briefcase className="w-4 h-4" />
                  Nuevo trabajo
                </Link>
              </div>

              <div className="space-y-3">
                {clientJobs.length > 0 ? (
                  clientJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/trabajos/${job.id}`}
                      onClick={() => {
                        setLoadingJobId(job.id);
                        pushHistory(window.location.pathname + window.location.search);
                      }}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-surface/40 dark:bg-white/[0.03] rounded-[16px] border border-outline-variant/10 dark:border-white/5 hover:bg-surface/80 dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0", getStatusDotColor(job.estado))} />
                        <div className="flex flex-col items-start gap-2">
                          <p className="text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">{job.titulo}</p>
                          <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md", getStatusColor(job.estado))}>
                            {job.estado.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:ml-auto shrink-0">
                        <span className="text-lg font-bold tracking-tight text-on-surface">
                          {job.presupuesto > 0 ? formatCurrency(job.presupuesto) : "S/P"}
                        </span>
                        <div className="w-8 h-8 rounded-lg border border-outline-variant/20 dark:border-white/10 flex items-center justify-center text-on-surface-variant">
                          {loadingJobId === job.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center text-[13px] font-medium text-on-surface-variant/60">
                    No hay trabajos activos.
                  </div>
                )}
              </div>
            </div>

            {/* Historial de Movimientos */}
            <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-6">Historial de Movimientos</h3>

              <div className="space-y-3">
                {transacciones.length > 0 ? (
                  transacciones.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between gap-4 p-4 bg-surface/40 dark:bg-white/[0.03] rounded-[16px] border border-outline-variant/10 dark:border-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-2 h-2 rounded-full shrink-0", tx.tipo === "cargo" ? "bg-[#EF4444]" : "bg-[#22C55E]")} />
                        <div className="flex flex-col gap-1.5">
                          <p className="text-[14px] font-bold text-on-surface leading-none">{tx.concepto}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-on-surface-variant/70">
                              {new Date(tx.fecha + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                              tx.tipo === "cargo" ? "bg-amber-100 text-amber-700 dark:bg-[#EF4444]/20 dark:text-[#EF4444]" : "bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#22C55E]/20 dark:text-[#81C784]"
                            )}>
                              {tx.tipo === "cargo" ? "Cargo" : "Abono"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={cn(
                          "text-base font-bold tracking-tight block",
                          tx.tipo === "cargo" ? "text-[#EF4444]" : "text-[#22C55E]"
                        )}>
                          {tx.tipo === "cargo" ? "+" : "-"}{formatCurrency(tx.monto)}
                        </span>
                        <span className="text-[11px] text-on-surface-variant/60">
                          Saldo {formatCurrency(tx.saldo_despues)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-[13px] font-medium text-on-surface-variant/60">
                    Aún no hay movimientos.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Columna Derecha (Sidebar) */}
          <div className="space-y-6 lg:sticky lg:top-8">
            
            {/* Balance Card */}
            <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">Balance de Cuenta</span>
              
              <span className={cn("text-[40px] font-bold tracking-tighter leading-none mb-3", deudaTotal > 0 ? "text-[#EF4444]" : deudaTotal < 0 ? "text-[#22C55E]" : "text-on-surface")}>
                {formatCurrency(Math.abs(deudaTotal))}
              </span>
              
              <div className="flex items-center self-start">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1.5",
                  deudaTotal > 0 ? "bg-amber-100 text-amber-700 dark:bg-[#EF4444]/20 dark:text-[#EF4444]" : deudaTotal < 0 ? "bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#22C55E]/20 dark:text-[#81C784]" : "bg-surface text-on-surface-variant"
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", deudaTotal > 0 ? "bg-current" : deudaTotal < 0 ? "bg-current" : "bg-current")} />
                  {deudaTotal > 0 ? "En deuda" : deudaTotal < 0 ? "A favor" : "Al día"}
                </span>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setShowAjuste(true)}
                  className="w-full py-3 rounded-xl border border-outline-variant/30 dark:border-white/10 hover:bg-on-surface/5 transition-colors flex items-center justify-center gap-2 text-[13px] font-bold"
                >
                  <FileText className="w-4 h-4" />
                  Ajuste manual
                </button>
              </div>
            </div>

            {showAjuste && (
              <AjusteManualForm clienteId={client.id} onClose={() => setShowAjuste(false)} />
            )}

            {/* Resumen Bento */}
            <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Resumen</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface/40 dark:bg-white/[0.03] rounded-[16px] p-4 flex flex-col gap-1 border border-outline-variant/10 dark:border-white/5">
                  <span className="text-xl font-bold text-on-surface">{clientJobs.length}</span>
                  <span className="text-[11px] text-on-surface-variant/70">Trabajos activos</span>
                </div>
                <div className="bg-surface/40 dark:bg-white/[0.03] rounded-[16px] p-4 flex flex-col gap-1 border border-outline-variant/10 dark:border-white/5">
                  <span className="text-xl font-bold text-on-surface">{totalMovimientos}</span>
                  <span className="text-[11px] text-on-surface-variant/70">Movimientos</span>
                </div>
                <div className="bg-surface/40 dark:bg-white/[0.03] rounded-[16px] p-4 flex flex-col gap-1 border border-outline-variant/10 dark:border-white/5">
                  <span className="text-xl font-bold text-on-surface">{totalCobrosCount}</span>
                  <span className="text-[11px] text-on-surface-variant/70">Cobros</span>
                </div>
                <div className="bg-surface/40 dark:bg-white/[0.03] rounded-[16px] p-4 flex flex-col gap-1 border border-outline-variant/10 dark:border-white/5">
                  <span className="text-xl font-bold text-on-surface">0</span>
                  <span className="text-[11px] text-on-surface-variant/70">Vencidos</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
