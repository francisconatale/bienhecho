import React from "react";
import { Metadata } from "next";
import { MetricasCuenta } from "./components/metricas-cuenta";
import { TransaccionesList } from "./components/transacciones-list";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { CuentaCorrientePageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Cuenta Corriente",
  description: "Movimientos y saldo del cliente",
};

export default function CuentaCorrientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  
  return (
    <CuentaCorrientePageClient id={id} />
  );
}
