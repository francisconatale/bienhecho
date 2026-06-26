"use client";

import React from "react";
import { VariantA } from "../../../.claude-design/lab/variants/VariantA";
import { VariantB } from "../../../.claude-design/lab/variants/VariantB";
import { VariantC } from "../../../.claude-design/lab/variants/VariantC";
import { VariantD } from "../../../.claude-design/lab/variants/VariantD";
import { VariantE } from "../../../.claude-design/lab/variants/VariantE";
import { FeedbackOverlay } from "./FeedbackOverlay";

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-grouped-bg-light text-on-background pb-32">
      <header className="bg-surface border-b border-outline-variant/20 p-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-on-surface">Design Lab: Trabajos</h1>
            <p className="text-on-surface-variant font-medium mt-1">Compará las variantes de diseño y dejá tu feedback</p>
          </div>
          <div className="text-right hidden md:block text-sm text-on-surface-variant max-w-sm">
            <span className="font-bold">Brief:</span> Mostrar lista de trabajos directamente. Explorar master-detail, boards o vistas limpias. Aurora + Glassmorphism.
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-16 mt-8">
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center">A</span>
              Jerarquía e Información
            </h2>
            <p className="text-on-surface-variant text-sm">Enfoque en la proximidad y lectura rápida de estados y precios.</p>
          </div>
          <div data-variant="A" className="ring-1 ring-outline-variant/20 rounded-3xl overflow-hidden shadow-2xl">
            <VariantA />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center">B</span>
              Tablero Kanban
            </h2>
            <p className="text-on-surface-variant text-sm">Ideal para flujos de trabajo basados en estados de facturación.</p>
          </div>
          <div data-variant="B" className="ring-1 ring-outline-variant/20 rounded-3xl overflow-hidden shadow-2xl">
            <VariantB />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center">C</span>
              Densidad y Tabla
            </h2>
            <p className="text-on-surface-variant text-sm">Vista compacta para cuando la cantidad de trabajos escala rápidamente.</p>
          </div>
          <div data-variant="C" className="ring-1 ring-outline-variant/20 rounded-3xl overflow-hidden shadow-2xl">
            <VariantC />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center">D</span>
              Master-Detail
            </h2>
            <p className="text-on-surface-variant text-sm">Patrón dividido. Navegación rápida en la izquierda, detalles a la derecha.</p>
          </div>
          <div data-variant="D" className="ring-1 ring-outline-variant/20 rounded-3xl overflow-hidden shadow-2xl">
            <VariantD />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center">E</span>
              Expresivo (Premium Aurora)
            </h2>
            <p className="text-on-surface-variant text-sm">Diseño de alto nivel con transparencias extremas y fondos difuminados.</p>
          </div>
          <div data-variant="E" className="ring-1 ring-outline-variant/20 rounded-3xl overflow-hidden shadow-2xl bg-black">
            <VariantE />
          </div>
        </section>
      </main>

      <FeedbackOverlay targetName="Trabajos" />
    </div>
  );
}
