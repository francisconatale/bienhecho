import { useDataStore } from "@/lib/store";

export function useShoppingList() {
  const materiales = useDataStore((state) => state.materiales);
  const jobs = useDataStore((state) => state.jobs);
  const clients = useDataStore((state) => state.clients);
  const updateMaterial = useDataStore((state) => state.updateMaterial);

  const pendingMaterials = materiales
    .filter((m) => !m.comprado)
    .map((m) => {
      const job = jobs.find((j) => j.id === m.trabajo_id);
      const client = job ? clients.find((c) => c.id === job.cliente_id) : null;
      return { ...m, job, client };
    })
    .filter((m) => m.job && (m.job.estado === "presupuestado" || m.job.estado === "borrador"));

  const toggleMaterial = (id: string, current: boolean) => {
    updateMaterial(id, { comprado: !current });
  };

  return {
    pendingMaterials,
    toggleMaterial,
  };
}
