"use client";

import { AlertCircle, Clock, PlusCircle, Briefcase, UserPlus, FileText, CalendarDays, ArrowRight } from "lucide-react";
import { mockAlerts, mockFinancial, mockJobs, mockVisits } from "../data/fixtures";

export function VariantB() {
  return (
    <div className="min-h-[800px] bg-grouped-bg-light relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute top-[100px] left-[-100px] w-[350px] h-[350px] bg-primary-container/15 blur-[120px] rounded-full" />
      </div>

      <main className="relative pt-4 pb-24">
        {/* HERO - Full width */}
        <section className="px-4 mb-5">
          <h1 className="text-[32px] leading-tight font-extrabold text-on-surface tracking-tight">
            ¡Hola, Francisco!
          </h1>
        </section>

        {/* ALERTS + FINANCIAL - Side by side */}
        <section className="px-4 mb-5">
          <div className="grid grid-cols-1 gap-3">
            {/* Alertas como banner compacto */}
            {mockAlerts.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-[20px] p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Alertas</span>
                </div>
                <div className="space-y-1.5">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        alert.tipo === "borrador" ? "bg-amber-500" : "bg-red-500"
                      }`} />
                      <p className="text-xs text-on-surface flex-1">{alert.mensaje}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial inline */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-[20px] p-4 border border-primary/20">
              <p className="text-[11px] font-medium text-primary/80 mb-1">Al terminar podés facturar</p>
              <p className="text-2xl font-bold text-primary">${mockFinancial.totalAFacturar.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* STATS ROW */}
        <section className="px-4 mb-5">
          <div className="bg-surface/80 rounded-[24px] p-4 border border-outline-variant/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-on-surface tracking-tight">12</p>
              <p className="text-[11px] font-semibold text-on-surface-variant">Presupuestos activos</p>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS - Grid 2 columnas */}
        <section className="px-4 mb-5">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="h-12 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white text-xs bg-primary hover:bg-primary-dark transition-all">
              <PlusCircle className="w-4 h-4" />
              Nuevo Trabajo
            </button>
            <button className="h-12 rounded-2xl flex items-center justify-center gap-2 font-semibold text-primary text-xs bg-primary/10 border border-primary/10 transition-all">
              <Briefcase className="w-4 h-4" />
              Ver Trabajos
            </button>
            <button className="col-span-2 h-10 rounded-xl flex items-center justify-center gap-2 font-semibold text-on-surface-variant text-xs bg-surface-variant/10 border border-outline-variant/10 transition-all">
              <UserPlus className="w-4 h-4" />
              Nuevo Cliente
            </button>
          </div>
        </section>

        {/* UPCOMING VISITS */}
        <section className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Próximas Visitas
            </h3>
            <span className="text-[10px] font-bold text-primary flex items-center gap-1">
              Ver agenda <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="bg-surface/80 rounded-[24px] border border-outline-variant/20 overflow-hidden">
            {mockVisits.map((visit) => (
              <div key={visit.id} className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.04] last:border-0">
                <div className="w-9 h-9 rounded-[12px] bg-primary/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-on-surface truncate">{visit.job}</div>
                  <div className="text-[10px] text-on-surface-variant">{visit.day} • {visit.time}</div>
                </div>
                <span className="text-[10px] font-semibold text-on-surface-variant">{visit.client}</span>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="px-4">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
            Actividad Reciente
          </h3>
          <div className="bg-surface/80 rounded-[24px] border border-outline-variant/20 overflow-hidden">
            {mockJobs.slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.04] last:border-0">
                <div className="w-9 h-9 rounded-[12px] bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {job.cliente.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-on-surface truncate">{job.titulo}</div>
                  <div className="text-[10px] text-on-surface-variant">{job.cliente}</div>
                </div>
                <span className="text-xs font-semibold text-on-surface">${job.presupuesto.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
