import type { Metadata } from "next";
import React from "react";
import { TareaDetailContent } from "./tarea-detail-content";

export const metadata: Metadata = {
  title: "Detalle de Tarea",
  description: "Información detallada de la tarea",
};

interface TareaPageProps {
  params: Promise<{ id: string }>;
}

export default async function TareaPage({ params }: TareaPageProps) {
  const { id } = await params;
  return <TareaDetailContent id={id} />;
}
