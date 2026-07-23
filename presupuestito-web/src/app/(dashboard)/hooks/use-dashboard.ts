import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobsService, visitsService } from "@/services";
import { useProfile } from "@/hooks/use-profile";
import { useClientAlerts } from "@/app/(dashboard)/tareas/hooks/use-client-alerts";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { Job } from "@/types";

export function useDashboard() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => jobsService.getDashboardStats(),
  });

  const { data: upcomingVisits = [], isLoading: isLoadingVisits } = useQuery({
    queryKey: ["upcomingVisits"],
    queryFn: () => visitsService.getUpcoming(),
  });

  const { data: paginatedData, isLoading: isLoadingPaginated } = useQuery({
    queryKey: ["jobs", "paginated", page, pageSize, ""],
    queryFn: () => jobsService.getPaginated(page, pageSize, ""),
  });

  const { profile, isLoading: isLoadingProfile } = useProfile();
  const { alerts } = useClientAlerts();

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
