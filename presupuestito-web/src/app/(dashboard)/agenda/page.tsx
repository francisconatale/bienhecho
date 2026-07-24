import type { Metadata } from "next";
import { AgendaContent } from "./agenda-content";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Gestioná las visitas a obra y tu calendario de trabajos",
};

export default function AgendaPage() {
  return <AgendaContent />;
}
