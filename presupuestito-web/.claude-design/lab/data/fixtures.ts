export const mockJobs = [
  {
    id: "1",
    titulo: "Branding Tech Startup",
    cliente_id: "c1",
    estado: "en_curso",
    presupuesto: 1500000,
    created_at: "2026-06-20T10:00:00Z"
  },
  {
    id: "2",
    titulo: "Rediseño Web Corporativa",
    cliente_id: "c2",
    estado: "listo_para_facturar",
    presupuesto: 2400000,
    created_at: "2026-06-21T14:30:00Z"
  },
  {
    id: "3",
    titulo: "Campaña Ads Verano",
    cliente_id: "c3",
    estado: "facturado",
    presupuesto: 850000,
    created_at: "2026-05-15T09:00:00Z"
  },
  {
    id: "4",
    titulo: "Consultoría UX/UI",
    cliente_id: "c1",
    estado: "cobrado",
    presupuesto: 500000,
    created_at: "2026-04-10T11:00:00Z"
  },
  {
    id: "5",
    titulo: "App Móvil MVP",
    cliente_id: "c4",
    estado: "en_curso",
    presupuesto: 4200000,
    created_at: "2026-06-25T16:45:00Z"
  }
];

export const mockClients = {
  "c1": { nombre: "Acme Corp" },
  "c2": { nombre: "Globex" },
  "c3": { nombre: "Soylent" },
  "c4": { nombre: "Initech" }
};

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

export function getStatusColor(estado: string): string {
  switch (estado) {
    case "cobrado":
    case "facturado":
      return "bg-success";
    case "en_curso":
      return "bg-accent-dark";
    case "listo_para_facturar":
      return "bg-primary";
    default:
      return "bg-outline";
  }
}
