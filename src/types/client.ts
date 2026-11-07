export interface Client {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  direccion: string;
  notas?: string;
  created_at: string;
}
