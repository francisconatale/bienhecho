import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDataStore } from "@/lib/store";
import { usePagination } from "@/hooks/use-pagination";
import { Client } from "@/types";

export function useClients() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => searchParams.get("clienteId") || null
  );

  const [showCreationForm, setShowCreationForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { clients, removeClient } = useDataStore();

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

  const filtered = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      false
  );

  const pag = usePagination(filtered, 10);
  const selected = clients.find((c) => c.id === selectedId) || null;

  const handleDelete = (client: Client) => {
    if (window.confirm(`Estas seguro de que queres eliminar a ${client.nombre}?`)) {
      removeClient(client.id);
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
  };
}
