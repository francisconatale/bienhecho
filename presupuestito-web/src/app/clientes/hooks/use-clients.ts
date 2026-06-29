import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services";
import { usePagination } from "@/hooks/use-pagination";
import { Client } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";

export function useClients() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => searchParams.get("clienteId") || null
  );

  const [showCreationForm, setShowCreationForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: clientsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  // Reset editing state when selection changes
  useEffect(() => { setIsEditing(false); }, [selectedId]);

  const handleSelectedIdChange = (id: string | null) => {
    setSelectedId(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("clienteId", id);
    } else {
      params.delete("clienteId");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filtered = useMemo(() => clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      false
  ), [clients, search]);

  const pag = usePagination(filtered, 10);

  useEffect(() => {
    pag.goToPage(1);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = clients.find((c) => c.id === selectedId) || null;

  const [ConfirmDialog, confirm] = useConfirm();

  const handleDelete = async (client: Client) => {
    const ok = await confirm({
      title: "Eliminar Cliente",
      description: `¿Estás seguro de que querés eliminar a ${client.nombre}? Esta acción no se puede deshacer y podría afectar los trabajos asociados.`,
      confirmText: "Eliminar",
      variant: "danger",
    });
    if (ok) {
      deleteMutation.mutate(client.id);
      if (selectedId === client.id) handleSelectedIdChange(null);
    }
  };

  const handleToggleCreation = () => {
    const nextState = !showCreationForm;
    setShowCreationForm(nextState);
    if (nextState) {
      handleSelectedIdChange(null);
    }
  };

  const handleCreationSuccess = (clientId: string) => {
    setShowCreationForm(false);
    handleSelectedIdChange(clientId);
  };

  return {
    search,
    setSearch,
    selectedId,
    handleSelectedIdChange,
    showCreationForm,
    setShowCreationForm,
    isEditing,
    setIsEditing,
    filtered,
    pag,
    selected,
    handleDelete,
    handleToggleCreation,
    handleCreationSuccess,
    isLoading,
    ConfirmDialog,
  };
}
