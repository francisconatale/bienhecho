"use client";

import { AlertCircle, Clock, PlusCircle, Briefcase, UserPlus, FileText, ChevronRight, CalendarDays } from "lucide-react";
import { mockAlerts, mockFinancial, mockJobs, mockVisits } from "../data/fixtures";

export function VariantA() {
  return (
    <div className="min-h-[800px] bg-grouped-bg-light relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute top-[100px] left-[-100px] w-[350px] h-[350px] bg-primary-container/15 blur-[120px] rounded-full" />
      </div>

      <main className="relative pt-4 pb-24">
        {/* ALERTS - PRIMERO - Compact banner style */}
        <section className="px-4 mb-4">
          <div className="space-y-2">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-surface/80 border border-outline-variant/10 backdrop-blur-xl"
              >
                <div className={`p-1.5 rounded-full ${
                  alert.tipo === "borrador"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-red-500/10 text-red-500"
                }`}>
                  {alert.tipo === "borrador" ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <p className="text-xs font-medium text-on-surface flex-1">{alert.mensaje}</p>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
              </div>
            ))}
          </div>
        </section>

        {/* HERO - Simplificado */}
        <section className="px-4 mb-6">
          <h1 className="text-[32px] leading-tight font-extrabold text-on-surface tracking-tight">
            ¡Hola, Francisco!
          </h1>
        </section>

        {/* STATS + FINANCIAL - Grid compacto */}
        <section className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface/80 rounded-[24px] p-4 border border-outline-variant/20">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-on-surface tracking-tight">12</p>
              <p className="text-[11px] font-semibold text-on-surface-variant mt-0.5">Presupuestos</p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-[24px] p-4 border border-primary/20">
              <p className="text-[11px] font-medium text-primary/80 mb-1">A facturar</p>
              <p className="text-2xl font-bold text-primary">${mockFinancial.totalAFacturar.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS - Horizontal scroll compacto */}
        <section className="px-4 mb-6">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
            Acciones
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-white text-xs font-semibold shrink-0">
              <PlusCircle className="w-4 h-4" />
              Nuevo Trabajo
            </button>
            <button className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary/10 text-primary text-xs font-semibold shrink-0 border border-primary/10">
              <Briefcase className="w-4 h-4" />
              Ver Trabajos
            </button>
            <button className="flex items-center gap-2 px-4 h-10 rounded-xl bg-surface-variant/10 text-on-surface-variant text-xs font-semibold shrink-0 border border-outline-variant/10">
              <UserPlus className="w-4 h-4" />
              Nuevo Cliente
            </button>
          </div>
        </section>

        {/* UPCOMING VISITS - Compact */}
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Próximas Visitas
            </h3>
            <span className="text-[10px] font-bold text-primary">Ver agenda</span>
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
