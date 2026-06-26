"use client";

import { LabShell } from "./components/LabShell";
import VariantA from "./variants/VariantA";
import VariantB from "./variants/VariantB";
import VariantC from "./variants/VariantC";
import VariantD from "./variants/VariantD";
import VariantE from "./variants/VariantE";
import { FeedbackOverlay } from "./FeedbackOverlay";

const variants = [
  {
    id: "A",
    label: "Pasos progresivos",
    rationale:
      "Formulario dividido en 3 pasos con indicador de progreso. Ideal para reducir la carga cognitiva.",
    children: <VariantA />,
  },
  {
    id: "B",
    label: "Secciones colapsables",
    rationale:
      "Acordeón con secciones expandibles. Todo visible de un vistazo, cada sección se abre solo cuando la necesitás.",
    children: <VariantB />,
  },
  {
    id: "C",
    label: "Compacto tipo Linear/Stripe",
    rationale:
      "Página única densa con secciones bien definidas y buscador inline. Inspirado en Linear y Stripe.",
    children: <VariantC />,
  },
  {
    id: "D",
    label: "Smart defaults + autocomplete",
    rationale:
      "Auto-completa dirección del cliente, fecha inicio= hoy, fin= +30 días. Búsqueda y sugerencias.",
    children: <VariantD />,
  },
  {
    id: "E",
    label: "Flow conversacional",
    rationale:
      "Pregunta por pregunta, como un chat. Ideal para usuarios no técnicos.",
    children: <VariantE />,
  },
];

export default function LabRoute() {
  return (
    <>
      <LabShell targetName="Nuevo Trabajo" variants={variants} />
      <FeedbackOverlay targetName="Nuevo Trabajo" />
    </>
  );
}
