import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { jobsService_getDashboardStats, jobsService_getPaginated } from "@/actions/jobs.actions";
import { visitsService_getUpcoming } from "@/actions/visits.actions";
import { useProfile } from "@/hooks/use-profile";
import { useClientAlerts } from "@/app/(dashboard)/tareas/hooks/use-client-alerts";
import { Job, Client, Task, Visit } from "@/types";
import { Profile } from "@/services/profile.service";

import { ClientAlert } from "@/app/(dashboard)/tareas/hooks/use-client-alerts";

export interface DashboardInitialData {
  stats?: { totalJobs: number; totalToInvoice: number };
  upcomingVisits?: Visit[];
  paginatedData?: { data: Job[]; total: number };
  profile?: Profile | null;
  alerts?: ClientAlert[];
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
    placeholderData: keepPreviousData,
  });

  const { profile, isLoading: isLoadingProfile } = useProfile(initialData?.profile);
  const { alerts } = useClientAlerts({ alerts: initialData?.alerts });

  const totalItems = paginatedData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;

  useEffect(() => {
    if (page > totalPages) {
      setPage(Math.max(1, totalPages));
    }
  }, [page, totalPages]);

  const pagination = {
    paginatedItems: paginatedData?.data || [],
    currentPage: page,
    totalPages,
    totalItems,
    pageSize,
    isFirstPage,
    isLastPage,
    goToPage: (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    nextPage: () => !isLastPage && setPage((p) => p + 1),
    prevPage: () => !isFirstPage && setPage((p) => p - 1),
    setPageSize: () => {},
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
