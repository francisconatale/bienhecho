import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobsService_getDashboardStats, jobsService_getPaginated } from "@/actions/jobs.actions";
import { visitsService_getUpcoming } from "@/actions/visits.actions";
import { useProfile } from "@/hooks/use-profile";
import { useClientAlerts } from "@/app/(dashboard)/tareas/hooks/use-client-alerts";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { Job, Client, Task, Visit } from "@/types";
import { Profile } from "@/services/profile.service";

export interface DashboardInitialData {
  stats?: { totalJobs: number; totalToInvoice: number };
  upcomingVisits?: Visit[];
  paginatedData?: { data: Job[]; total: number };
  profile?: Profile | null;
  jobs?: Job[];
  clients?: Client[];
  tasks?: Task[];
}

export function useDashboard(initialData?: DashboardInitialData) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => jobsService_getDashboardStats(),
    initialData: initialData?.stats,
  });

  const { data: upcomingVisits = [], isLoading: isLoadingVisits } = useQuery({
    queryKey: ["upcomingVisits"],
    queryFn: () => visitsService_getUpcoming(),
    initialData: initialData?.upcomingVisits,
  });

  const { data: paginatedData, isLoading: isLoadingPaginated } = useQuery({
    queryKey: ["jobs", "paginated", page, pageSize, ""],
    queryFn: () => jobsService_getPaginated(page, pageSize, ""),
    initialData: page === 1 ? initialData?.paginatedData : undefined,
  });

  const { profile, isLoading: isLoadingProfile } = useProfile(initialData?.profile);
  const { alerts } = useClientAlerts({
    jobs: initialData?.jobs,
    clients: initialData?.clients,
    tasks: initialData?.tasks,
  });

  const totalItems = paginatedData?.total || 0;
  const serverPag = useServerPagination(totalItems, pageSize);

  useEffect(() => {
    serverPag.goToPage(page);
  }, [page]);

  const pagination = {
    ...serverPag,
    goToPage: (p: number) => {
      setPage(p);
      serverPag.goToPage(p);
    },
    nextPage: () => {
      if (!serverPag.isLastPage) {
        setPage((p) => p + 1);
        serverPag.nextPage();
      }
    },
    prevPage: () => {
      if (!serverPag.isFirstPage) {
        setPage((p) => p - 1);
        serverPag.prevPage();
      }
    },
    paginatedItems: paginatedData?.data || [],
  };

  const isLoading = isLoadingStats || isLoadingVisits || isLoadingPaginated || isLoadingProfile;



  return {
    isLoading,
    stats: stats || { totalJobs: 0, totalToInvoice: 0 },
    upcomingVisits,
    pagination,
    profile,
    alerts,
  };
}
