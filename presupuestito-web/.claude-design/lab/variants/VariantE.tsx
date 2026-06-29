"use client";

import { AlertCircle, Clock, PlusCircle, Briefcase, UserPlus, FileText, CalendarDays, List, LayoutGrid } from "lucide-react";
import { mockAlerts, mockFinancial, mockJobs, mockVisits } from "../data/fixtures";
import { useState } from "react";

export function VariantE() {
  const [activeTab, setActiveTab] = useState<"resumen" | "actividad">("resumen");

  return (
    <div className="min-h-[800px] bg-grouped-bg-light relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute top-[100px] left-[-100px] w-[350px] h-[350px] bg-primary-container/15 blur-[120px] rounded-full" />
      </div>

      <main className="relative pt-4 pb-24 px-4">
        {/* HERO */}
        <section className="mb-4">
          <h1 className="text-[28px] leading-tight font-extrabold text-on-surface tracking-tight">
            ¡Hola, Francisco!
          </h1>
        </section>

        {/* ALERTS - Sticky banner */}
        <section className="mb-4">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-1.5 rounded-full bg-amber-500/10">
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-on-surface">
                {mockAlerts.length} alerta{mockAlerts.length > 1 ? "s" : ""} pendiente{mockAlerts.length > 1 ? "s" : ""}
              </p>
            </div>
            <button className="text-[10px] font-bold text-amber-600">Ver</button>
          </div>
        </section>

        {/* STATS ROW */}
        <section className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface/80 rounded-[20px] p-3 border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-semibold text-on-surface-variant">Presupuestos</span>
              </div>
              <p className="text-xl font-bold text-on-surface">12</p>
            </div>
            <div className="bg-primary/5 rounded-[20px] p-3 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold text-primary/70">A facturar</span>
              </div>
              <p className="text-xl font-bold text-primary">${mockFinancial.totalAFacturar.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            <button className="h-12 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-white text-[11px] bg-primary">
              <PlusCircle className="w-4 h-4" />
              Nuevo
            </button>
            <button className="h-12 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-primary text-[11px] bg-primary/10 border border-primary/10">
              <Briefcase className="w-4 h-4" />
              Trabajos
            </button>
            <button className="h-12 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-on-surface-variant text-[11px] bg-surface-variant/10 border border-outline-variant/10">
              <UserPlus className="w-4 h-4" />
              Cliente
            </button>
          </div>
        </section>

        {/* TABS */}
        <section className="mb-4">
          <div className="flex gap-1 p-1 bg-surface/50 rounded-xl border border-outline-variant/10">
            <button
              onClick={() => setActiveTab("resumen")}
              className={`flex-1 h-8 rounded-lg text-[11px] font-semibold transition-all ${
                activeTab === "resumen"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab("actividad")}
              className={`flex-1 h-8 rounded-lg text-[11px] font-semibold transition-all ${
                activeTab === "actividad"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Actividad
            </button>
          </div>
        </section>

        {/* TAB CONTENT */}
        {activeTab === "resumen" ? (
          <>
            {/* UPCOMING VISITS */}
            <section className="mb-4">
              <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">
                Próximas Visitas
              </h3>
              <div className="bg-surface/80 rounded-[20px] border border-outline-variant/10 overflow-hidden">
                {mockVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-outline-variant/5 last:border-0">
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

            {/* ALERTS DETAIL */}
            <section>
              <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">
                Alertas Detalle
              </h3>
              <div className="space-y-2">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-outline-variant/10">
                    <div className={`p-1.5 rounded-full ${
                      alert.tipo === "borrador"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {alert.tipo === "borrador" ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-on-surface flex-1">{alert.mensaje}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* ACTIVITY TAB */
          <section>
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">
              Actividad Reciente
            </h3>
            <div className="bg-surface/80 rounded-[20px] border border-outline-variant/10 overflow-hidden">
              {mockJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-outline-variant/5 last:border-0">
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
        )}
      </main>
    </div>
  );
}
