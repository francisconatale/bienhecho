import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { tasksService_getCounts, tasksService_getResumen, tasksService_getPaginated, tasksService_update, tasksService_delete } from "@/actions/tasks.actions";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useServerPagination } from "@/hooks/use-server-pagination";

export type FilterType = "pendientes" | "completadas";
export type CategoryType = "resumen" | "alta" | "media" | "baja";

export interface TareasInitialData {
  counts?: any;
  resumen?: any;
}

export function useTareas(initialData?: TareasInitialData) {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<FilterType>("pendientes");
  const [category, setCategory] = useState<CategoryType>("resumen");

  const [page, setPage] = useState(1);
  const pageSize = 12;

  // 1. Fetch counts
  const { data: counts, isLoading: isLoadingCounts } = useQuery({
    queryKey: ["tasks", "counts"],
    queryFn: tasksService_getCounts,
    initialData: initialData?.counts,
  });

  // 2. Fetch resumen if needed
  const { data: resumen, isLoading: isLoadingResumen } = useQuery({
    queryKey: ["tasks", "resumen"],
    queryFn: tasksService_getResumen,
    enabled: category === "resumen" && filter === "pendientes",
    placeholderData: keepPreviousData,
    initialData: category === "resumen" && filter === "pendientes" ? initialData?.resumen : undefined,
  });

  // 3. Fetch paginated category if needed
  const { data: paginated, isLoading: isLoadingPaginated } = useQuery({
    queryKey: ["tasks", "paginated", filter, category, page, pageSize],
    queryFn: () => tasksService_getPaginated(page, pageSize, filter, category !== "resumen" ? category : undefined),
    enabled: category !== "resumen" || filter === "completadas",
    placeholderData: keepPreviousData,
  });

  const hasAnyData = !!(resumen?.alta?.length || resumen?.media?.length || resumen?.baja?.length || paginated?.data?.length);
  const isLoading = !hasAnyData && (isLoadingCounts || isLoadingResumen || isLoadingPaginated);

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => tasksService_update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Invalidate dashboard counts/stats where used
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const removeTaskMutation = useMutation({
    mutationFn: tasksService_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const pendingCount = counts?.pendingCount || 0;
  const completedCount = counts?.completedCount || 0;
  const categoryCounts = counts?.categoryCounts || { alta: 0, media: 0, baja: 0 };

  // Grouped tasks matching the old format so UI doesn't break
  const groupedTasks = useMemo(() => {
    if (filter === "completadas") {
      return { alta: [], media: [], baja: [], completadas: paginated?.data || [] };
    }
    if (category === "resumen") {
      return {
        alta: resumen?.alta || [],
        media: resumen?.media || [],
        baja: resumen?.baja || [],
        completadas: [],
      };
    }
    // Specific category
    return {
      alta: category === "alta" ? (paginated?.data || []) : [],
      media: category === "media" ? (paginated?.data || []) : [],
      baja: category === "baja" ? (paginated?.data || []) : [],
      completadas: [],
    };
  }, [filter, category, resumen, paginated]);

  // Server pagination hook
  const totalForCurrentView = filter === "completadas" ? completedCount : (category !== "resumen" ? categoryCounts[category] : 0);
  const serverPag = useServerPagination(totalForCurrentView, pageSize);
  
  useEffect(() => { serverPag.goToPage(page); }, [page]);
  useEffect(() => { setPage(1); }, [filter, category]);

  const pag = {
    ...serverPag,
    goToPage: (p: number) => { setPage(p); serverPag.goToPage(p); },
    nextPage: () => { if (!serverPag.isLastPage) { setPage(p => p + 1); serverPag.nextPage(); } },
    prevPage: () => { if (!serverPag.isFirstPage) { setPage(p => p - 1); serverPag.prevPage(); } },
    // UI expects paginatedItems to just exist, we attach the current list depending on the view
    paginatedItems: filter === "completadas" ? groupedTasks.completadas : groupedTasks[category as keyof typeof groupedTasks] || [],
  };

  const [ConfirmDialog, confirm] = useConfirm();

  const toggleTask = async (taskId: string, current: boolean) => {
    await updateTaskMutation.mutateAsync({ id: taskId, data: { completada: !current } });
  };

  const togglePriority = async (taskId: string, currentPriority: string | null) => {
    const next = currentPriority === "alta" ? "baja" : currentPriority === "media" ? "alta" : "media";
    await updateTaskMutation.mutateAsync({ id: taskId, data: { prioridad: next } });
  };

  const deleteTask = async (taskId: string) => {
    // Look for the task in our current datasets to verify its job state
    let taskObj = null;
    const allArrays = [groupedTasks.alta, groupedTasks.media, groupedTasks.baja, groupedTasks.completadas];
    for (const arr of allArrays) {
      taskObj = arr.find((t: any) => t.id === taskId);
      if (taskObj) break;
    }

    if (taskObj) {
      if (taskObj.job?.estado === "pagado") {
        toast.error("No se puede eliminar una tarea de un trabajo pagado");
        return;
      }
    }

    confirm({
      title: "Eliminar Tarea",
      description: "¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        await removeTaskMutation.mutateAsync(taskId);
      }
    });
  };

  return {
    isLoading,
    filter,
    setFilter,
    category,
    setCategory,
    pendingCount,
    completedCount,
    toggleTask,
    togglePriority,
    deleteTask,
    groupedTasks,
    categoryCounts,
    ConfirmDialog,
    pag, // Exporting pag to be used directly by the list
  };
}
