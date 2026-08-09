import { requireAuth } from "@/utils/supabase/require-auth";
import { Tarea, WorkItem, MissingField, RegisteredTask } from "../types/chat";

export interface ChatTaskRow {
  id: string;
  description: string;
  quantity: number | null;
  precio: number | null;
}

type QuantityPrecio = { quantity: number | null; precio: number | null };

export function normalizeDescription(text: string): string {
  return text.trim().toLowerCase();
}

// Cantidad/precio deben ser > 0: el modelo a veces glitchea con 0 o negativos
// (ej. "instale 0 focos"); se tratan como dato no definido → quedan pendientes.
function positiveOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && value > 0 ? value : null;
}

export function missingFieldsOf(t: QuantityPrecio): MissingField[] {
  const fields: MissingField[] = [];
  if (t.quantity === null) fields.push("cantidad");
  if (t.precio === null) fields.push("precio");
  return fields;
}

export function isIncomplete(t: QuantityPrecio): boolean {
  return t.quantity === null || t.precio === null;
}

function statusOf(t: QuantityPrecio): "PENDING" | "COMPLETED" {
  return t.quantity != null && t.precio != null ? "COMPLETED" : "PENDING";
}

function toTarea(task: ChatTaskRow): Tarea {
  return {
    id: task.id,
    descripcion: task.description,
    cantidad: task.quantity,
    precio: task.precio,
  };
}

export const chatTasksService = {
  /**
   * Merge por descripción normalizada EXACTA: actualiza la tarea que ya existe
   * y apila las nuevas, para que las tareas diferentes NO se pisen entre turnos
   * (FR-007). Quién decide que es "la misma tarea" es la IA (que ve el contexto),
   * usando la descripción exacta registrada.
   */
  sync: async (conversationId: string, workItems: WorkItem[]): Promise<Tarea[]> => {
    const { supabase } = await requireAuth();

    const { data: existing } = await supabase
      .from("tasks_snapshot")
      .select("id, description, quantity, precio")
      .eq("conversation_id", conversationId);

    const byDescription = new Map<string, ChatTaskRow>();
    for (const task of existing ?? []) {
      byDescription.set(normalizeDescription(task.description), task);
    }

    // Agrupar workItems por descripción normalizada: si la IA devuelve la misma
    // tarea más de una vez en el turno, se mergea en UNA fila (el último valor
    // no-null gana) en vez de insertar duplicados.
    const grouped = new Map<string, WorkItem>();
    for (const item of workItems) {
      const key = normalizeDescription(item.description);
      const prev = grouped.get(key);
      grouped.set(key, {
        description: prev?.description ?? item.description,
        quantity: positiveOrNull(item.quantity) ?? positiveOrNull(prev?.quantity),
        precio: positiveOrNull(item.precio) ?? positiveOrNull(prev?.precio),
      });
    }

    for (const item of grouped.values()) {
      const key = normalizeDescription(item.description);
      const match = byDescription.get(key);

      if (match) {
        byDescription.delete(normalizeDescription(match.description));
        const quantity = item.quantity ?? match.quantity;
        const precio = item.precio ?? match.precio;
        const { error } = await supabase
          .from("tasks_snapshot")
          .update({ quantity, precio, status: statusOf({ quantity, precio }) })
          .eq("id", match.id);
        if (error) console.error("Error actualizando task:", error);
      } else {
        const quantity = item.quantity ?? null;
        const precio = item.precio ?? null;
        const { error } = await supabase.from("tasks_snapshot").insert({
          conversation_id: conversationId,
          description: item.description,
          quantity,
          precio,
          status: statusOf({ quantity, precio }),
        });
        if (error) console.error("Error insertando task:", error);
      }
    }

    return chatTasksService.listAll(conversationId);
  },

  /** Memoria de la conversación: las tareas registradas que ve el LLM para el prompt. */
  listRegistered: async (conversationId: string): Promise<RegisteredTask[]> => {
    const { supabase } = await requireAuth();
    const { data, error } = await supabase
      .from("tasks_snapshot")
      .select("description, quantity, precio")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  /** Tareas con id para el matching aditivo (la IA decide el match, acá se valida). */
  listExisting: async (conversationId: string): Promise<ChatTaskRow[]> => {
    const { supabase } = await requireAuth();
    const { data, error } = await supabase
      .from("tasks_snapshot")
      .select("id, description, quantity, precio")
      .eq("conversation_id", conversationId);
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  /** Actualiza cantidad/precio y deriva el status (COMPLETED si ambos definidos). */
  update: async (taskId: string, t: QuantityPrecio): Promise<void> => {
    const { supabase } = await requireAuth();
    const quantity = positiveOrNull(t.quantity);
    const precio = positiveOrNull(t.precio);
    const { error } = await supabase
      .from("tasks_snapshot")
      .update({ quantity, precio, status: statusOf({ quantity, precio }) })
      .eq("id", taskId);
    if (error) throw new Error(error.message);
  },

  /** Elimina tareas por descripción normalizada EXACTA (DELETE_TASK). */
  removeByDescription: async (conversationId: string, descriptions: string[]): Promise<ChatTaskRow[]> => {
    const { supabase } = await requireAuth();
    const keys = descriptions.map(normalizeDescription);

    const { data, error } = await supabase
      .from("tasks_snapshot")
      .select("id, description, quantity, precio")
      .eq("conversation_id", conversationId);
    if (error) throw new Error(error.message);

    const toDelete = (data ?? []).filter((t) => keys.includes(normalizeDescription(t.description)));
    if (toDelete.length > 0) {
      const { error: delErr } = await supabase
        .from("tasks_snapshot")
        .delete()
        .in("id", toDelete.map((t) => t.id));
      if (delErr) throw new Error(delErr.message);
    }
    return toDelete;
  },

  listAll: async (conversationId: string): Promise<Tarea[]> => {
    const { supabase } = await requireAuth();
    const { data, error } = await supabase
      .from("tasks_snapshot")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toTarea);
  },

  findNextIncomplete: async (conversationId: string): Promise<ChatTaskRow | null> => {
    const { supabase } = await requireAuth();
    const { data } = await supabase
      .from("tasks_snapshot")
      .select("*")
      .eq("conversation_id", conversationId)
      .or("quantity.is.null,precio.is.null")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    return data ?? null;
  },
};
