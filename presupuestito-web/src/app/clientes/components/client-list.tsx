"use client";

import { useState } from "react";
import { Search, Briefcase, Trash2, Edit3, ExternalLink, ChevronDown, ChevronUp, Plus, UserPlus, X } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { ClientRow } from "./client-row";
import { ClientSearch } from "./client-search";
import { Client } from "@/types";
import { ClientForm } from "./client-form";
import { useClientForm } from "./use-client-form";
import { ListItem } from "@/components/ui/list-item";

// Sub-component for the expanded view (static or editing)
function ClientExpandedView({ client, onDelete }: { client: Client, onDelete: (client: Client) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const { projects } = useDataStore();

  const handleSuccess = () => {
    setIsEditing(false);
  };

  const { form, onSubmit, isLoading } = useClientForm(client, handleSuccess);
  const { register, formState: { errors } } = form;

  const clientProjects = projects.filter(p => p.clientId === client.id);

  if (isEditing) {
    return (
      <div className="px-5 pb-6 pt-4 animate-in fade-in duration-300">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
              Editando Perfil
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor={`name-${client.id}`} className="block text-xs font-semibold text-on-surface-variant mb-1.5">Nombre / Empresa</label>
                <input id={`name-${client.id}`} type="text" {...register("name")} className="w-full bg-surface-variant/40 dark:bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor={`category-${client.id}`} className="block text-xs font-semibold text-on-surface-variant mb-1.5">Categoría</label>
                <input id={`category-${client.id}`} type="text" {...register("category")} placeholder="Ej. Construcción" className="w-full bg-surface-variant/40 dark:bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor={`email-${client.id}`} className="block text-xs font-semibold text-on-surface-variant mb-1.5">Email</label>
                <input id={`email-${client.id}`} type="email" {...register("email")} placeholder="cliente@ejemplo.com" className="w-full bg-surface-variant/40 dark:bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`phone-${client.id}`} className="block text-xs font-semibold text-on-surface-variant mb-1.5">Teléfono</label>
                <input id={`phone-${client.id}`} type="tel" {...register("phone")} placeholder="+54 11..." className="w-full bg-surface-variant/40 dark:bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
            <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-2xl font-semibold text-xs text-on-surface-variant hover:bg-surface-variant/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-2xl font-semibold text-xs text-white bg-primary hover:bg-primary-dark disabled:opacity-50 transition-colors">
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="px-5 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300 space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => setIsEditing(true)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary rounded-2xl font-semibold text-xs hover:bg-primary/20 transition-colors">
          <Edit3 className="w-3.5 h-3.5" /> Editar Perfil
        </button>
        <button onClick={() => onDelete(client)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl font-semibold text-xs hover:bg-red-100 transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Borrar
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
        <div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Email</p>
          <p className="text-sm text-on-surface truncate">{client.email || "—"}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Teléfono</p>
          <p className="text-sm text-on-surface">{client.phone || "—"}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> Proyectos
          </h4>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
            {clientProjects.length}
          </span>
        </div>
        {clientProjects.length > 0 ? (
          <div className="bg-surface-variant/5 rounded-2xl border border-outline-variant/5 overflow-hidden">
            {clientProjects.map(project => (
              <ListItem
                key={project.id}
                title={project.name}
                subtitle={project.status}
                icon={<Briefcase className="w-4 h-4 opacity-50" />}
                href={`/proyectos/${project.id}`}
                trailing={<ExternalLink className="w-3.5 h-3.5 opacity-30" />}
                className="!py-3 !px-4"
              />
            ))}
          </div>
        ) : (
          <div className="py-6 text-center bg-surface-variant/5 rounded-2xl border border-dashed border-outline-variant/20">
            <p className="text-xs text-on-surface-variant">Sin proyectos aún.</p>
            <button className="text-xs font-bold text-primary mt-2 inline-flex items-center gap-1 hover:underline">
              <Plus className="w-3 h-3" /> Crear Proyecto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component
export function ClientList() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreationForm, setShowCreationForm] = useState(false);
  const { clients, removeClient } = useDataStore();

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c as any).category?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (showCreationForm) setShowCreationForm(false);
  };

  const handleDelete = (client: Client) => {
    if (window.confirm(`¿Estás seguro de que querés eliminar a ${client.name}?`)) {
      removeClient(client.id);
      if (expandedId === client.id) setExpandedId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 w-full">
          {!showCreationForm && (
            <div className="animate-in fade-in duration-300">
              <ClientSearch value={search} onChange={setSearch} />
            </div>
          )}
        </div>
        <button 
          onClick={() => {
            setShowCreationForm(!showCreationForm);
            setExpandedId(null);
          }}
          className={`h-14 px-6 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 w-full md:w-auto shadow-lg ${
            showCreationForm 
              ? "bg-surface-variant/20 text-on-surface border border-outline-variant/10" 
              : "bg-primary text-white shadow-primary/20 hover:bg-primary-dark"
          }`}
        >
          {showCreationForm ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {showCreationForm ? "Cancelar" : "Nuevo Cliente"}
        </button>
      </div>

      {showCreationForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
          <ClientForm onSuccess={() => setShowCreationForm(false)} />
        </div>
      )}

      {!showCreationForm && (
        <section className="animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Todos los clientes
            </h3>
            <span className="text-xs text-on-surface-variant">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          
          <div className="space-y-4">
            {filtered.length > 0 ? (
              filtered.map((client) => {
                const isExpanded = expandedId === client.id;
                return (
                  <div 
                    key={client.id} 
                    className={`bg-surface rounded-[32px] border transition-all duration-300 overflow-hidden ${
                      isExpanded 
                        ? "border-primary/30 shadow-lg ring-1 ring-primary/10" 
                        : "border-outline-variant/10 shadow-sm"
                    }`}
                  >
                    <ClientRow 
                      client={client as any} 
                      onClick={() => toggleExpand(client.id)}
                      trailing={
                        <div className="flex items-center gap-3">
                          <span className={`hidden sm:inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-surface-variant/20 text-on-surface-variant`}>
                            {(client as any).status || "Activo"}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-primary" strokeWidth={2.5} /> : <ChevronDown className="w-4 h-4 text-on-surface-variant" strokeWidth={2.5} />}
                        </div>
                      }
                    />
                    {isExpanded && (
                      <ClientExpandedView 
                        client={client}
                        onDelete={handleDelete}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                <Search className="w-10 h-10 mb-3 opacity-30" strokeWidth={1.5} />
                <p className="text-sm font-medium">Sin resultados</p>
                <p className="text-xs opacity-60 mt-1">Probá con otro término</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
