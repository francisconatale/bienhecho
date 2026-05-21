"use client";

import { User, ChevronDown, ChevronUp, Plus, Search } from "lucide-react";
import { ListItem } from "@/components/ui/list-item";
import { useBudgetIdentity } from "../../hooks/use-budget-identity";

export function ClientSelector() {
  const {
    selectedClient,
    isClientListOpen,
    clientSearch,
    filteredClients,
    setClientSearch,
    handleToggleClients,
    handleSelectClient,
    openNewClientModal,
  } = useBudgetIdentity();

  return (
    <div className="flex flex-col">
      <ListItem
        icon={<User className="w-5 h-5 text-primary" />}
        title={selectedClient ? selectedClient.name : "Seleccionar Cliente"}
        subtitle={selectedClient ? selectedClient.email : "Requerido para continuar"}
        onClick={handleToggleClients}
        className="!py-5"
        showChevron={false}
        trailing={
          isClientListOpen ? (
            <ChevronUp className="w-5 h-5 text-primary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-on-surface-variant/40" />
          )
        }
      />
      
      {isClientListOpen && (
        <div className="px-5 pt-2 pb-5 space-y-4 bg-surface-variant/5 border-t border-outline-variant/5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="w-full bg-surface-variant/10 border-none rounded-lg pl-9 pr-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredClients.map((client) => (
              <ListItem
                key={client.id}
                icon={client.name.charAt(0)}
                title={client.name}
                subtitle={client.email}
                onClick={() => handleSelectClient(client.id)}
                className="!rounded-lg !py-2 !border-none !px-0"
                showChevron={false}
              />
            ))}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                openNewClientModal();
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 border border-dashed border-primary/30 rounded-xl text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={3} />
              Crear Nuevo Cliente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
