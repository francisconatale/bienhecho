import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { transaccionesService_getByClientId } from "@/actions/transacciones.actions";

export function useCuentaCorriente(clienteId: string) {
  const { data: transacciones = [], isLoading } = useQuery({
    queryKey: ["transactions", "client", clienteId],
    queryFn: () => transaccionesService_getByClientId(clienteId),
    enabled: !!clienteId,
  });

  const saldo = useMemo(
    () =>
      transacciones.reduce(
        (acc, t) => acc + (t.tipo === "cargo" ? t.monto : -t.monto),
        0,
      ),
    [transacciones],
  );

  const transaccionesConSaldo = useMemo(() => {
    const sorted = [...transacciones].sort(
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
  }, [transacciones]);

  return {
    saldo,
    transacciones: transaccionesConSaldo,
    total: transacciones.length,
    isLoading,
  };
}
