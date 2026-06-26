"use client";

import { useState } from "react";
import { mockClients } from "../data/fixtures";
import { Building2, MapPin, FileText, Calendar, DollarSign, Search } from "lucide-react";

export default function VariantC() {
  const [clienteId, setClienteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinEstimada, setFechaFinEstimada] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const selectedClient = mockClients.find((c) => c.id === clienteId);
  const canSave = clienteId !== "" && titulo.trim() !== "";

  return (
    <div className="w-full mx-auto">
      <div className="space-y-8">
        {/* Sección Cliente */}
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
              Cliente
            </h3>
          </div>

          <div className="relative">
            <div
              onClick={() => setShowClientDropdown(!showClientDropdown)}
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3.5 flex items-center gap-3 cursor-pointer transition-all hover:border-primary/30"
            >
              <Search className="w-4 h-4 text-on-surface-variant/30" />
              {selectedClient ? (
                <span className="font-bold text-sm text-on-surface flex-1">
                  {selectedClient.nombre}
                </span>
              ) : (
                <span className="font-bold text-sm text-on-surface-variant/25 flex-1">
                  Buscar o seleccionar cliente...
                </span>
              )}
            </div>

            {showClientDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-outline-variant/20 rounded-xl shadow-xl z-10 overflow-hidden animate-in fade-in duration-150">
                {mockClients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setClienteId(c.id);
                      setShowClientDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all hover:bg-on-surface/5 ${
                      clienteId === c.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-on-surface-variant/30 shrink-0" />
                    <div>
                      <p className="font-bold text-on-surface">{c.nombre}</p>
                      <p className="text-xs text-on-surface-variant/40">{c.direccion}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sección Detalle */}
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
              Detalle del trabajo
            </h3>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del trabajo"
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3.5 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30" />
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección"
                className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>

            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción (opcional)"
              rows={2}
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3.5 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
            />
          </div>
        </section>

        {/* Sección Presupuesto */}
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
              Presupuesto y fechas
            </h3>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant/30">
                $
              </span>
              <input
                type="number"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                placeholder="0"
                min={0}
                className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl pl-8 pr-4 py-3.5 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30" />
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30" />
                <input
                  type="date"
                  value={fechaFinEstimada}
                  onChange={(e) => setFechaFinEstimada(e.target.value)}
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Action bar */}
      <div className="mt-8 pt-6 border-t border-outline-variant/10">
        <button
          disabled={!canSave}
          className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${
            canSave
              ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
          }`}
        >
          Crear Trabajo
        </button>
      </div>
    </div>
  );
}
