"use client";

import { useState, useEffect, useMemo } from "react";
import { mockClients } from "../data/fixtures";
import { Building2, Sparkles, ArrowRight, Check, Clock, X } from "lucide-react";

const JOB_TITLE_SUGGESTIONS = [
  "Reforma integral",
  "Instalación eléctrica",
  "Pintura general",
  "Reparación de grietas",
  "Mantenimiento general",
  "Construcción nueva",
];

export default function VariantD() {
  const [clienteId, setClienteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinEstimada, setFechaFinEstimada] = useState("");

  const [step, setStep] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  const selectedClient = mockClients.find((c) => c.id === clienteId);

  const filteredClients = useMemo(
    () =>
      clientSearch
        ? mockClients.filter((c) =>
            c.nombre.toLowerCase().includes(clientSearch.toLowerCase())
          )
        : mockClients,
    [clientSearch]
  );

  // Smart defaults: set today for start, +30 days for end
  useEffect(() => {
    if (!fechaInicio) {
      const today = new Date();
      setFechaInicio(today.toISOString().split("T")[0]);
    }
    if (!fechaFinEstimada) {
      const estEnd = new Date();
      estEnd.setDate(estEnd.getDate() + 30);
      setFechaFinEstimada(estEnd.toISOString().split("T")[0]);
    }
  }, []);

  // Auto-fill address from client
  const handleClientSelect = (id: string) => {
    const client = mockClients.find((c) => c.id === id);
    setClienteId(id);
    if (client && !direccion) {
      setDireccion(client.direccion);
    }
    setShowClientSearch(false);
  };

  const canSave = clienteId !== "" && titulo.trim() !== "";

  const formatPresupuesto = (val: string) => {
    const num = Number(val.replace(/[^0-9]/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("es-AR");
  };

  return (
    <div className="w-full mx-auto">
      {/* Smart badge */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Funciones inteligentes activas
        </span>
      </div>

      <div className="space-y-6">
        {/* Step 1: Cliente con búsqueda */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
              Cliente *
            </label>
            <span className="text-[10px] text-on-surface-variant/30 font-medium">Paso 1 de 3</span>
          </div>

          <div className="relative">
            <div
              onClick={() => setShowClientSearch(true)}
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 flex items-center gap-3 cursor-pointer transition-all hover:border-primary/30"
            >
              <Building2 className="w-5 h-5 text-on-surface-variant/30 shrink-0" />
              {selectedClient ? (
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface">{selectedClient.nombre}</p>
                  <p className="text-xs text-on-surface-variant/50">{selectedClient.direccion}</p>
                </div>
              ) : (
                <span className="font-bold text-sm text-on-surface-variant/25 flex-1">
                  Buscar cliente...
                </span>
              )}
            </div>

            {showClientSearch && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/40" onClick={() => setShowClientSearch(false)} />
                <div className="relative bg-surface w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30" />
                        <input
                          type="text"
                          value={clientSearch}
                          onChange={(e) => setClientSearch(e.target.value)}
                          placeholder="Escribí para buscar..."
                          className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={() => {
                          setShowClientSearch(false);
                          setClientSearch("");
                        }}
                        className="p-2 rounded-xl hover:bg-on-surface/5 text-on-surface-variant"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-1 max-h-[280px] overflow-y-auto">
                      {filteredClients.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleClientSelect(c.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-on-surface/5 ${
                            clienteId === c.id ? "bg-primary/5" : ""
                          }`}
                        >
                          <Building2 className="w-4 h-4 text-on-surface-variant/30 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-on-surface">{c.nombre}</p>
                            <p className="text-xs text-on-surface-variant/40">{c.direccion}</p>
                          </div>
                          {clienteId === c.id && (
                            <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Título con sugerencias */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
              Título del trabajo *
            </label>
            <span className="text-[10px] text-on-surface-variant/30 font-medium">Paso 2 de 3</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Ej: Reforma integral de baño"
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />

            {showSuggestions && !titulo && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-outline-variant/20 rounded-2xl shadow-xl p-3 z-10 animate-in fade-in duration-150">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30 mb-2 px-2">
                  Sugerencias
                </p>
                <div className="space-y-1">
                  {JOB_TITLE_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setTitulo(s);
                        setShowSuggestions(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-on-surface hover:bg-on-surface/5 transition-all text-left"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none mt-3"
          />
        </div>

        {/* Step 3: Dirección con auto-fill hint */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Dirección
          </label>
          <div className="relative">
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección del trabajo"
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
            {selectedClient && direccion === selectedClient.direccion && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md uppercase tracking-wider">
              Auto
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Presupuesto y fechas */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Presupuesto ($)
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base font-bold text-on-surface-variant/30">
              $
            </span>
            <input
              type="text"
              value={presupuesto ? `$${formatPresupuesto(presupuesto)}` : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setPresupuesto(raw);
              }}
              placeholder="$0"
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-10 pr-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                Inicio
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-10 pr-4 py-4 text-base font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                Fin estimado
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/40" />
                <input
                  type="date"
                  value={fechaFinEstimada}
                  onChange={(e) => setFechaFinEstimada(e.target.value)}
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-10 pr-4 py-4 text-base font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="mt-8 pt-6 border-t border-outline-variant/10">
        <button
          disabled={!canSave}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            canSave
              ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
          }`}
        >
          <span>Crear Trabajo</span>
          <ArrowRight className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
