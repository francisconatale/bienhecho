export interface Cobro {
  id: string;
  trabajo_id: string;
  monto_cobrado: number;
  fecha_cobro: string;
  forma_pago?: string;
  notas?: string;
  created_at: string;
}
