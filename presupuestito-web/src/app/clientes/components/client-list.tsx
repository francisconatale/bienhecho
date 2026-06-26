"use client";

import { useState } from "react";
import {
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  Plus,
  Mail,
  Phone,
  ArrowLeft,
  User,
} from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { ClientForm } from "./client-form";
import { useClientForm } from "./use-client-form";
import { ListItem } from "@/components/ui/list-item";
import Link from "next/link";

function ClientDetail({
  client,
  onDelete,
  onBack,
}: {
  client: Client;
  onDelete: (c: Client) => void;
  onBack?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { jobs } = useDataStore();
  const clientJobs = jobs.filter((j) => j.cliente_id === client.id);

  const handleSuccess = () => setIsEditing(false);
  const { form, onSubmit, isLoading } = useClientForm(client, handleSuccess);
  const {
    register,
    formState: { errors },
  } = form;

  if (isEditing) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-outline-variant/10 flex items-center gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="w-8 h-8 rounded-lg hover:bg-surface-variant/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
          </button>
          <h2 className="text-base font-bold text-on-surface">Editando Perfil</h2>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Nombre / Empresa
              </label>
              <input
                type="text"
                {...register("nombre")}
                className="w-full bg-surface-variant/30 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="cliente@ejemplo.com"
                className="w-full bg-surface-variant/30 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Teléfono
              </label>
              <input
                type="tel"
                {...register("telefono")}
                placeholder="+54 11..."
                className="w-full bg-surface-variant/30 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Dirección
              </label>
              <input
                type="text"
                {...register("direccion")}
                placeholder="Av. Corrientes 1234"
                className="w-full bg-surface-variant/30 border border-outline-variant/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 h-10 rounded-xl font-semibold text-xs text-on-surface-variant hover:bg-surface-variant/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 rounded-xl font-semibold text-xs text-white bg-primary hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {onBack && (
        <div className="md:hidden p-3 border-b border-primary/10 bg-primary/5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-primary font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </div>
      )}

      <div className="p-5 border-b border-outline-variant/10 bg-gradient-to-b from-primary/8 to-surface">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-primary font-bold text-xl shrink-0">
            {client.nombre.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-on-surface truncate">
              {client.nombre}
            </h2>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">
          Contacto
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-xl">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                Email
              </p>
              <p className="text-sm text-on-surface truncate">{client.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-xl">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                Teléfono
              </p>
              <p className="text-sm text-on-surface truncate">{client.telefono || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Trabajos
          </h3>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
            {clientJobs.length}
          </span>
        </div>
        {clientJobs.length > 0 ? (
          <div className="space-y-1.5">
            {clientJobs.map((job) => (
              <Link
                key={job.id}
                href={`/trabajos/${job.id}`}
              >
                <ListItem
                  title={job.titulo}
                  subtitle={job.estado}
                  icon={<ExternalLink className="w-3.5 h-3.5 opacity-30" />}
                  className="!py-2.5 !px-3 !rounded-xl bg-surface-variant/10"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-5 text-center bg-surface-variant/10 rounded-xl border border-dashed border-outline-variant/20">
            <p className="text-xs text-on-surface-variant">Sin trabajos aún.</p>
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 h-10 rounded-xl bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Editar
          </button>
          <button
            onClick={() => onDelete(client)}
            className="h-10 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
          >
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
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      false
  );

  const selected = clients.find((c) => c.id === selectedId) || null;

  const handleDelete = (client: Client) => {
    if (window.confirm(`¿Estás seguro de que querés eliminar a ${client.nombre}?`)) {
      removeClient(client.id);
      if (selectedId === client.id) setSelectedId(null);
    }
  };

  return (
    <div className="flex h-full bg-background">
      <div
        className={`${
          selectedId && !showCreationForm ? "hidden md:flex" : "flex"
        } w-full md:w-[340px] flex-col bg-surface border-r border-outline-variant/10 shrink-0`}
      >
        <div className="border-b border-primary/10 bg-gradient-to-br from-primary/12 via-primary/6 to-surface">
          <div className="p-4 pb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-extrabold text-on-surface tracking-tight">
                  Mis Clientes
                </h1>
                <p className="text-xs text-on-surface-variant">
                  {filtered.length} registro
                  {filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreationForm(!showCreationForm);
                  setSelectedId(null);
                }}
                className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                  showCreationForm
                    ? "bg-surface-variant/30 text-on-surface border border-outline-variant/10"
                    : "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark active:scale-95"
                }`}
              >
                {showCreationForm ? (
                  <span className="text-lg">×</span>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>
            {!showCreationForm && (
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60 pointer-events-none" strokeWidth={2.5} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar clientes..."
                  className="w-full bg-white/60 dark:bg-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 border border-primary/10"
                />
              </div>
            )}
          </div>
        </div>

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
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-primary/5 border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 shadow-sm">
                      {client.nombre.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-on-surface truncate">
                        {client.nombre}
                      </div>
                      <div className="text-xs text-on-surface-variant truncate">
                        {client.email}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-primary/50" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium">Sin resultados</p>
              <p className="text-xs opacity-60 mt-1">Probá con otro término</p>
            </div>
          )}
        </div>

        {!showCreationForm && (
          <div className="px-4 py-2 border-t border-primary/10 bg-primary/5 text-[11px] text-primary font-medium">
            {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div
        className={`${
          selectedId || showCreationForm ? "flex" : "hidden md:flex"
        } w-full md:w-auto flex-1 flex-col bg-grouped-bg-light min-w-0`}
      >
        {showCreationForm ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-outline-variant/10 flex items-center gap-3">
              <button
                onClick={() => setShowCreationForm(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-variant/20 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
              </button>
              <h2 className="text-base font-bold text-on-surface">Nuevo Cliente</h2>
            </div>
            <div className="p-5">
              <ClientForm onSuccess={() => setShowCreationForm(false)} />
            </div>
          </div>
        ) : selected ? (
          <ClientDetail
            client={selected}
            onDelete={handleDelete}
            onBack={() => setSelectedId(null)}
          />
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
