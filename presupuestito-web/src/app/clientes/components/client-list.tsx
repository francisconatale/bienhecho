"use client";

import { useState } from "react";
import { Search, Briefcase, Trash2, Edit3, ExternalLink, Plus, Mail, Phone, ArrowLeft, User } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { ClientForm } from "./client-form";
import { useClientForm } from "./use-client-form";
import { ListItem } from "@/components/ui/list-item";

const STATUS_COLORS = {
  Activo: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400",
  Pendiente: "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
  Inactivo: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
};

function ClientDetail({ client, onDelete, onBack }: { client: Client; onDelete: (c: Client) => void; onBack?: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const { projects } = useDataStore();
  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const status = (client as any).status || "Activo";

  const handleSuccess = () => setIsEditing(false);
  const { form, onSubmit, isLoading } = useClientForm(client, handleSuccess);
  const { register, formState: { errors } } = form;

  if (isEditing) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-outline-variant/10 flex items-center gap-3">
          <button onClick={() => setIsEditing(false)} className="w-8 h-8 rounded-lg hover:bg-surface-variant/20 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
          </button>
          <h2 className="text-base font-bold text-on-surface">Editando Perfil</h2>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Nombre / Empresa</label>
              <input type="text" {...register("name")} className="w-full bg-surface-variant/30 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Categoría</label>
              <input type="text" {...register("category")} placeholder="Ej. Construcción" className="w-full bg-surface-variant/30 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Email</label>
              <input type="email" {...register("email")} placeholder="cliente@ejemplo.com" className="w-full bg-surface-variant/30 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Teléfono</label>
              <input type="tel" {...register("phone")} placeholder="+54 11..." className="w-full bg-surface-variant/30 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="flex-1 h-10 rounded-xl font-semibold text-xs text-on-surface-variant hover:bg-surface-variant/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 h-10 rounded-xl font-semibold text-xs text-white bg-primary hover:bg-primary-dark disabled:opacity-50 transition-colors">
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Mobile back button */}
      {onBack && (
        <div className="md:hidden p-3 border-b border-outline-variant/10">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-on-surface-variant">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-5 border-b border-outline-variant/10 bg-surface">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
            {client.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-on-surface truncate">{client.name}</h2>
            <p className="text-sm text-on-surface-variant">{(client as any).category || "Sin categoría"}</p>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-5 space-y-3">
        <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contacto</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-surface-variant/20 rounded-xl">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Email</p>
              <p className="text-sm text-on-surface truncate">{client.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface-variant/20 rounded-xl">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Teléfono</p>
              <p className="text-sm text-on-surface truncate">{client.phone || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Proyectos</h3>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
            {clientProjects.length}
          </span>
        </div>
        {clientProjects.length > 0 ? (
          <div className="space-y-1.5">
            {clientProjects.map((project) => (
              <ListItem
                key={project.id}
                title={project.name}
                subtitle={project.status}
                icon={<Briefcase className="w-4 h-4 opacity-50" />}
                href={`/proyectos/${project.id}`}
                trailing={<ExternalLink className="w-3.5 h-3.5 opacity-30" />}
                className="!py-2.5 !px-3 !rounded-xl bg-surface-variant/10"
              />
            ))}
          </div>
        ) : (
          <div className="py-5 text-center bg-surface-variant/10 rounded-xl border border-dashed border-outline-variant/20">
            <p className="text-xs text-on-surface-variant">Sin proyectos aún.</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5">
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="flex-1 h-10 rounded-xl bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-colors">
            <Edit3 className="w-3.5 h-3.5" /> Editar
          </button>
          <button onClick={() => onDelete(client)} className="h-10 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ClientList() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreationForm, setShowCreationForm] = useState(false);
  const { clients, removeClient } = useDataStore();

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c as any).category?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = clients.find((c) => c.id === selectedId) || null;

  const handleDelete = (client: Client) => {
    if (window.confirm(`¿Estás seguro de que querés eliminar a ${client.name}?`)) {
      removeClient(client.id);
      if (selectedId === client.id) setSelectedId(null);
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Left: Client List */}
      <div className={`${selectedId && !showCreationForm ? 'hidden md:flex' : 'flex'} w-full md:w-[340px] flex-col bg-surface border-r border-outline-variant/10`}>
        {/* Search + Header */}
        <div className="p-3 border-b border-outline-variant/10 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h1 className="text-lg font-extrabold text-on-surface tracking-tight">Mis Clientes</h1>
            <button
              onClick={() => {
                setShowCreationForm(!showCreationForm);
                setSelectedId(null);
              }}
              className={`h-9 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                showCreationForm
                  ? "bg-surface-variant/20 text-on-surface border border-outline-variant/10"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {showCreationForm ? "Cancelar" : <><Plus className="w-3.5 h-3.5" /> Nuevo</>}
            </button>
          </div>
          {!showCreationForm && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" strokeWidth={2.5} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar clientes..."
                className="w-full bg-surface-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((client) => {
                const isSelected = selectedId === client.id;
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedId(client.id)}
                    className={`w-full text-left px-4 py-3 border-b border-outline-variant/5 transition-colors ${
                      isSelected
                        ? "bg-primary/8 border-l-2 border-l-primary"
                        : "hover:bg-surface-variant/20 border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-on-surface truncate">{client.name}</div>
                        <div className="text-xs text-on-surface-variant truncate">{client.email}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[(client as any).status as keyof typeof STATUS_COLORS] || STATUS_COLORS.Activo}`}>
                        {(client as any).status || "Activo"}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                <Search className="w-8 h-8 mb-2 opacity-30" strokeWidth={1.5} />
                <p className="text-sm font-medium">Sin resultados</p>
                <p className="text-xs opacity-60 mt-1">Probá con otro término</p>
              </div>
            )}
          </div>

        {/* Footer count */}
        {!showCreationForm && (
          <div className="px-4 py-2 border-t border-outline-variant/10 text-[11px] text-on-surface-variant">
            {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Right: Detail Panel */}
      <div className={`${selectedId || showCreationForm ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-grouped-bg-light`}>
        {showCreationForm ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-outline-variant/10 flex items-center gap-3">
              <button onClick={() => setShowCreationForm(false)} className="w-8 h-8 rounded-lg hover:bg-surface-variant/20 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
              </button>
              <h2 className="text-base font-bold text-on-surface">Nuevo Cliente</h2>
            </div>
            <div className="p-5">
              <ClientForm onSuccess={() => setShowCreationForm(false)} />
            </div>
          </div>
        ) : selected ? (
          <ClientDetail client={selected} onDelete={handleDelete} onBack={() => setSelectedId(null)} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">
            <div className="text-center">
              <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Seleccioná un cliente</p>
              <p className="text-xs opacity-60 mt-1">de la lista para ver sus detalles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
