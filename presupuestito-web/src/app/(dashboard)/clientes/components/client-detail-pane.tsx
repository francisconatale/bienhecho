import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Phone, MapPin, Mail, CalendarDays } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
// No services used anymore
import { Client, Job } from "@/types";
import { useClientForm } from "./use-client-form";
import { useCuentaCorriente } from "@/hooks/use-cuenta-corriente";
import { createClient } from "@/utils/supabase/client";

import { AjusteManualForm } from "./ajuste-manual-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { cn, formatCurrency } from "@/lib/utils";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { DataTable, type Column } from "@/components/ui/data-table";

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
  const router = useRouter();
  const { pushHistory } = useNavigationHistory();
  
  const { data, isLoading } = useQuery({
    queryKey: ["client-data", client.id],
    queryFn: async () => {
      const supabase = createClient();
      const { data: jobs, error: jobsError } = await supabase
        .from("trabajos")
        .select("*")
        .eq("cliente_id", client.id)
        .order("created_at", { ascending: false });
        
      if (jobsError) throw jobsError;
      const jobIds = jobs?.map(j => j.id) || [];
      
      if (jobIds.length === 0) {
        return { jobs: [], tasks: [], materiales: [], cobros: [] };
      }
      
      const [
        { data: tasks },
        { data: materiales },
        { data: cobros }
      ] = await Promise.all([
        supabase.from("tareas").select("*").in("trabajo_id", jobIds),
        supabase.from("materiales").select("*").in("trabajo_id", jobIds),
        supabase.from("cobros").select("*").in("trabajo_id", jobIds)
      ]);
      
      return {
        jobs: jobs || [],
        tasks: tasks || [],
        materiales: materiales || [],
        cobros: cobros || []
      };
    }
  });

  const clientJobs = data?.jobs || [];
  
  const jobMetrics = useMemo(() => {
    const tasks = data?.tasks || [];
    const materiales = data?.materiales || [];
    const cobros = data?.cobros || [];

    const metrics: Record<string, {
      completedTasks: number,
      totalTasks: number,
      materialsCost: number,
      totalEstimado: number,
      totalCobrado: number,
      saldoPendiente: number,
    }> = {};

    clientJobs.forEach(job => {
      const jobTasks = tasks.filter((t: any) => t.trabajo_id === job.id);
      const jobMaterials = materiales.filter((m: any) => m.trabajo_id === job.id);
      const jobCobros = cobros.filter((c: any) => c.trabajo_id === job.id);

      const completedTasks = jobTasks.filter((t: any) => t.completada).length;
      const totalTasks = jobTasks.length;
      const materialsCost = jobMaterials.reduce((sum: number, m: any) => sum + m.subtotal, 0);
      const totalEstimado = jobTasks.reduce((sum: number, t: any) => sum + (t.precio ?? 0), 0) + materialsCost;
      const totalCobrado = jobCobros.reduce((s: number, c: any) => s + c.monto_cobrado, 0);
      const saldoPendiente = Math.max(0, totalEstimado - totalCobrado);

      metrics[job.id] = {
        completedTasks,
        totalTasks,
        materialsCost,
        totalEstimado,
        totalCobrado,
        saldoPendiente
      };
    });
    
    return metrics;
  }, [clientJobs, data]);
  const { saldo: deudaTotal } = useCuentaCorriente(client.id);

  const handleSuccess = () => setIsEditing(false);
  const { form, onSubmit, isLoading: isFormLoading } = useClientForm(client, handleSuccess);
  const { register, formState: { errors } } = form;

  return (
    <div className="flex-1 overflow-y-auto relative w-full h-full min-h-full flex flex-col">
      <AuroraBackground preset="perfil" />

      <form onSubmit={onSubmit} className="relative z-10 px-4 pt-28 pb-24 md:pt-8 md:pb-8 max-w-[1200px] w-full mx-auto flex flex-col gap-6">
        
        {/* 1. Header Card */}
        <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-5 md:p-6 border border-outline-variant/20 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6 overflow-hidden w-full">
          <div className="flex flex-row items-start gap-4 md:gap-6 w-full min-w-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#2E7D32]/20 dark:text-[#81C784] flex items-center justify-center font-bold text-3xl shrink-0 mt-0.5">
              {client.nombre.charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col gap-1 md:gap-2">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="md:col-span-2 space-y-1 min-w-0">
                    <label htmlFor="client-nombre" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Nombre</label>
                    <input id="client-nombre" type="text" {...register("nombre")} aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? "client-nombre-error" : undefined} className="w-full bg-transparent border-b border-outline-variant/30 py-1 text-lg font-bold focus:border-primary focus:outline-none transition-colors min-w-0" autoFocus />
                    {errors.nombre && <p id="client-nombre-error" role="alert" className="text-xs font-bold text-error mt-1">{errors.nombre.message}</p>}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <label htmlFor="client-email" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Email</label>
                    <input id="client-email" type="email" {...register("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "client-email-error" : undefined} className="w-full bg-transparent border-b border-outline-variant/30 py-1 text-sm focus:border-primary focus:outline-none transition-colors min-w-0" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <label htmlFor="client-telefono" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Teléfono</label>
                    <input id="client-telefono" type="tel" {...register("telefono")} aria-invalid={!!errors.telefono} aria-describedby={errors.telefono ? "client-telefono-error" : undefined} className="w-full bg-transparent border-b border-outline-variant/30 py-1 text-sm focus:border-primary focus:outline-none transition-colors min-w-0" />
                  </div>
                  <div className="md:col-span-2 space-y-1 min-w-0">
                    <label htmlFor="client-direccion" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Dirección</label>
                    <input id="client-direccion" type="text" {...register("direccion")} aria-invalid={!!errors.direccion} aria-describedby={errors.direccion ? "client-direccion-error" : undefined} className="w-full bg-transparent border-b border-outline-variant/30 py-1 text-sm focus:border-primary focus:outline-none transition-colors min-w-0" />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-[28px] font-bold text-on-surface tracking-tight leading-none break-words whitespace-normal break-all sm:break-normal">{client.nombre}</h1>
                  <span className="text-[13px] text-on-surface-variant/70 cursor-default select-none truncate">
                    Cliente desde {new Date(client.created_at).toLocaleDateString("es-AR", { month: "short", year: "numeric" })}
                  </span>
                  <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-x-6 gap-y-2 mt-3 md:mt-2 min-w-0">
                    {client.email && (
                      <span className="flex items-center gap-2 text-[13px] text-on-surface-variant cursor-default select-none min-w-0 max-w-full">
                        <Mail className="w-3.5 h-3.5 opacity-60 shrink-0" aria-hidden="true" />
                        <span className="truncate flex-1 min-w-0">{client.email}</span>
                      </span>
                    )}
                    {client.telefono && (
                      <span className="flex items-center gap-2 text-[13px] text-on-surface-variant cursor-default select-none min-w-0 max-w-full">
                        <Phone className="w-3.5 h-3.5 opacity-60 shrink-0" aria-hidden="true" />
                        <span className="truncate flex-1 min-w-0">{client.telefono}</span>
                      </span>
                    )}
                    {client.direccion && (
                      <span className="flex items-center gap-2 text-[13px] text-on-surface-variant cursor-default select-none min-w-0 max-w-full">
                        <MapPin className="w-3.5 h-3.5 opacity-60 shrink-0" aria-hidden="true" />
                        <span className="truncate flex-1 min-w-0">{client.direccion}</span>
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
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl bg-on-surface/5 hover:bg-on-surface/10 text-sm font-bold transition-colors shrink-0">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} data-client-save className="px-5 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark text-sm font-bold shadow-sm transition-all active:scale-95 shrink-0">
                  {isLoading ? "..." : "Guardar"}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setIsEditing(true)} className="w-10 h-10 flex items-center justify-center rounded-[12px] border border-outline-variant/20 dark:border-white/10 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors group shrink-0">
                  <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                <button type="button" onClick={() => onDelete(client)} className="w-10 h-10 flex items-center justify-center rounded-[12px] border border-outline-variant/20 dark:border-white/10 text-on-surface-variant hover:text-error hover:bg-error/5 transition-colors group shrink-0">
                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 2. Cuenta Corriente Card */}
        <Link
          href={`/clientes/${client.id}/cuenta-corriente`}
          className={cn(
            "block rounded-xl p-4 md:p-5 border shadow-sm transition-all active:scale-[0.98] overflow-hidden w-full",
            deudaTotal > 0
              ? "bg-[#FEF2F2] dark:bg-[#DC2626]/10 border-[#FECACA] dark:border-[#DC2626]/20"
              : deudaTotal < 0
                ? "bg-[#F0FDF4] dark:bg-[#16A34A]/10 border-[#BBF7D0] dark:border-[#16A34A]/20"
                : "bg-surface/60 dark:bg-surface/40 border-outline-variant/15"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 truncate">Cuenta Corriente</span>
              <span className={cn(
                "text-[22px] md:text-2xl font-bold tabular-nums truncate",
                deudaTotal > 0
                  ? "text-[#DC2626] dark:text-[#FCA5A5]"
                  : deudaTotal < 0
                    ? "text-[#16A34A] dark:text-[#86EFAC]"
                    : "text-on-surface"
              )}>
                {deudaTotal === 0 ? "$0" : `${deudaTotal > 0 ? "-" : ""}${formatCurrency(Math.abs(deudaTotal))}`}
              </span>
            </div>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              deudaTotal > 0
                ? "bg-[#DC2626]/10 text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#FCA5A5]"
                : deudaTotal < 0
                  ? "bg-[#16A34A]/10 text-[#16A34A] dark:bg-[#16A34A]/20 dark:text-[#86EFAC]"
                  : "bg-on-surface/5 text-on-surface-variant"
            )}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>
          <span className="text-[11px] text-on-surface-variant/60 mt-2 block">
            {deudaTotal > 0 ? "El cliente te debe plata" : deudaTotal < 0 ? "Le debés plata al cliente" : "Todo al día"}
          </span>
        </Link>

        <div className="space-y-6">
          {(() => {
            const jobColumns: Column<Job>[] = [
              {
                label: "Trabajo",
                className: "max-w-[130px] sm:max-w-[200px] md:max-w-none w-full",
                render: (job) => {
                  const daysSinceCreation = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                        {job.titulo}
                      </span>
                      <span className="flex items-center gap-3 text-[11px] text-on-surface-variant/70">
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
                      </span>
                    </div>
                  );
                },
              },
              {
                label: "Estado",
                className: "md:w-40",
                render: (job) => {
                  const metrics = jobMetrics[job.id] || { totalTasks: 0, completedTasks: 0 };
                  const progress = metrics.totalTasks > 0 ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) : 0;
                  return (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full shrink-0", getStatusDotColor(job.estado))} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", getStatusColor(job.estado))}>
                          {job.estado.replace(/_/g, " ")}
                        </span>
                      </div>
                      {metrics.totalTasks > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-on-surface/5 dark:bg-white/[0.06] rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[10px] font-medium text-on-surface-variant/70 w-7 text-right">{progress}%</span>
                        </div>
                      )}
                    </div>
                  );
                },
              },
              {
                label: "Importe",
                className: "md:w-32 text-right",
                headerClassName: "text-right",
                render: (job) => {
                  const metrics = jobMetrics[job.id] || { totalEstimado: 0, saldoPendiente: 0 };
                  return (
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-base font-bold text-on-surface tabular-nums">
                        {job.presupuesto > 0 ? formatCurrency(job.presupuesto) : "S/P"}
                      </span>
                      {job.estado === "presupuestado" && metrics.totalEstimado > 0 && metrics.saldoPendiente > 0 && (
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                          Debe {formatCurrency(metrics.saldoPendiente)}
                        </span>
                      )}
                    </div>
                  );
                },
              },
            ];

            if (isLoading) {
              return (
                <div className="p-8 border border-outline-variant/20 rounded-xl bg-surface/50">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-outline-variant/10 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="w-3/4 h-4 bg-outline-variant/10 rounded animate-pulse" />
                          <div className="w-1/2 h-3 bg-outline-variant/10 rounded animate-pulse" />
                        </div>
                        <div className="w-20 h-6 bg-outline-variant/10 rounded-lg animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <DataTable
                columns={jobColumns}
                items={clientJobs}
                keyExtractor={(job) => job.id}
                onRowClick={(job) => {
                  setLoadingJobId(job.id);
                  pushHistory(window.location.pathname + window.location.search);
                  router.push(`/trabajos/${job.id}`);
                }}
                title="Trabajos Activos"
                emptyMessage="No hay trabajos activos."
                actions={
                  <Link
                    href={`/trabajos/nuevo?clienteId=${client.id}`}
                    className="text-[13px] font-bold text-primary hover:bg-primary/15 transition-colors flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Nuevo trabajo
                  </Link>
                }
              />
            );
          })()}
        </div>
      </form>
    </div>
  );
}
