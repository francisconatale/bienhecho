export const mockAlerts = [
  {
    id: "1",
    tipo: "borrador" as const,
    mensaje: "3 trabajos en borrador necesitan atención",
  },
  {
    id: "2",
    tipo: "vencido" as const,
    mensaje: "1 factura vencida pendiente de cobro",
  },
];

export const mockFinancial = {
  totalAFacturar: 45200,
};

export const mockJobs = [
  { id: "1", titulo: "Remodelación cocina", cliente: "María López", presupuesto: 12500, estado: "en_progreso" },
  { id: "2", titulo: "Pintura exterior", cliente: "Carlos García", presupuesto: 8300, estado: "completado" },
  { id: "3", titulo: "Instalación eléctrica", cliente: "Ana Martínez", presupuesto: 6200, estado: "en_progreso" },
  { id: "4", titulo: "Jardín vertical", cliente: "Pedro Sánchez", presupuesto: 18200, estado: "borrador" },
];

export const mockVisits = [
  { id: "1", job: "Remodelación cocina", client: "María López", day: "Lun 30", time: "09:00 - 11:00" },
  { id: "2", job: "Pintura exterior", client: "Carlos García", day: "Mié 2", time: "14:00 - 16:00" },
];
