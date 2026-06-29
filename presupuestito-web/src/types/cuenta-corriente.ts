export interface TransaccionCuentaCorriente {
  id: string;
  cliente_id: string;
  tipo: "cargo" | "abono";
  monto: number;
  concepto: string;
  fecha: string;
  referencia_trabajo_id: string | null;
  referencia_cobro_id: string | null;
  origen: "automático" | "manual";
  created_at: string;
}
