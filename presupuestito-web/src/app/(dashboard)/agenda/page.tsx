import type { Metadata } from "next";
import { AgendaContent } from "./agenda-content";
import { visitsService_getAll } from "@/actions/visits.actions";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { clientsService_getAll } from "@/actions/clients.actions";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Gestioná las visitas a obra y tu calendario de trabajos",
};

export default async function AgendaPage() {
  const [visits, jobs, clients] = await Promise.all([
    visitsService_getAll(),
    jobsService_getAll(),
    clientsService_getAll(),
  ]);

  return <AgendaContent initialData={{ visits, jobs, clients }} />;
}
