"use client";

import { LabShell } from "./components/LabShell";
import VariantA from "./variants/VariantA";
import VariantB from "./variants/VariantB";
import VariantC from "./variants/VariantC";
import VariantD from "./variants/VariantD";
import VariantE from "./variants/VariantE";

export default function DesignLabPage() {
  const variants = [
    {
      id: "A",
      label: "Pasos progresivos",
      rationale:
        "Formulario dividido en 3 pasos con indicador de progreso. Ideal para reducir la carga cognitiva — cada paso pide solo la información necesaria.",
      children: <VariantA />,
    },
    {
      id: "B",
      label: "Secciones colapsables",
      rationale:
        "Acordeón con secciones expandibles. Todo visible de un vistazo, pero cada sección se abre solo cuando la necesitás. Buen balance entre densidad y claridad.",
      children: <VariantB />,
    },
    {
      id: "C",
      label: "Compacto tipo Linear/Stripe",
      rationale:
        "Página única densa con secciones bien definidas y buscador de cliente inline. Inspirado en la eficiencia visual de Linear y Stripe.",
      children: <VariantC />,
    },
    {
      id: "D",
      label: "Smart defaults + autocomplete",
      rationale:
        "Auto-completa dirección del cliente, fecha de inicio = hoy, fin = +30 días. Búsqueda de clientes con modal, sugerencias de títulos. Mínimo esfuerzo del usuario.",
      children: <VariantD />,
    },
    {
      id: "E",
      label: "Flow conversacional",
      rationale:
        "Pregunta por pregunta, como un chat. Ideal para usuarios no técnicos — solo ven una cosa a la vez. Barras de progreso sutiles y navegación simple.",
      children: <VariantE />,
    },
  ];

  return <LabShell targetName="Nuevo Trabajo" variants={variants} />;
}
