"use client";

import { useDataStore } from "@/lib/store";
import { useUserStore } from "@/lib/user-store";
import { useClientAlerts } from "@/app/tareas/hooks/use-client-alerts";
import { usePagination } from "@/hooks/use-pagination";
import { DataTable, type Column } from "@/components/ui/data-table";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Job } from "@/types";
import {
  PlusCircle,
  Briefcase,
  UserPlus,
  ChevronRight,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

export default function DashboardPage() {
  const { jobs, clients, visits } = useDataStore();
  const user = useUserStore((state) => state.user);
  const { alerts } = useClientAlerts();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = mounted ? (user?.name || "Francisco") : "Francisco";

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [jobs]
  );
  const pag = usePagination(sortedJobs, 5);

  const upcomingVisits = useMemo(() => {
    const today = new Date();
    const inSevenDays = new Date(today);
    inSevenDays.setDate(inSevenDays.getDate() + 7);
    return visits
      .filter((v) => v.estado === "planificada")
      .filter((v) => {
        const d = new Date(v.fecha + "T00:00:00");
        return d >= today && d <= inSevenDays;
      })
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .slice(0, 5);
  }, [visits]);

  const totalToInvoice = useMemo(
    () => jobs.reduce((acc, j) => acc + (j.presupuesto || 0), 0),
    [jobs]
  );

  if (!mounted) return null;

  // ─── Reusable sub-components ────────────────────────────────────────────────

  const ActionsList = () => (
    <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
      {[
        { href: "/trabajos/nuevo", icon: <PlusCircle size={17} strokeWidth={2.5} />, label: "Nuevo Trabajo", color: "bg-primary" },
        { href: "/trabajos",       icon: <Briefcase  size={17} strokeWidth={2.5} />, label: "Ver Trabajos",  color: "bg-orange-500" },
        { href: "/clientes",       icon: <UserPlus   size={17} strokeWidth={2.5} />, label: "Clientes",      color: "bg-blue-500" },
        { href: "/agenda",         icon: <CalendarDays size={17} strokeWidth={2.5} />, label: "Agenda",     color: "bg-violet-500" },
      ].map(({ href, icon, label, color }, i, arr) => (
        <Link
          key={href}
          href={href}
          className={`w-full flex items-center justify-between p-4 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] active:bg-black/[0.06] dark:active:bg-white/[0.06] transition-colors ${i !== arr.length - 1 ? "border-b border-outline-variant/15" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white shrink-0`} aria-hidden="true">
              {icon}
            </div>
            <span className="text-[17px] font-medium text-on-surface">{label}</span>
          </div>
          <ChevronRight size={19} className="text-on-surface-variant/50" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );

  const AlertsList = () => {
    if (alerts.length === 0) return null;
    return (
      <div className="space-y-2">
        <h2 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Avisos</h2>
        {alerts.map((a) => (
          <div key={a.id} className="flex gap-3 bg-amber-500/8 dark:bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[12px] font-medium text-on-surface leading-snug">{a.mensaje}</p>
          </div>
        ))}
      </div>
    );
  };

  const activityColumns: Column<Job>[] = [
    {
      label: "Trabajo",
      render: (job) => {
        const client = clients.find((c) => c.id === job.cliente_id);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">
              {job.titulo}
            </span>
            <span className="md:hidden flex items-center gap-2 text-[11px] text-on-surface-variant">
              <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[9px] shrink-0">
                {client?.nombre?.charAt(0) || "T"}
              </span>
              <span className="truncate">{client?.nombre || "Sin cliente"}</span>
            </span>
          </div>
        );
      },
    },
    {
      label: "Cliente",
      className: "hidden md:table-cell md:w-40",
      render: (job) => {
        const client = clients.find((c) => c.id === job.cliente_id);
        return (
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
              {client?.nombre?.charAt(0) || "T"}
            </span>
            <span className="text-[13px] text-on-surface-variant truncate">{client?.nombre || "Sin cliente"}</span>
          </div>
        );
      },
    },
    {
      label: "Importe",
      className: "md:w-32 text-right",
      headerClassName: "text-right",
      render: (job) => (
        <div className="flex flex-col items-end gap-0.5">
          <span className="md:hidden text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Importe</span>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-on-surface tabular-nums">
              ${job.presupuesto.toLocaleString()}
            </span>
            <ChevronRight size={16} className="text-on-surface-variant/50 group-hover:text-primary transition-colors" aria-hidden="true" />
          </div>
        </div>
      ),
    },
  ];

  const ActivityList = () => (
    <DataTable
      columns={activityColumns}
      items={pag.paginatedItems}
      keyExtractor={(job) => job.id}
      onRowClick={(job) => router.push(`/trabajos/${job.id}`)}
      pagination={pag}
      title="Actividad Reciente"
      emptyMessage="No hay actividad reciente."
    />
  );

  const VisitsList = () => (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-widest">Próximas Visitas</h2>
        {upcomingVisits.length > 0 && (
          <Link href="/agenda" className="text-[11px] font-bold text-primary hover:opacity-70 transition-opacity flex items-center gap-0.5">
            Ver agenda <ChevronRight size={12} aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="flex flex-col bg-surface rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm">
        <div className="hidden md:flex items-center px-4 py-2 border-b border-outline-variant/20 bg-surface-variant/20">
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex-1">Fecha / Trabajo</div>
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-32 text-right">Cliente</div>
        </div>
        
        <div className="flex flex-col divide-y divide-outline-variant/10">
          {upcomingVisits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-5 px-4 text-center">
              <CalendarDays className="w-6 h-6 text-on-surface-variant/20 mb-1.5" aria-hidden="true" />
              <p className="text-[12px] text-on-surface-variant/60 font-medium">Sin visitas en los próximos 7 días</p>
            </div>
          ) : (
            upcomingVisits.map((visit) => {
              const job = jobs.find((j) => j.id === visit.trabajo_id);
              const client = job ? clients.find((c) => c.id === job.cliente_id) : null;
              const dayName = new Date(visit.fecha + "T00:00:00").toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
              return (
                <div key={visit.id} className="flex flex-col md:flex-row md:items-center px-4 py-2.5 hover:bg-primary/5 transition-colors gap-2 md:gap-0">
                  {/* Info Column */}
                  <div className="flex-1 min-w-0 pr-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <CalendarDays size={13} aria-hidden="true" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-on-surface truncate">{job?.titulo || "—"}</span>
                      <span className="text-[11px] text-on-surface-variant capitalize">{dayName} · {visit.hora_inicio}</span>
                    </div>
                  </div>

                  {/* Client Column */}
                  {client && (
                    <div className="w-full md:w-32 shrink-0 md:text-right pt-2 md:pt-0 border-t border-outline-variant/10 md:border-0">
                      <p className="text-[11px] font-medium text-on-surface-variant truncate">{client.nombre}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const StatCards = ({ row = false }) => (
    <div className={`${row ? "flex gap-4" : "grid grid-cols-2 gap-3"}`}>
      <div className={`${row ? "flex-1" : ""} bg-primary/8 dark:bg-primary/10 backdrop-blur-xl rounded-xl border border-primary/20 shadow-sm p-4`}>
        <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-2">Presupuestos</p>
        <span className="text-[28px] font-bold text-primary leading-none">{jobs.length}</span>
      </div>
      <div className={`${row ? "flex-1" : ""} bg-primary/8 dark:bg-primary/10 backdrop-blur-xl rounded-xl border border-primary/20 shadow-sm p-4`}>
        <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-2">Por facturar</p>
        <span className="text-[28px] font-bold text-primary leading-none">
          ${totalToInvoice >= 1000 ? `${(totalToInvoice / 1000).toFixed(0)}k` : totalToInvoice.toLocaleString()}
        </span>
      </div>
    </div>
  );

  // ─── Layout ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Aurora background — igual al resto del proyecto */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-[5%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500/8 blur-[130px]" />
      </div>

      {/* ── MOBILE (< md) ── */}
      <div className="md:hidden flex flex-col px-4 pt-14 pb-28 space-y-5">
        <div className="pt-4">
          <h1 className="text-[32px] font-bold tracking-tight text-on-surface leading-tight">
            ¡Hola, {displayName}!
          </h1>
        </div>

        <StatCards />
        <VisitsList />
        <AlertsList />
        <ActivityList />
      </div>

      {/* ── DESKTOP (≥ md) ── */}
      <div className="hidden md:flex flex-col px-10 xl:px-16 pt-12 pb-16 gap-8 w-full max-w-[1400px] mx-auto">

        {/* Header row: título a la izquierda + acciones a la derecha */}
        <div className="flex items-center justify-between gap-6 pt-4">
          <h1 className="text-[48px] lg:text-[56px] font-bold tracking-tight text-on-surface leading-none">
            ¡Hola, {displayName}!
          </h1>
          {/* Actions bar: horizontal inline con el título */}
          <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm flex divide-x divide-outline-variant/15 shrink-0">
            {[
              { href: "/trabajos/nuevo", icon: <PlusCircle size={17} strokeWidth={2.5} />, label: "Nuevo Trabajo", color: "bg-primary" },
              { href: "/trabajos",       icon: <Briefcase  size={17} strokeWidth={2.5} />, label: "Ver Trabajos",  color: "bg-orange-500" },
              { href: "/clientes",       icon: <UserPlus   size={17} strokeWidth={2.5} />, label: "Clientes",      color: "bg-blue-500" },
              { href: "/agenda",         icon: <CalendarDays size={17} strokeWidth={2.5} />, label: "Agenda",     color: "bg-violet-500" },
            ].map(({ href, icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-5 py-4 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white shrink-0`} aria-hidden="true">
                  {icon}
                </div>
                <span className="text-[15px] font-medium text-on-surface hidden lg:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left: stats + alerts + activity */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
            <StatCards row />
            <AlertsList />
            <ActivityList />
          </div>
          {/* Right sidebar: visits */}
          <div className="col-span-12 lg:col-span-5">
            <VisitsList />
          </div>
        </div>

      </div>
    </>
  );
}
