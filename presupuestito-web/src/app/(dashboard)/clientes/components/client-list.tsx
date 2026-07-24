"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowLeft, User, Users } from "lucide-react";
import { ClientForm } from "./client-form";
import { MasterDetail } from "@/components/ui/master-detail";
import { MobileHeaderActions } from "@/components/ui/mobile-header-actions";
import { ClientDetailPane } from "./client-detail-pane";
import { ClientItem } from "./client-item";
import { MasterDetailSkeleton } from "@/components/ui/skeletons";
import { useClients } from "../hooks/use-clients";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Client } from "@/types";

export function ClientList({ initialData }: { initialData?: { data: Client[], total: number } }) {
  const {
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
    handleDelete,
    handleToggleCreation,
    handleCreationSuccess,
    isLoading,
    ConfirmDialog,
  } = useClients(initialData);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedJobId = searchParams.get("jobId");

  const setSelectedJobId = (jobId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (jobId) {
      params.set("jobId", jobId);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      params.delete("jobId");
      params.delete("task");
      params.delete("view");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  // Reset selectedJobId when client changes
  const handleClientChange = (id: string | null) => {
    handleSelectedIdChange(id);
    setShowCreationForm(false);
  };

  if (isLoading && filtered.length === 0) {
    return <MasterDetailSkeleton />;
  }

  return (
    <div className="flex flex-col flex-1 bg-transparent relative overflow-hidden">
      <MasterDetail<Client>
        selectedId={selectedId}
        onSelectedChange={handleClientChange}
        onDetailBack={selectedJobId ? () => setSelectedJobId(null) : undefined}
        items={filtered as Client[]}
        getItemId={(c) => c.id}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filtrar clientes..."
        countLabel="cliente(s)"
        mobileTitle="Clientes"
        mobileDescription="Gestioná tus clientes."
        detailTitle={(client) => client.nombre}
        detailRightAction={selectedJobId ? undefined : (client) => (
          <MobileHeaderActions
            isEditing={isEditing}
            hasChanges={isEditing}
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
        onToggleCreation={handleToggleCreation}
        renderCreationForm={() => (
          <div className="flex-1 overflow-y-auto">
            {/* Desktop only header (mobile uses MasterDetail's sticky nav) */}
            <div className="hidden md:flex px-5 py-3 border-b border-outline-variant/8 bg-surface items-center gap-2.5">
              <h2 className="text-lg font-bold text-on-surface">Nuevo Cliente</h2>
            </div>
            <div className="p-4 pt-4 md:p-6 md:pt-6">
              <ClientForm onSuccess={handleCreationSuccess} />
            </div>
          </div>
        )}
        renderItem={(client, isSelected) => (
          <ClientItem
            client={client}
            isSelected={isSelected}
            onSelect={handleSelectedIdChange}
          />
        )}
        renderRailItem={(client, isActive) => (
          <button
            onClick={() => { handleSelectedIdChange(client.id); setShowCreationForm(false); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors transition-transform duration-200 cursor-pointer active:scale-90 ${
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
            onBack={() => handleClientChange(null)}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
          />
        )}
        emptyDetail={
          <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant relative">
            <AuroraBackground preset="perfil" />
            <div className="text-center z-10 relative">
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
      <ConfirmDialog />
    </div>
  );
}
