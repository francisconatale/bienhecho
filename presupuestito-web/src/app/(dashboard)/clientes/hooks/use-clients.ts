import { useState, useEffect, useDeferredValue } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/clients.service";;
import { useServerPagination } from "@/hooks/use-server-pagination";
import { Client } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";

export function useClients() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const selectedId = searchParams.get("clienteId");

  const [showCreationForm, setShowCreationForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // We use useServerPagination just to manage the page state locally
  // We initialize with 0 totalItems, and update it when data arrives
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["clients", "paginated", page, pageSize, deferredSearch],
    queryFn: () => clientsService.getPaginated(page, pageSize, deferredSearch),
  });

  const clients = data?.data || [];
  const total = data?.total || 0;

  const pag = useServerPagination(total, pageSize);
  
  const goToPage = (p: number) => {
    setPage(p);
  };
  
  const nextPage = () => {
    if (!pag.isLastPage) {
      setPage(p => p + 1);
    }
  };

  const prevPage = () => {
    if (!pag.isFirstPage) {
      setPage(p => p - 1);
    }
  };

  const serverPag = {
    ...pag,
    currentPage: page, // Override currentPage from useServerPagination if needed
    goToPage,
    nextPage,
    prevPage,
    paginatedItems: clients,
  };

  const deleteMutation = useMutation({
    mutationFn: clientsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  // Reset editing state when selection changes
  useEffect(() => { setIsEditing(false); }, [selectedId]);

  const handleSelectedIdChange = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("clienteId", id);
    } else {
      params.delete("clienteId");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    goToPage(1);
  }, [deferredSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = clients.find((c) => c.id === selectedId) || null;

  const [ConfirmDialog, confirm] = useConfirm();

  const handleDelete = (client: Client) => {
    confirm({
      title: "Eliminar Cliente",
      description: `¿Estás seguro de que querés eliminar a ${client.nombre}? Esta acción no se puede deshacer y podría afectar los trabajos asociados.`,
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        await deleteMutation.mutateAsync(client.id);
        if (selectedId === client.id) handleSelectedIdChange(null);
      }
    });
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
    filtered: clients, // UI might still be mapping over `filtered`. We just provide current page's clients.
    pag: serverPag,
    selected,
    handleDelete,
    handleToggleCreation,
    handleCreationSuccess,
    isLoading,
    ConfirmDialog,
  };
}
