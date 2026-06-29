export const jobs = [
  { id: "1", title: "Reforma Integral Centro", client: "Constructora del Sur", status: "active", amount: 25000, date: "29/6/2026" },
  { id: "2", title: "Diseño Oficinas M&P", client: "Estudio de Arquitectura M&P", status: "completed", amount: 15000, date: "28/6/2026" },
  { id: "3", title: "Mantenimiento Edificio Las Heras", client: "Consorcio Las Heras", status: "pending", amount: 5000, date: "25/6/2026" },
];

export const alerts = [
  { id: "a1", text: "Falta emitir presupuesto a Estudio de Arquitectura M&P.", type: "warning" },
  { id: "a2", text: "Reunión pendiente con Constructora del Sur.", type: "danger" },
];

export const stats = {
  activeBudgets: 6,
  totalInvoiced: 770000,
  pendingToInvoice: 25000
};
