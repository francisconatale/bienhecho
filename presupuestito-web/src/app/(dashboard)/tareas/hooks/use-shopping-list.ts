import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materialsService_getAll, materialsService_update } from "@/actions/materials.actions";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { clientsService_getAll } from "@/actions/clients.actions";
export function useShoppingList() {
  const queryClient = useQueryClient();

  const { data: materiales = [], isLoading: isLoadingMaterials } = useQuery({ queryKey: ["materials"], queryFn: materialsService_getAll });
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService_getAll });
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({ queryKey: ["clients"], queryFn: clientsService_getAll });

  const updateMaterialMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => materialsService_update(id, data),
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
