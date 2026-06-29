"use client";

import { AlertCircle, Clock, PlusCircle, Briefcase, UserPlus, FileText, CalendarDays } from "lucide-react";
import { mockAlerts, mockFinancial, mockJobs, mockVisits } from "../data/fixtures";

export function VariantC() {
  return (
    <div className="min-h-[800px] bg-grouped-bg-light relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute top-[100px] left-[-100px] w-[350px] h-[350px] bg-primary-container/15 blur-[120px] rounded-full" />
      </div>

      <main className="relative pt-4 pb-24 px-4">
        {/* HERO - Minimal */}
        <section className="mb-5">
          <h1 className="text-[28px] leading-tight font-extrabold text-on-surface tracking-tight">
            ¡Hola, Francisco!
          </h1>
        </section>

        {/* ALERTS - Floating card */}
        <section className="mb-4">
          <div className="bg-surface/30 backdrop-blur-2xl rounded-[24px] p-4 border border-outline-variant/10 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pendientes</span>
            </div>
            <div className="space-y-2">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface/50 border border-outline-variant/5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    alert.tipo === "borrador" ? "bg-amber-500" : "bg-red-500"
                  }`} />
                  <p className="text-xs font-medium text-on-surface flex-1">{alert.mensaje}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS - Glassmorphic cards */}
        <section className="mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface/30 backdrop-blur-2xl rounded-[20px] p-4 border border-outline-variant/10">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-on-surface tracking-tight">12</p>
              <p className="text-[10px] font-semibold text-on-surface-variant">Presupuestos</p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-2xl rounded-[20px] p-4 border border-primary/20">
              <p className="text-[10px] font-medium text-primary/80 mb-1">A facturar</p>
              <p className="text-xl font-bold text-primary">${mockFinancial.totalAFacturar.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS - Icon buttons */}
        <section className="mb-5">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
            Acciones
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button className="h-14 rounded-2xl flex flex-col items-center justify-center gap-1 font-semibold text-white text-[10px] bg-primary">
              <PlusCircle className="w-5 h-5" />
              Nuevo
            </button>
            <button className="h-14 rounded-2xl flex flex-col items-center justify-center gap-1 font-semibold text-primary text-[10px] bg-primary/10 border border-primary/10">
              <Briefcase className="w-5 h-5" />
              Trabajos
            </button>
            <button className="h-14 rounded-2xl flex flex-col items-center justify-center gap-1 font-semibold text-on-surface-variant text-[10px] bg-surface-variant/10 border border-outline-variant/10">
              <UserPlus className="w-5 h-5" />
              Cliente
            </button>
          </div>
        </section>

        {/* UPCOMING VISITS - Glassmorphic */}
        <section className="mb-5">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
            Próximas Visitas
          </h3>
          <div className="bg-surface/30 backdrop-blur-2xl rounded-[24px] border border-outline-variant/10 overflow-hidden shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
            {mockVisits.map((visit) => (
              <div key={visit.id} className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/5 last:border-0">
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

        {/* RECENT ACTIVITY - Glassmorphic */}
        <section>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
            Actividad Reciente
          </h3>
          <div className="bg-surface/30 backdrop-blur-2xl rounded-[24px] border border-outline-variant/10 overflow-hidden shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
            {mockJobs.slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/5 last:border-0">
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
