import type { Metadata } from "next";
import React from "react";
import { PagosContent } from "./pagos-content";

export const metadata: Metadata = {
  title: "Pagos",
  description: "Gestión de saldo pendiente, cuotas y cobros recibidos",
};

interface PagosPageProps {
  params: Promise<{ id: string }>;
}

export default async function PagosPage({ params }: PagosPageProps) {
  const { id } = await params;
  return <PagosContent id={id} />;
}
