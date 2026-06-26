"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Phone,
  MapPin,
  ArrowLeft,
  User,
  ExternalLink,
  Pencil,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { ClientForm } from "./client-form";
import { useClientForm } from "./use-client-form";
import Link from "next/link";

function getStatusColor(estado: string): string {
  switch (estado) {
    case "cobrado":
    case "facturado":
      return "bg-success";
    case "en_curso":
      return "bg-accent-dark";
    case "listo_para_facturar":
      return "bg-primary";
    default:
      return "bg-outline";
  }
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

function DetailPane({
  client,
  onDelete,
  onBack,
}: {
  client: Client;
  onDelete: (c: Client) => void;
  onBack: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { jobs } = useDataStore();
  const clientJobs = jobs.filter((j) => j.cliente_id === client.id);
  const total = clientJobs.reduce((a, j) => a + j.presupuesto, 0);

  const handleSuccess = () => setIsEditing(false);
  const { form, onSubmit, isLoading } = useClientForm(client, handleSuccess);
  const {
    register,
    formState: { errors },
  } = form;

  if (isEditing) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-3 border-b border-outline-variant/8 flex items-center gap-3 bg-surface">
          <button
            onClick={() => setIsEditing(false)}
            className="w-7 h-7 rounded-lg hover:bg-outline-variant/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
          </button>
          <h2 className="text-sm font-bold text-on-surface">Editando Perfil</h2>
        </div>
        <form onSubmit={onSubmit} className="p-4 space-y-3">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Nombre / Empresa</label>
              <input
                type="text"
                {...register("nombre")}
                className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              />
              {errors.nombre && <p className="mt-1 text-xs text-error">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Email</label>
              <input
                type="email"
                {...register("email")}
                placeholder="cliente@ejemplo.com"
                className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              />
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Telefono</label>
              <input
                type="tel"
                {...register("telefono")}
                placeholder="+54 11..."
                className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Direccion</label>
              <input
                type="text"
                {...register("direccion")}
                placeholder="Av. Corrientes 1234"
                className="w-full bg-grouped-bg-light border border-outline-variant/20 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 h-8 rounded-lg font-semibold text-[11px] text-on-surface-variant hover:bg-outline-variant/10 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-8 rounded-lg font-semibold text-[11px] text-white bg-primary hover:bg-primary-dark disabled:opacity-50 transition-colors cursor-pointer"
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
      <div className="md:hidden px-4 py-2.5 border-b border-outline-variant/8 bg-surface">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-primary font-medium cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver
        </button>
      </div>

      <div className="px-5 py-4 bg-surface border-b border-outline-variant/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {client.nombre.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-on-surface">{client.nombre}</h2>
            <p className="text-[11px] text-on-surface-variant">{client.email || "—"}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setIsEditing(true)}
            className="h-7 px-2.5 rounded-lg text-[10px] font-medium text-on-surface-variant hover:bg-grouped-bg-light transition-colors cursor-pointer"
          >
            <Pencil className="w-3 h-3 inline mr-1" /> Editar
          </button>
          <button
            onClick={() => onDelete(client)}
            className="h-7 px-2.5 rounded-lg text-[10px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3 inline mr-1" /> Eliminar
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-surface rounded-lg p-3 border border-outline-variant/6">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Telefono</p>
            <p className="text-xs font-semibold text-on-surface">{client.telefono || "—"}</p>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-outline-variant/6">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Direccion</p>
            <p className="text-xs font-semibold text-on-surface truncate">{client.direccion || "—"}</p>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-outline-variant/6">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Trabajos</p>
            <p className="text-xs font-semibold text-on-surface">{clientJobs.length}</p>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-outline-variant/6">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Facturacion</p>
            <p className="text-xs font-semibold text-primary">{formatCurrency(total)}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Trabajos</h3>
            <Link href="/trabajos" className="text-[10px] font-semibold text-primary hover:text-primary-dark transition-colors">
              Ver todos
            </Link>
          </div>
          {clientJobs.length > 0 ? (
            <div className="space-y-1.5">
              {clientJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/trabajos/${job.id}`}
                  className="flex items-center gap-2.5 p-2.5 bg-surface border border-outline-variant/6 rounded-lg hover:border-primary/20 transition-all group cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">{job.titulo}</p>
                    <p className="text-[10px] text-on-surface-variant capitalize">{job.estado.replace(/_/g, " ")}</p>
                  </div>
                  <p className="text-xs font-semibold text-on-surface font-[tabular-nums]">{formatCurrency(job.presupuesto)}</p>
                  <ExternalLink className="w-3.5 h-3.5 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-on-surface-variant py-3 text-center bg-surface rounded-lg border border-dashed border-outline-variant/20">
              Sin trabajos aun.
            </p>
          )}
        </div>

        <p className="text-[9px] text-outline">
          Cliente desde {new Date(client.created_at).toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
        </p>
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
    if (window.confirm(`Estas seguro de que queres eliminar a ${client.nombre}?`)) {
      removeClient(client.id);
      if (selectedId === client.id) setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* HEADER */}
      <div className="px-4 py-3 bg-surface border-b border-outline-variant/10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar clientes..."
              className="w-full bg-grouped-bg-light rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 border-0"
            />
          </div>
          <button
            onClick={() => {
              setShowCreationForm(!showCreationForm);
              setSelectedId(null);
            }}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              showCreationForm
                ? "bg-outline-variant/15 text-on-surface"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {showCreationForm ? (
              <span className="text-lg leading-none">&times;</span>
            ) : (
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* MASTER-DETAIL GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] min-h-0">
        {/* LIST PANE */}
        <div
          className={`${
            selectedId && !showCreationForm ? "hidden md:flex" : "flex"
          } flex-col border-r border-outline-variant/10 bg-surface`}
        >
          <div className="px-4 py-2.5 border-b border-outline-variant/6">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((client) => {
                const isSelected = selectedId === client.id;
                const clientJobs = useDataStore.getState().jobs.filter((j) => j.cliente_id === client.id);
                const totalFacturacion = clientJobs.reduce((acc, j) => acc + j.presupuesto, 0);
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedId(client.id)}
                    className={`w-full text-left px-4 py-3 border-b border-outline-variant/5 transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/8" : "hover:bg-primary/3"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 transition-all ${
                        isSelected ? "bg-primary/15 text-primary" : "bg-primary/8 text-primary/60"
                      }`}>
                        {client.nombre.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-on-surface truncate">{client.nombre}</div>
                        <div className="text-[11px] text-on-surface-variant truncate">{client.email}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-bold text-primary">{clientJobs.length}</div>
                        <div className="text-[9px] text-on-surface-variant font-[tabular-nums]">
                          ${totalFacturacion >= 1000000
                            ? `${(totalFacturacion / 1000000).toFixed(1)}M`
                            : `${(totalFacturacion / 1000).toFixed(0)}K`}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-on-surface-variant">
                <p className="text-xs">Sin resultados</p>
              </div>
            )}
          </div>
        </div>

        {/* DETAIL PANE */}
        <div
          className={`${
            selectedId || showCreationForm ? "flex" : "hidden md:flex"
          } flex-col bg-grouped-bg-light min-w-0`}
        >
          {showCreationForm ? (
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-3 border-b border-outline-variant/8 bg-surface flex items-center gap-2.5">
                <button
                  onClick={() => setShowCreationForm(false)}
                  className="w-7 h-7 rounded-lg hover:bg-outline-variant/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-on-surface-variant" />
                </button>
                <h2 className="text-sm font-bold text-on-surface">Nuevo Cliente</h2>
              </div>
              <div className="p-4">
                <ClientForm onSuccess={() => setShowCreationForm(false)} />
              </div>
            </div>
          ) : selected ? (
            <DetailPane
              client={selected}
              onDelete={handleDelete}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant">
              <div className="text-center">
                <User className="w-8 h-8 mx-auto mb-2 opacity-15" />
                <p className="text-xs font-medium">Seleccioná un cliente</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
