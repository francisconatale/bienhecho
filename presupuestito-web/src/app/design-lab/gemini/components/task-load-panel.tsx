"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Loader2,
  Building2,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useChatTasks } from "../hooks/use-chat-tasks";
import { clientsService_getAll } from "@/actions/clients.actions";
import { loadChatTasksIntoJob } from "../actions";

export function TaskLoadPanel() {
  const { tareas, conversation, setConversation } = useChatTasks();

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsService_getAll,
  });

  const [clienteId, setClienteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadedJobId, setLoadedJobId] = useState<string | null>(null);

  if (tareas.length === 0) return null;

  const trabajoId = conversation?.trabajo_id ?? null;
  const isLinked = Boolean(trabajoId);
  const cantidadLabel = `${tareas.length} tarea${tareas.length === 1 ? "" : "s"}`;

  const handleLoad = async () => {
    if (!conversation || isLoading) return;

    const clienteFinal = isLinked
      ? conversation.cliente_id || clienteId
      : clienteId;
    if (!clienteFinal) {
      return;
    }
    if (!isLinked && !titulo.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await loadChatTasksIntoJob({
        conversation_id: conversation.id,
        cliente_id: clienteFinal,
        titulo: titulo.trim() || "Trabajo desde conversación",
        direccion: direccion.trim(),
      });

      if (res.agregadas > 0) {
      } else {
      }
      if (res.sin_precio > 0) {
      }
      setLoadedJobId(res.trabajo_id);
      setConversation({
        id: conversation.id,
        cliente_id: clienteFinal,
        trabajo_id: res.trabajo_id,
      });
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-6 border-t border-outline-variant/10 pt-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-semibold text-on-surface text-sm">Cargar en un trabajo</h3>
        <span className="text-xs text-on-surface-variant cursor-default select-none">
          {cantidadLabel}
        </span>
      </div>

      {isLinked ? (
        <div className="flex flex-col gap-2 px-2">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant cursor-default select-none">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" strokeWidth={2} />
            Vinculado a un trabajo
          </div>
          <Link
            href={`/trabajos/${trabajoId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline cursor-pointer"
          >
            <Briefcase className="w-4 h-4" strokeWidth={2} />
            Ver trabajo
            <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <button
            type="button"
            onClick={handleLoad}
            disabled={isLoading}
            className="mt-1 w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Anexar tareas nuevas
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant cursor-default select-none">
              Cliente
            </label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              disabled={isLoadingClients}
              className="w-full bg-surface border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">
                {isLoadingClients ? "Cargando clientes..." : "Seleccioná un cliente"}
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant cursor-default select-none">
              Título del trabajo
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Cambio de instalación eléctrica"
              className="w-full bg-surface border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant cursor-default select-none">
              Dirección (opcional)
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dónde se realiza el trabajo"
              className="w-full bg-surface border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
            />
          </div>

          <button
            type="button"
            onClick={handleLoad}
            disabled={isLoading}
            className="mt-1 w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Building2 className="w-4 h-4" strokeWidth={2} />
            )}
            Crear trabajo y cargar tareas
          </button>
        </div>
      )}

      {loadedJobId && (
        <Link
          href={`/trabajos/${loadedJobId}`}
          className="inline-flex items-center gap-1.5 px-2 text-sm font-medium text-primary hover:underline cursor-pointer"
        >
          <Briefcase className="w-4 h-4" strokeWidth={2} />
          Ver trabajo creado
          <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}
