import type { Metadata } from "next";
import { DashboardContent } from "./dashboard-content";

import { jobsService_getDashboardStats, jobsService_getPaginated, jobsService_getAll } from "@/actions/jobs.actions";
import { visitsService_getUpcoming } from "@/actions/visits.actions";
import { profileService_get } from "@/actions/profile.actions";
import { clientsService_getAll } from "@/actions/clients.actions";
import { tasksService_getAll } from "@/actions/tasks.actions";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Vista general de tus trabajos, clientes y actividad reciente",
};

export default async function DashboardPage() {
  const [
    stats,
    upcomingVisits,
    paginatedData,
    profile,
    jobs,
    clients,
    tasks
  ] = await Promise.all([
    jobsService_getDashboardStats(),
    visitsService_getUpcoming(),
    jobsService_getPaginated(1, 5, ""),
    profileService_get(),
    jobsService_getAll(),
    clientsService_getAll(),
    tasksService_getAll(),
  ]);

  const initialData = {
    stats,
    upcomingVisits,
    paginatedData,
    profile,
    jobs,
    clients,
    tasks,
  };

  return <DashboardContent initialData={initialData} />;
}
