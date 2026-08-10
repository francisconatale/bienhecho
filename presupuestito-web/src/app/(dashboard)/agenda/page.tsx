import type { Metadata } from "next";
import { AgendaContent } from "./agenda-content";
import { visitsService_getByRange } from "@/actions/visits.actions";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { clientsService_getAll } from "@/actions/clients.actions";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Gestioná las visitas a obra y tu calendario de trabajos",
};

export default async function AgendaPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month + 1).padStart(2, "0")}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, "0")}`;

  const [visits, jobs, clients] = await Promise.all([
    visitsService_getByRange(monthStart, monthEnd),
    jobsService_getAll(),
    clientsService_getAll(),
  ]);

  return <AgendaContent initialData={{ visits, jobs, clients }} />;
}
