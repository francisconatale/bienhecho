import type { Metadata } from "next";
import { DashboardContent } from "./dashboard-content";

import { jobsService_getDashboardStats, jobsService_getPaginated } from "@/actions/jobs.actions";
import { visitsService_getUpcoming } from "@/actions/visits.actions";
import { profileService_get } from "@/actions/profile.actions";
import { alertsService_getDashboardAlerts } from "@/actions/alerts.actions";

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
    alerts
  ] = await Promise.all([
    jobsService_getDashboardStats(),
    visitsService_getUpcoming(),
    jobsService_getPaginated(1, 5, ""),
    profileService_get(),
    alertsService_getDashboardAlerts(),
  ]);

  const initialData = {
    stats,
    upcomingVisits,
    paginatedData,
    profile,
    alerts,
  };

  return <DashboardContent initialData={initialData} />;
}
