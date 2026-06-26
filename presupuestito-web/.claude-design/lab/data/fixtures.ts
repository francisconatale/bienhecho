export interface Client {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  direccion: string;
}

export const mockClients: Client[] = [
  {
    id: "c1",
    nombre: "Constructora del Sur",
    telefono: "11-4567-8901",
    email: "contacto@constructora.com",
    direccion: "Av. Corrientes 1234",
  },
  {
    id: "c2",
    nombre: "Estudio de Arquitectura M&P",
    telefono: "11-5678-9012",
    email: "info@mparquitectura.com",
    direccion: "Av. Santa Fe 567",
  },
  {
    id: "c3",
    nombre: "Administración San Jose",
    telefono: "11-6789-0123",
    email: "admin@sanjose.com",
    direccion: "Av. Rivadavia 890",
  },
  {
    id: "c4",
    nombre: "Barrio Cerrado Los Alamos",
    telefono: "11-7890-1234",
    direccion: "Ruta 8 Km 24",
  },
];
