"use client";

import { AlertCircle, Clock, PlusCircle, Briefcase, UserPlus, FileText, CalendarDays } from "lucide-react";
import { mockAlerts, mockFinancial, mockJobs, mockVisits } from "../data/fixtures";

export function VariantD() {
  return (
    <div className="min-h-[800px] bg-grouped-bg-light relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute top-[100px] left-[-100px] w-[350px] h-[350px] bg-primary-container/15 blur-[120px] rounded-full" />
      </div>

      <main className="relative pt-4 pb-24 px-4">
        {/* HERO - Ultra minimal */}
        <section className="mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] leading-tight font-extrabold text-on-surface tracking-tight">
              ¡Hola, Francisco!
            </h1>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              FP
            </div>
          </div>
        </section>

        {/* ALERTS + FINANCIAL - Stacked cards */}
        <section className="mb-4 space-y-2">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-outline-variant/10 shadow-sm"
            >
              <div className={`p-2 rounded-full ${
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
            </div>
          ))}

          {/* Financial inline */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-primary/70 font-medium">A facturar</p>
              <p className="text-lg font-bold text-primary">${mockFinancial.totalAFacturar.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS - Floating pills */}
        <section className="mb-5">
          <div className="flex gap-2">
            <button className="flex-1 h-11 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white text-xs bg-primary">
              <PlusCircle className="w-4 h-4" />
              Nuevo Trabajo
            </button>
            <button className="h-11 w-11 rounded-2xl flex items-center justify-center bg-primary/10 text-primary border border-primary/10">
              <Briefcase className="w-4 h-4" />
            </button>
            <button className="h-11 w-11 rounded-2xl flex items-center justify-center bg-surface-variant/10 text-on-surface-variant border border-outline-variant/10">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* UPCOMING VISITS - Compact */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Próximas Visitas
            </h3>
            <span className="text-[10px] font-bold text-primary">Ver agenda →</span>
          </div>
          <div className="space-y-1.5">
            {mockVisits.map((visit) => (
              <div key={visit.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-outline-variant/10">
                <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-3.5 h-3.5 text-primary" />
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
        <section>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">
            Actividad Reciente
          </h3>
          <div className="space-y-1.5">
            {mockJobs.slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-outline-variant/10">
                <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {job.cliente.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-on-surface truncate">{job.titulo}</div>
                  <div className="text-[10px] text-on-surface-variant">{job.cliente}</div>
                </div>
                <span className="text-[11px] font-semibold text-on-surface">${job.presupuesto.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
