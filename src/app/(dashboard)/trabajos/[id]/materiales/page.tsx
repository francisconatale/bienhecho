import type { Metadata } from "next";
import React from "react";
import { MaterialesContent } from "./materiales-content";

export const metadata: Metadata = {
  title: "Materiales",
  description: "Gestión de insumos y costos del trabajo",
};

interface MaterialesPageProps {
  params: Promise<{ id: string }>;
}

export default async function MaterialesPage({ params }: MaterialesPageProps) {
  const { id } = await params;
  return <MaterialesContent id={id} />;
}
