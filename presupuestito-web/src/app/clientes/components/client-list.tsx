"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Pencil,
  Trash2,
  Briefcase,
  ExternalLink,
  X,
  Save,
  Users,
} from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { ClientForm } from "./client-form";
import { useClientForm } from "./use-client-form";
import { usePagination } from "@/hooks/use-pagination";
import { MasterDetail } from "@/components/ui/master-detail";
import { MobileHeaderActions } from "@/components/ui/mobile-header-actions";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useNavigationHistory } from "@/hooks/use-navigation-history";

import { ClientDetailPane } from "./client-detail-pane";
import { formatCurrency } from "@/lib/utils";


export function ClientList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => searchParams.get("clienteId") || null
  );

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

  const [showCreationForm, setShowCreationForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { clients, removeClient } = useDataStore();

  // Reset editing state when selection changes
  useEffect(() => { setIsEditing(false); }, [selectedId]);

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

  return (
    <div className="flex flex-col flex-1 bg-transparent relative overflow-hidden">

      <MasterDetail
        selectedId={selectedId}
        onSelectedChange={(id) => { handleSelectedIdChange(id); setShowCreationForm(false); }}
        items={filtered}
        getItemId={(c) => c.id}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filtrar clientes..."
        countLabel="cliente(s)"
        mobileTitle="Clientes"
        mobileDescription="Gestioná tus clientes."
        detailTitle={(client) => client.nombre}
        detailRightAction={(client) => (
          <MobileHeaderActions
            isEditing={isEditing}
            hasChanges={isEditing} // Form handles its own disable state via disabled={isLoading} or we can assume always true until hook provides isDirty
            onEditStart={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
            onSave={() => {
              document.querySelector<HTMLButtonElement>('[data-client-save]')?.click();
            }}
            onDelete={() => handleDelete(client)}
          />
        )}
        pagination={pag}
        showCreationForm={showCreationForm}
        onToggleCreation={() => { setShowCreationForm(!showCreationForm); handleSelectedIdChange(null); }}
        renderCreationForm={() => (
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-3 border-b border-outline-variant/8 bg-surface flex items-center gap-2.5">
              <button
                onClick={() => setShowCreationForm(false)}
                className="w-7 h-7 md:w-9 md:h-9 rounded-lg hover:bg-outline-variant/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-5 md:h-5 text-on-surface-variant" />
              </button>
              <h2 className="text-sm md:text-lg font-bold text-on-surface">Nuevo Cliente</h2>
            </div>
            <div className="p-4 md:p-6">
              <ClientForm onSuccess={(clientId) => {
                setShowCreationForm(false);
                handleSelectedIdChange(clientId);
              }} />
            </div>
          </div>
        )}
        renderItem={(client, isSelected) => {
          const clientJobs = useDataStore.getState().jobs.filter((j) => j.cliente_id === client.id);
          const totalFacturacion = clientJobs.reduce((acc, j) => acc + j.presupuesto, 0);
          return (
            <button
              onClick={() => handleSelectedIdChange(client.id)}
              className={`relative group w-full text-left px-4 md:px-5 py-4 transition-colors duration-300 transition-transform duration-300 cursor-pointer rounded-[24px] md:rounded-none border border-white/20 dark:border-white/5 md:border-0 md:border-b md:border-outline-variant/5 bg-surface dark:bg-surface/20 md:bg-transparent bg-surface/80  shadow-[0_4px_12px_rgba(0,0,0,0.02)] md:shadow-none hover:-translate-y-0.5 md:hover:translate-y-0 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:hover:shadow-none ${
                isSelected ? "md:bg-primary/15 dark:md:bg-primary/25 border-primary/30 md:border-b-outline-variant/5" : "md:hover:bg-on-surface/5"
              }`}
            >
              {isSelected && <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-[11px] md:text-sm shrink-0 transition-colors duration-300 ${
                  isSelected ? "bg-primary/20 text-primary shadow-inner" : "bg-primary/8 text-primary/60"
                }`}>
                  {client.nombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm md:text-base truncate transition-colors ${isSelected ? "text-primary" : "text-on-surface"}`}>{client.nombre}</div>
                  <div className="text-[11px] md:text-sm text-on-surface-variant truncate">{client.email}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] md:text-sm font-bold text-primary">{clientJobs.length}</div>
                  <div className="text-[9px] md:text-xs text-on-surface-variant tabular-nums">
                    {formatCurrency(totalFacturacion)}
                  </div>
                </div>
              </div>
            </button>
          );
        }}
        renderRailItem={(client, isActive) => (
          <button
            onClick={() => { handleSelectedIdChange(client.id); setShowCreationForm(false); }}
            className={`w-10 h-10 rounded-[14px] flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "bg-primary/10 text-primary/70 hover:bg-primary/20"
            }`}
            title={client.nombre}
          >
            {client.nombre.charAt(0)}
          </button>
        )}
        renderDetail={(client) => (
          <ClientDetailPane
            client={client}
            onDelete={handleDelete}
            onBack={() => handleSelectedIdChange(null)}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )}
        emptyDetail={
          <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant">
            <div className="text-center">
              <User className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-15" />
              <p className="text-xs md:text-base font-medium">Seleccioná un cliente</p>
            </div>
          </div>
        }
        emptyState={
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <Users className="w-16 h-16 md:w-20 md:h-20 text-on-surface-variant/20 mb-6" strokeWidth={1} />
            <h3 className="text-base md:text-lg font-bold text-on-surface mb-1.5">
              Seleccioná un cliente
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-[260px] leading-relaxed">
              Elegí un cliente de la lista o creá uno nuevo para empezar a gestionar sus trabajos.
            </p>
          </div>
        }
      />
    </div>
  );
}
