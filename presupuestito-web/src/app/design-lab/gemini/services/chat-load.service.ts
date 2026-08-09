import { requireAuth } from "@/utils/supabase/require-auth";

function normalizeDescription(text: string): string {
  return text.trim().toLowerCase();
}

export interface LoadChatTasksResult {
  trabajo_id: string;
  titulo: string;
  agregadas: number;
  ya_existian: number;
  sin_precio: number;
}

export const chatLoadService = {
  loadTasksIntoJob: async (input: {
    conversation_id: string;
    cliente_id: string;
    titulo: string;
    direccion?: string;
  }): Promise<LoadChatTasksResult> => {
    const { supabase, user } = await requireAuth();

    const { data: conversation, error: convErr } = await supabase
      .from("conversations")
      .select("id, cliente_id, trabajo_id")
      .eq("id", input.conversation_id)
      .eq("user_id", user.id)
      .single();
    if (convErr) throw new Error(convErr.message);
    if (!conversation) throw new Error("Conversación no encontrada.");

    const clienteId = input.cliente_id || conversation.cliente_id;
    if (!clienteId) throw new Error("Seleccioná un cliente para el trabajo.");

    let trabajoId = conversation.trabajo_id;

    if (!trabajoId) {
      const titulo = input.titulo.trim();
      if (!titulo) throw new Error("Escribí un título para el trabajo.");

      const { data: job, error: jobErr } = await supabase
        .from("trabajos")
        .insert({
          user_id: user.id,
          cliente_id: clienteId,
          titulo,
          direccion: input.direccion?.trim() || "",
          descripcion: "Trabajo creado desde conversación",
          presupuesto: 0,
          estado: "borrador",
        })
        .select()
        .single();
      if (jobErr) throw new Error(jobErr.message);
      trabajoId = job.id;
    }

    const { error: linkErr } = await supabase
      .from("conversations")
      .update({
        cliente_id: conversation.cliente_id ?? clienteId,
        trabajo_id: trabajoId,
      })
      .eq("id", conversation.id);
    if (linkErr) throw new Error(linkErr.message);

    const { data: chatTasks, error: tasksErr } = await supabase
      .from("tasks_snapshot")
      .select("id, description, quantity, precio")
      .eq("conversation_id", conversation.id);
    if (tasksErr) throw new Error(tasksErr.message);

    const { data: existingTareas, error: existingErr } = await supabase
      .from("tareas")
      .select("descripcion, orden")
      .eq("trabajo_id", trabajoId)
      .eq("user_id", user.id)
      .order("orden", { ascending: true });
    if (existingErr) throw new Error(existingErr.message);

    const existingDescriptions = new Set(
      (existingTareas ?? []).map((t) => normalizeDescription(t.descripcion))
    );
    let nextOrden = (existingTareas ?? []).reduce(
      (max, t) => Math.max(max, t.orden ?? 0),
      -1
    );

    let agregadas = 0;
    let yaExistian = 0;
    let sinPrecio = 0;

    for (const task of chatTasks ?? []) {
      const key = normalizeDescription(task.description);
      if (existingDescriptions.has(key)) {
        yaExistian++;
        continue;
      }
      existingDescriptions.add(key);
      nextOrden += 1;
      if (task.precio == null) sinPrecio++;

      const { error: insertErr } = await supabase.from("tareas").insert({
        user_id: user.id,
        trabajo_id: trabajoId,
        descripcion: task.description,
        cantidad: task.quantity ?? 1,
        precio: task.precio,
        precio_unitario: task.precio,
        completada: false,
        orden: nextOrden,
      });
      if (insertErr) throw new Error(insertErr.message);
      agregadas++;
    }

    const { data: job } = await supabase
      .from("trabajos")
      .select("titulo")
      .eq("id", trabajoId)
      .single();

    return {
      trabajo_id: trabajoId,
      titulo: job?.titulo ?? "Trabajo",
      agregadas,
      ya_existian: yaExistian,
      sin_precio: sinPrecio,
    };
  },
};
