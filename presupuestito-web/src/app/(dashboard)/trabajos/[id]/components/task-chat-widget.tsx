"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, MessageSquarePlus, Sparkles, X, ArrowDownToLine } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ChatInterface } from "@/app/design-lab/gemini/components/chat-interface";
import { TaskList } from "@/app/design-lab/gemini/components/task-list";
import { useChatTasks } from "@/app/design-lab/gemini/hooks/use-chat-tasks";
import { generateChatResponse, loadChatTasksIntoJob } from "@/app/design-lab/gemini/actions";
import type { Message } from "@/app/design-lab/gemini/types/chat";

interface TaskChatWidgetProps {
  jobId: string;
  clienteId: string | null;
  jobTitulo: string;
}

export function TaskChatWidget({ jobId, clienteId, jobTitulo }: TaskChatWidgetProps) {
  const queryClient = useQueryClient();
  const reset = useChatTasks((s) => s.reset);
  const conversation = useChatTasks((s) => s.conversation);
  const tareas = useChatTasks((s) => s.tareas);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAnnexing, setIsAnnexing] = useState(false);

  // Cada página de trabajo arranca con una conversación limpia vinculada a ese
  // trabajo. Al navegar entre trabajos el store global se resetea.
  useEffect(() => {
    reset();
    createClient().auth.getSession().then(({ data }) => {
      if (data?.session?.user) setUserId(data.session.user.id);
    });
  }, [reset]);

  const action = useCallback(
    async (messages: Message[], uid: string, convId?: string) =>
      generateChatResponse(messages, uid, convId, { trabajo_id: jobId, cliente_id: clienteId }),
    [jobId, clienteId]
  );

  const handleAnnex = async () => {
    if (!conversation || isAnnexing) return;
    const clienteFinal = clienteId ?? conversation.cliente_id;
    if (!clienteFinal) {
      toast.error("El trabajo no tiene un cliente asignado.");
      return;
    }
    setIsAnnexing(true);
    try {
      const res = await loadChatTasksIntoJob({
        conversation_id: conversation.id,
        cliente_id: clienteFinal,
        titulo: jobTitulo,
      });
      const plural = res.agregadas === 1 ? "" : "s";
      toast.success(
        res.agregadas > 0
          ? `${res.agregadas} tarea${plural} cargada${plural} en "${res.titulo}".`
          : `No había tareas nuevas en "${res.titulo}".`
      );
      if (res.sin_precio > 0) {
        toast.info(
          `${res.sin_precio} tarea${res.sin_precio === 1 ? "" : "s"} sin precio se cargó${res.sin_precio === 1 ? "" : "ron"} como descriptiva${res.sin_precio === 1 ? "" : "s"}.`
        );
      }
      queryClient.invalidateQueries({ queryKey: ["tasks", jobId] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error: any) {
      toast.error(error.message || "Error al cargar las tareas.");
    } finally {
      setIsAnnexing(false);
    }
  };

  if (!userId) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente de presupuestos"}
        aria-expanded={isOpen}
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[80] group flex items-center gap-2 px-4 py-3.5 rounded-full bg-primary text-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.4)] hover:bg-primary-dark transition-[background-color,transform] duration-[120ms] active:scale-95 cursor-pointer"
      >
        {isOpen ? (
          <X className="w-5 h-5" strokeWidth={2.5} />
        ) : (
          <Sparkles className="w-5 h-5" strokeWidth={2.5} />
        )}
        <span className="hidden sm:block text-xs font-bold">
          {isOpen ? "Cerrar" : "Asistente"}
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-36 md:bottom-24 right-4 md:right-6 z-[80] w-[calc(100vw-2rem)] max-w-sm md:w-96 flex flex-col overflow-hidden bg-surface rounded-2xl border border-outline-variant/15 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-outline-variant/10 bg-surface">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MessageSquarePlus className="w-4 h-4 text-primary" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-black text-on-surface leading-tight truncate">Asistente de Presupuestos</p>
                <p className="text-[10px] font-medium text-on-surface-variant/60 truncate">Anotá tareas para este trabajo</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar asistente"
              className="p-2 rounded-full hover:bg-on-surface/5 text-on-surface-variant/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 min-h-0 h-[300px] md:h-[340px]">
            <ChatInterface userId={userId} action={action} />
          </div>

          <div className="border-t border-outline-variant/10 bg-surface">
            <TaskList />
            {conversation && tareas.length > 0 && (
              <div className="px-3 pt-3 pb-4">
                <button
                  type="button"
                  onClick={handleAnnex}
                  disabled={isAnnexing}
                  className="w-full px-4 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAnnexing ? (
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                  ) : (
                    <ArrowDownToLine className="w-4 h-4" strokeWidth={2.5} />
                  )}
                  {isAnnexing ? "Cargando..." : "Anexar tareas al trabajo"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
