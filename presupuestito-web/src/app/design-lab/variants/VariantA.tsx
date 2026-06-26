"use client";

import { useState } from "react";
import { mockClients } from "../data/fixtures";
import { Check, ChevronLeft, ChevronRight, Building2, FileText, DollarSign } from "lucide-react";

type Step = "cliente" | "detalle" | "presupuesto";

const steps: { id: Step; label: string; icon: typeof Building2 }[] = [
  { id: "cliente", label: "Cliente", icon: Building2 },
  { id: "detalle", label: "Detalle", icon: FileText },
  { id: "presupuesto", label: "Presupuesto y fechas", icon: DollarSign },
];

export default function VariantA() {
  const [currentStep, setCurrentStep] = useState<Step>("cliente");

  const [clienteId, setClienteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinEstimada, setFechaFinEstimada] = useState("");

  const stepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const canGoNext = () => {
    if (currentStep === "cliente") return clienteId !== "";
    if (currentStep === "detalle") return titulo.trim() !== "";
    if (currentStep === "presupuesto") return true;
    return false;
  };

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                  i < stepIndex
                    ? "bg-primary text-white"
                    : i === stepIndex
                    ? "bg-primary/10 text-primary ring-2 ring-primary/30"
                    : "bg-on-surface/5 text-on-surface-variant/40"
                }`}
              >
                {i < stepIndex ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider hidden sm:block ${
                  i === stepIndex
                    ? "text-primary"
                    : i < stepIndex
                    ? "text-on-surface"
                    : "text-on-surface-variant/40"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-on-surface/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5 min-h-[320px]">
        {/* Step 1: Cliente */}
        {currentStep === "cliente" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
              Seleccionar Cliente *
            </label>
            <div className="grid gap-2">
              {mockClients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClienteId(c.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all ${
                    clienteId === c.id
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-on-surface/5 hover:bg-on-surface/10"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-on-surface">
                      {c.nombre}
                    </p>
                    <p className="text-xs text-on-surface-variant/60">
                      {c.direccion}
                    </p>
                  </div>
                  {clienteId === c.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Detalle */}
        {currentStep === "detalle" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                Título del trabajo *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Reforma integral de cocina"
                className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                Dirección
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección donde se realiza el trabajo"
                className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalles del trabajo, alcance, notas..."
                rows={3}
                className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Presupuesto */}
        {currentStep === "presupuesto" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                Presupuesto ($)
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-on-surface-variant/30">
                  $
                </span>
                <input
                  type="number"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  placeholder="0"
                  min={0}
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-10 pr-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                  Fecha fin estimada
                </label>
                <input
                  type="date"
                  value={fechaFinEstimada}
                  onChange={(e) => setFechaFinEstimada(e.target.value)}
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant/10">
        <button
          onClick={prevStep}
          disabled={stepIndex === 0}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
            stepIndex === 0
              ? "text-on-surface-variant/20 cursor-not-allowed"
              : "text-on-surface-variant hover:bg-on-surface/5"
          }`}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          Volver
        </button>

        {stepIndex < steps.length - 1 ? (
          <button
            onClick={nextStep}
            disabled={!canGoNext()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
              canGoNext()
                ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95"
                : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
            }`}
          >
            Continuar
            <ChevronRight className="w-4 h-4" strokeWidth={3} />
          </button>
        ) : (
          <button
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all"
          >
            Crear Trabajo
          </button>
        )}
      </div>
    </div>
  );
}
