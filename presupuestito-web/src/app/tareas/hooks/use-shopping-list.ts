import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materialsService, jobsService, clientsService } from "@/services";
export function useShoppingList() {
  const queryClient = useQueryClient();

  const { data: materiales = [], isLoading: isLoadingMaterials } = useQuery({ queryKey: ["materials"], queryFn: materialsService.getAll });
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService.getAll });
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({ queryKey: ["clients"], queryFn: clientsService.getAll });

  const updateMaterialMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => materialsService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });

  const pendingMaterials = materiales
    .filter((m) => !m.comprado)
    .map((m) => {
      const job = jobs.find((j) => j.id === m.trabajo_id);
      const client = job ? clients.find((c) => c.id === job.cliente_id) : null;
      return { ...m, job, client };
    })
    .filter((m) => m.job && (m.job.estado === "presupuestado" || m.job.estado === "borrador"));

  const toggleMaterial = async (id: string, current: boolean) => {
    await updateMaterialMutation.mutateAsync({ id, data: { comprado: !current } });
  };

  return {
    pendingMaterials,
    toggleMaterial,
    isLoading: isLoadingMaterials || isLoadingJobs || isLoadingClients,
  };
}
