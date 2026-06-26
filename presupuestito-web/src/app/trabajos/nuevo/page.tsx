"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ArrowRight, Building2, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useDataStore } from "@/lib/store";

const questions = [
  { id: "cliente", question: "¿Para qué cliente es este trabajo?", hint: "Seleccioná un cliente existente" },
  { id: "titulo", question: "¿Cómo se llama el trabajo?", hint: "Dale un nombre descriptivo" },
  { id: "direccion", question: "¿Dónde se realiza?", hint: "Dirección del trabajo (opcional)" },
  { id: "presupuesto", question: "¿Cuál es el presupuesto?", hint: "Monto total estimado" },
  { id: "fechas", question: "¿Cuándo arranca y termina?", hint: "Fechas estimadas (opcional)" },
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
    if (preselectId) {
      router.push(`/clientes?clienteId=${clienteId}`);
    } else {
      router.push(`/trabajos/${newJob.id}`);
    }
  };

  return (
    <main className="flex-1 pb-32 w-full pt-10 transition-all max-w-2xl mx-auto px-4 md:px-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={preselectId ? `/clientes?clienteId=${clienteId}` : "/"}>
          <button
            aria-label="Volver"
            className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center hover:bg-on-surface/5 transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-on-surface" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-on-surface">
            Nuevo Trabajo
          </h1>
          <p className="text-sm text-on-surface-variant/60 font-medium mt-1">
            Respondé paso a paso para crear un nuevo trabajo.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-[32px] p-6 md:p-8 border border-outline-variant/10 shadow-sm">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= currentQ ? "bg-primary" : "bg-on-surface/10"
              }`}
            />
          ))}
        </div>

        <div className="min-h-[280px] flex flex-col">
          <div className="mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">
              Pregunta {currentQ + 1} de {questions.length}
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-on-surface mb-1.5">
            {question.question}
          </h2>
          <p className="text-sm text-on-surface-variant/50 font-medium mb-6">
            {question.hint}
          </p>

          <div className="flex-1">
            {currentQ === 0 && (
              <div className="space-y-2">
                {clients.map((c) => (
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
                      <p className="font-bold text-sm text-on-surface">{c.nombre}</p>
                      <p className="text-xs text-on-surface-variant/50">{c.direccion}</p>
                    </div>
                    {clienteId === c.id && (
                      <Check className="w-5 h-5 text-primary" strokeWidth={3} />
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
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-lg font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  autoFocus
                />
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Contá un poco de qué se trata (opcional)..."
                  rows={2}
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                />
              </div>
            )}

            {currentQ === 2 && (
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Av. Corrientes 1234"
                className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-lg font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                autoFocus
              />
            )}

            {currentQ === 3 && (
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
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-10 pr-5 py-4 text-lg font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  autoFocus
                />
              </div>
            )}

            {currentQ === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    autoFocus
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
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant/10">
          <button
            onClick={prev}
            disabled={currentQ === 0}
            className={`text-sm font-bold transition-all ${
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                canAdvance()
                  ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95"
                  : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
              }`}
            >
              Siguiente
              <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                canSave
                  ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95"
                  : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-4 h-4" strokeWidth={3} />
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
