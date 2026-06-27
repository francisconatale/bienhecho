"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ArrowRight, Building2, Check, Sparkles, Calendar, MapPin, DollarSign, FileText } from "lucide-react";
import Link from "next/link";
import { useDataStore } from "@/lib/store";

const questions = [
  { id: "cliente", question: "¿Para qué cliente es este trabajo?", hint: "Seleccioná un cliente existente" },
  { id: "titulo", question: "¿Cómo se llama el trabajo?", hint: "Dale un nombre descriptivo" },
  { id: "direccion", question: "¿Dónde se realiza?", hint: "Dirección del trabajo (opcional)" },
  { id: "presupuesto", question: "¿Cuál es el presupuesto?", hint: "Monto total estimado" },
  { id: "fechas", question: "¿Cuándo arranca y termina?", hint: "Fechas estimadas (opcional)" },
  { id: "resumen", question: "Revisá los datos antes de crear", hint: "Todo en orden?" },
];

function NuevoTrabajoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clients, addJob } = useDataStore();

  const preselectId = searchParams.get("clienteId");
  const [currentQ, setCurrentQ] = useState(preselectId ? 1 : 0);
  const [clienteId, setClienteId] = useState(preselectId || "");
  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinEstimada, setFechaFinEstimada] = useState("");

  const question = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const canSave = clienteId !== "" && titulo.trim() !== "";

  const canAdvance = () => {
    if (currentQ === 0) return clienteId !== "";
    if (currentQ === 1) return titulo.trim() !== "";
    return true;
  };

  const next = () => {
    if (currentQ < questions.length - 1) setCurrentQ((q) => q + 1);
  };

  const prev = () => {
    if (currentQ > 0) setCurrentQ((q) => q - 1);
  };

  const handleSave = () => {
    if (!canSave) return;
    const newJob = addJob({
      cliente_id: clienteId,
      titulo: titulo.trim(),
      direccion: direccion.trim(),
      descripcion: descripcion.trim() || undefined,
      presupuesto: presupuesto ? Number(presupuesto) : 0,
      fecha_inicio: fechaInicio || undefined,
      fecha_fin_estimada: fechaFinEstimada || undefined,
    });
    router.push(`/trabajos/${newJob.id}`);
  };

  return (
    <main className="flex-1 px-4 py-6 pb-28 mt-20 md:px-8 md:py-8 md:pb-12 max-w-xl md:max-w-2xl mx-auto w-full md:mt-0 transition-all">
      <div className="flex items-center gap-3 mb-5">
        <Link href={preselectId ? `/clientes?clienteId=${preselectId}` : "/trabajos"}>
          <button
            aria-label="Volver"
            className="w-9 h-9 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-center hover:bg-on-surface/5 transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-on-surface" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
            Nuevo Trabajo
          </h1>
          <p className="text-sm text-on-surface-variant/60 mt-0.5">
            Respondé paso a paso para crear un nuevo trabajo.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-[32px] p-5 md:p-6 border border-outline-variant/10 shadow-sm">
        {/* Progress bar */}
        <div className="flex items-center gap-1.5 mb-5">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= currentQ ? "bg-primary" : "bg-on-surface/10"
              }`}
            />
          ))}
        </div>

        <div className="min-h-[260px] flex flex-col">
          <div className="mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
              Paso {currentQ + 1} de {questions.length}
            </span>
          </div>

          <h2 className="text-lg font-bold tracking-tight text-on-surface mb-1">
            {question.question}
          </h2>
          <p className="text-sm text-on-surface-variant/50 mb-5">
            {question.hint}
          </p>

          <div className="flex-1 space-y-3">
            {currentQ === 0 && (
              <div className="space-y-1.5">
                {clients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setClienteId(c.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                      clienteId === c.id
                        ? "border-primary bg-primary/5"
                        : "border-outline-variant/20 bg-on-surface/5 hover:bg-on-surface/10"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-on-surface">{c.nombre}</p>
                      <p className="text-xs text-on-surface-variant/50 truncate">{c.direccion}</p>
                    </div>
                    {clienteId === c.id && (
                      <Check className="w-4 h-4 text-primary shrink-0" strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {currentQ === 1 && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Reforma integral de cocina"
                  className="input-field"
                  autoFocus
                />
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Contá un poco de qué se trata (opcional)..."
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
            )}

            {currentQ === 2 && (
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Av. Corrientes 1234"
                className="input-field"
                autoFocus
              />
            )}

            {currentQ === 3 && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-on-surface-variant/40 pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  placeholder="0"
                  min={0}
                  className="input-field pl-8"
                  autoFocus
                />
              </div>
            )}

            {currentQ === 4 && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mb-1.5 block">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="input-field"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mb-1.5 block">
                    Fecha fin estimada
                  </label>
                  <input
                    type="date"
                    value={fechaFinEstimada}
                    onChange={(e) => setFechaFinEstimada(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {currentQ === 5 && (
              <div className="space-y-3">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                        Cliente
                      </p>
                      <p className="font-semibold text-sm text-on-surface">
                        {clients.find((c) => c.id === clienteId)?.nombre || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-on-surface/5 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-on-surface-variant/40 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                        Título
                      </p>
                      <p className="font-semibold text-sm text-on-surface">{titulo}</p>
                      {descripcion && (
                        <p className="text-xs text-on-surface-variant/70 mt-1">{descripcion}</p>
                      )}
                    </div>
                  </div>
                </div>

                {direccion && (
                  <div className="bg-on-surface/5 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-on-surface-variant/40 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                          Dirección
                        </p>
                        <p className="font-semibold text-sm text-on-surface">{direccion}</p>
                      </div>
                    </div>
                  </div>
                )}

                {presupuesto && (
                  <div className="bg-on-surface/5 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-4 h-4 text-on-surface-variant/40 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                          Presupuesto
                        </p>
                        <p className="font-semibold text-sm text-on-surface">
                          ${Number(presupuesto).toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(fechaInicio || fechaFinEstimada) && (
                  <div className="bg-on-surface/5 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-on-surface-variant/40 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                          Fechas
                        </p>
                        <p className="font-semibold text-sm text-on-surface">
                          {fechaInicio || "—"} {fechaFinEstimada ? `→ ${fechaFinEstimada}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant/10">
          <button
            onClick={prev}
            disabled={currentQ === 0}
            className={`text-sm font-semibold transition-all cursor-pointer ${
              currentQ === 0
                ? "text-on-surface-variant/20 cursor-not-allowed"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            ← Anterior
          </button>

          {!isLast ? (
            <button
              onClick={next}
              disabled={!canAdvance()}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer ${
                canAdvance()
                  ? "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary-dark active:scale-95"
                  : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
              }`}
            >
              Siguiente
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer ${
                canSave
                  ? "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary-dark active:scale-95"
                  : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              Crear Trabajo
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function NuevoTrabajoPage() {
  return (
    <Suspense>
      <NuevoTrabajoForm />
    </Suspense>
  );
}
