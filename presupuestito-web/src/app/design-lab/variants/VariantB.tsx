"use client";

import { useState } from "react";
import { mockClients } from "../data/fixtures";
import { ChevronDown, Building2, MapPin, FileText, Calendar } from "lucide-react";

interface Section {
  id: string;
  label: string;
  icon: typeof Building2;
  isOpen: boolean;
}

export default function VariantB() {
  const [clienteId, setClienteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinEstimada, setFechaFinEstimada] = useState("");

  const [sections, setSections] = useState<Section[]>([
    { id: "cliente", label: "Cliente", icon: Building2, isOpen: true },
    { id: "detalle", label: "Título y descripción", icon: FileText, isOpen: false },
    { id: "direccion", label: "Dirección", icon: MapPin, isOpen: false },
    { id: "fechas", label: "Presupuesto y fechas", icon: Calendar, isOpen: false },
  ]);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        isOpen: s.id === id ? !s.isOpen : false,
      }))
    );
  };

  const canSave = clienteId !== "" && titulo.trim() !== "";

  return (
    <div className="w-full mx-auto space-y-3">
      {sections.map((section) => {
        const Icon = section.icon;
        const isComplete = section.id === "cliente" ? clienteId !== "" : false;

        return (
          <div
            key={section.id}
            className={`rounded-2xl border transition-all ${
              section.isOpen
                ? "border-primary/20 bg-surface shadow-sm"
                : "border-outline-variant/10 bg-on-surface/[0.02]"
            }`}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    section.isOpen
                      ? "bg-primary/10 text-primary"
                      : "bg-on-surface/5 text-on-surface-variant/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`font-bold text-sm ${
                    section.isOpen ? "text-on-surface" : "text-on-surface-variant/60"
                  }`}
                >
                  {section.label}
                </span>
                {isComplete && (
                  <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                    COMPLETO
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-on-surface-variant/40 transition-transform duration-200 ${
                  section.isOpen ? "rotate-180" : ""
                }`}
                strokeWidth={3}
              />
            </button>

            {section.isOpen && (
              <div className="px-5 pb-5 pt-1 border-t border-outline-variant/5 animate-in fade-in slide-in-from-top-2 duration-200">
                {section.id === "cliente" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                      Seleccionar Cliente *
                    </label>
                    <div className="grid gap-1.5">
                      {mockClients.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setClienteId(c.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            clienteId === c.id
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-on-surface/5 text-on-surface"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 opacity-40" />
                            <span>{c.nombre}</span>
                          </div>
                          {clienteId === c.id && (
                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                              SELECCIONADO
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {section.id === "detalle" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ej: Reforma integral"
                        className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                        Descripción
                      </label>
                      <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Detalles del trabajo..."
                        rows={2}
                        className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {section.id === "direccion" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                      Dirección del trabajo
                    </label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Dirección donde se realiza"
                      className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                    <p className="text-[11px] text-on-surface-variant/40 font-medium">
                      Puede diferir de la dirección del cliente
                    </p>
                  </div>
                )}

                {section.id === "fechas" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                        Presupuesto ($)
                      </label>
                      <input
                        type="number"
                        value={presupuesto}
                        onChange={(e) => setPresupuesto(e.target.value)}
                        placeholder="0"
                        min={0}
                        className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                          Inicio
                        </label>
                        <input
                          type="date"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                          Fin estimado
                        </label>
                        <input
                          type="date"
                          value={fechaFinEstimada}
                          onChange={(e) => setFechaFinEstimada(e.target.value)}
                          className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Save button */}
      <button
        disabled={!canSave}
        className={`w-full mt-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${
          canSave
            ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
            : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
        }`}
      >
        Crear Trabajo
      </button>
    </div>
  );
}
