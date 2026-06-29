import { useMemo } from "react";
import { useDataStore } from "@/lib/store";

export function useCuentaCorriente(clienteId: string) {
  const transacciones = useDataStore((s) => s.transacciones);

  const clienteTx = useMemo(
    () => transacciones.filter((t) => t.cliente_id === clienteId),
    [transacciones, clienteId],
  );

  const saldo = useMemo(
    () =>
      clienteTx.reduce(
        (acc, t) => acc + (t.tipo === "cargo" ? t.monto : -t.monto),
        0,
      ),
    [clienteTx],
  );

  const transaccionesConSaldo = useMemo(() => {
    const sorted = [...clienteTx].sort(
      (a, b) =>
        a.fecha.localeCompare(b.fecha) ||
        a.created_at.localeCompare(b.created_at),
    );
    let running = 0;
    const withSaldo = sorted.map((t) => {
      running += t.tipo === "cargo" ? t.monto : -t.monto;
      return { ...t, saldo_despues: running };
    });
    return withSaldo.reverse();
  }, [clienteTx]);

  return {
    saldo,
    transacciones: transaccionesConSaldo,
    total: clienteTx.length,
  };
}
