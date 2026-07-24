import type { Metadata } from "next";
import { TrabajoDetailContent } from "./trabajo-detail-content";

export const metadata: Metadata = {
  title: "Detalle de Trabajo",
  description: "Información detallada del trabajo, materiales y pagos",
};

interface TrabajoPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrabajoPage({ params }: TrabajoPageProps) {
  const { id } = await params;
  return <TrabajoDetailContent id={id} />;
}
