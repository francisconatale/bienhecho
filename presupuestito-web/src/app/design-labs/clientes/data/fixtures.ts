import { Client, Job } from "@/types";

export const mockClients: Client[] = [
  {
    id: "c1",
    nombre: "Constructora del Sur",
    telefono: "11-4567-8901",
    email: "contacto@constructora.com",
    direccion: "Av. Corrientes 1234",
    notas: "Cliente frecuente",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "c2",
    nombre: "Estudio de Arquitectura M&P",
    telefono: "11-5678-9012",
    email: "info@mparquitectura.com",
    direccion: "Av. Santa Fe 567",
    created_at: "2024-03-20T10:00:00Z",
  },
  {
    id: "c3",
    nombre: "Administración San Jose",
    telefono: "11-6789-0123",
    email: "admin@sanjose.com",
    direccion: "Av. Rivadavia 890",
    notas: "Consorcio",
    created_at: "2024-06-10T10:00:00Z",
  },
];

export const mockJobs: Job[] = [
  { id: "j1", cliente_id: "c1", titulo: "Edificio Las Heras", direccion: "Las Heras 456", presupuesto: 1500000, estado: "en_curso", created_at: "2024-01-20T10:00:00Z" },
  { id: "j2", cliente_id: "c2", titulo: "Reforma Consultorio Dental", direccion: "Av. Cabildo 789", presupuesto: 800000, estado: "presupuestado", created_at: "2024-04-01T10:00:00Z" },
  { id: "j3", cliente_id: "c3", titulo: "Mantenimiento General", direccion: "Av. Rivadavia 890", presupuesto: 350000, estado: "listo_para_facturar", created_at: "2024-07-01T10:00:00Z" },
];

export function getJobsForClient(clientId: string): Job[] {
  return mockJobs.filter((j) => j.cliente_id === clientId);
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", { month: "short", year: "numeric" });
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
