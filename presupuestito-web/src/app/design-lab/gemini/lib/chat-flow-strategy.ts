import { SupabaseClient } from "@supabase/supabase-js";
import { LLMResponse, Tarea, WorkItem, RegisteredTask, MissingField } from "../types/chat";
import {
  chatTasksService,
  normalizeDescription,
  isIncomplete,
  missingFieldsOf,
} from "../services/chat-tasks.service";

export const CHAT_FLOWS = {
  FRESH: "fresh",
  CLARIFY_DATOS: "clarify",
  CLARIFY_ADICIONAL: "additive",
} as const;

export type ChatFlow = (typeof CHAT_FLOWS)[keyof typeof CHAT_FLOWS];

export const MAX_CLARIFICATION_ATTEMPTS = 3;

// El LLM NO escribe prosa: solo identifica y llena los datos del contrato.
// Por eso la instrucción pide únicamente el JSON de datos y nada de mensajes.
export const chatSystemInstruction = {
  role: "system",
  parts: [
    {
      text: "Interpretá el mensaje del usuario y declará el intent:\n- CREATE_TASK: tarea NUEVA (no registrada) → 'data' con {description} y los datos dados.\n- UPDATE_TASK: tarea YA REGISTRADA → 'data' con la descripción EXACTA (no la reformules). Para SUMAR unidades: 'add': true y quantity = SOLO la cantidad adicional (o null si no la dijo).\n- DELETE_TASK: eliminar una tarea registrada → 'data' con su descripción EXACTA.\n- QUERY_TASK: pregunta sobre el estado o la lista → 'data' vacío.\n- UNKNOWN: no se entiende qué quiere → 'data' vacío y 'missing' con lo que no quedó claro.\n\nLos items en 'data': description (string, tal como la dijo el usuario), quantity (número entero positivo o null), precio (número entero positivo o null), add (boolean o null).\nstatus: \"completed\" cuando todas las tareas de CREATE/UPDATE quedan con quantity y precio definidos; \"pending\" si falta alguno (indicá qué falta en 'missing').\n\nNÚMEROS: quantity y precio son SIEMPRE números enteros positivos simples (ej. 5, 1000). Sin decimales ni notación científica. Si no sabés el dato: null.\n\nIMPORTANTE: No escribas mensajes, preguntas ni texto de conversación. Solo identificás los datos y llenás el JSON. El backend arma la respuesta del bot.\n\nFORMATO DE RESPUESTA OBLIGATORIO: Respondé EXCLUSIVAMENTE con un único objeto JSON que cumpla EXACTAMENTE este esquema, sin texto fuera del JSON, sin markdown, sin backticks y sin comentarios:\n{\"intent\": \"CREATE_TASK\" | \"UPDATE_TASK\" | \"DELETE_TASK\" | \"QUERY_TASK\" | \"UNKNOWN\", \"status\": \"completed\" | \"pending\", \"data\": [{\"description\": \"string\", \"quantity\": number | null, \"precio\": number | null, \"add\": boolean | null}], \"missing\": [\"string\"], \"confidence\": number}\nUsá SIEMPRE comillas dobles. No omitas campos (si no hay tareas, devolvé data: []; si nada falta, devolvé missing: []) y no agregues campos que no estén en el esquema.",
    },
  ],
};

export interface ActiveStepRow {
  id: string;
  task_id: string;
  step_type: string;
  attempts: number | null;
  tasks?: { id: string; description: string; quantity: number | null; precio: number | null } | null;
}

export interface ChatPromptContext {
  latestMessage: string;
  registeredTasks: RegisteredTask[];
  missingFields?: MissingField[];
  activeTaskDescription?: string;
}

export interface FlowRunContext {
  supabase: SupabaseClient;
  conversationId: string;
  parsedJSON: LLMResponse;
  activeStep: ActiveStepRow | null;
}

export interface ChatFlowStrategy {
  flow: ChatFlow;
  prompt: (ctx: ChatPromptContext) => string;
  run: (ctx: FlowRunContext) => Promise<{ tareas: Tarea[]; respuesta: string }>;
}

// Etiqueta derivada de los campos que faltan (no hay cases por campo):
// ambos → "la cantidad y el precio", uno solo → "la cantidad" / "el precio".
function missingFieldsLabel(fields: MissingField[] | undefined): string {
  if (!fields || fields.length === 0) return "los datos faltantes";
  if (fields.length > 1) return "la cantidad y el precio";
  return fields[0] === "precio" ? "el precio" : "la cantidad";
}

function buildRegisteredContext(tasks: RegisteredTask[]): string {
  if (!tasks || tasks.length === 0) return "";

  const lines = tasks.map((t) => {
    const faltaCantidad = t.quantity == null;
    const faltaPrecio = t.precio == null;
    const falta =
      faltaCantidad || faltaPrecio
        ? ` (incompleta: falta ${[faltaCantidad ? "cantidad" : "", faltaPrecio ? "precio" : ""].filter(Boolean).join(" y ")})`
        : "";
    return `- "${t.description}" (cantidad: ${t.quantity ?? "sin definir"}, precio: ${t.precio ?? "sin definir"})${falta}`;
  });

  return `Tareas ya registradas en esta conversación:\n${lines.join("\n")}\n\n`;
}

// --- Reply builders ---------------------------------------------------------
// El LLM no escribe prosa: el backend arma el mensaje del bot desde los datos
// estructurados que devolvió (intent + data + estado real en la base).

function replyForUnknown(): string {
  return "No entendí tu mensaje. ¿Podés reescribirlo con otras palabras?";
}

function replyForQuery(tareas: Tarea[]): string {
  if (tareas.length === 0) {
    return "Todavía no hay tareas registradas en esta conversación.";
  }
  const total = tareas.reduce((acc, t) => acc + (t.cantidad ?? 0) * (t.precio ?? 0), 0);
  const lines = tareas.map(
    (t) => `- "${t.descripcion}" (${t.cantidad ?? "cantidad sin definir"} u, ${t.precio ?? "precio sin definir"} $/u)`
  );
  return `Tenés ${tareas.length} tarea(s) registradas (total $${total}):\n${lines.join("\n")}`;
}

function replyForPendingQuestion(description: string, missing: MissingField[]): string {
  return `Falta ${missingFieldsLabel(missing)} de "${description}". ¿Me lo pasás?`;
}

function replyForRegistered(items: WorkItem[]): string {
  const detalle = items.map((item) => {
    const q = item.quantity != null ? `${item.quantity} unidades` : "sin cantidad";
    const p = item.precio != null ? `a $${item.precio} c/u` : "sin precio";
    return `"${item.description}" (${q}, ${p})`;
  });
  return `Listo, quedó registrado: ${detalle.join(", ")}.`;
}

function replyForUpdated(description: string, quantity: number | null, precio: number | null): string {
  const q = quantity != null ? `${quantity} unidades` : "sin cantidad";
  const p = precio != null ? `a $${precio} c/u` : "sin precio";
  return `Listo, actualicé "${description}" (${q}, ${p}).`;
}

// --- Helpers de pasos --------------------------------------------------------

// Encola un pending_step si no hay uno PENDING para esa tarea (sin duplicar).
export async function enqueueStep(
  supabase: SupabaseClient,
  conversationId: string,
  taskId: string,
  stepType: string
): Promise<void> {
  const { data: existing } = await supabase
    .from("pending_steps")
    .select("id")
    .eq("task_id", taskId)
    .eq("status", "PENDING")
    .maybeSingle();

  if (!existing) {
    await supabase.from("pending_steps").insert({
      conversation_id: conversationId,
      task_id: taskId,
      step_type: stepType,
      status: "PENDING",
      attempts: 0,
    });
  }
}

async function resolveStep(supabase: SupabaseClient, stepId: string): Promise<void> {
  await supabase.from("pending_steps").update({ status: "RESOLVED" }).eq("id", stepId);
}

// No resolvió por completo: incrementa intentos y corta al límite (FR-005/US3).
// Devuelve el mensaje de agotamiento si el paso quedó FAILED.
async function failOrRetryStep(
  supabase: SupabaseClient,
  stepId: string,
  currentAttempts: number | null,
  taskDescription: string
): Promise<string | null> {
  const attempts = (currentAttempts ?? 0) + 1;
  const failed = attempts >= MAX_CLARIFICATION_ATTEMPTS;

  await supabase
    .from("pending_steps")
    .update({ attempts, status: failed ? "FAILED" : "PENDING" })
    .eq("id", stepId);

  if (!failed) return null;
  return `No pude resolver el dato faltante después de ${MAX_CLARIFICATION_ATTEMPTS} intentos. Seguimos con la tarea "${taskDescription}" sin ese dato; vas a poder completarlo a mano.`;
}

export function resolveFlow(activeStepType: string | null): ChatFlow {
  if (activeStepType === "CLARIFY_CANTIDAD_ADICIONAL") return CHAT_FLOWS.CLARIFY_ADICIONAL;
  if (activeStepType === "CLARIFY_DATOS") return CHAT_FLOWS.CLARIFY_DATOS;
  return CHAT_FLOWS.FRESH;
}

function focusWorkItem(
  data: WorkItem[] | undefined,
  taskDescription: string | null | undefined
): WorkItem | undefined {
  const key = normalizeDescription(taskDescription ?? "");
  if (!key) return undefined;
  return (data ?? []).find((item) => normalizeDescription(item.description) === key);
}

export const FLOW_STRATEGIES: Record<ChatFlow, ChatFlowStrategy> = {
  [CHAT_FLOWS.CLARIFY_ADICIONAL]: {
    flow: CHAT_FLOWS.CLARIFY_ADICIONAL,
    prompt: (ctx) =>
      `(Se van a SUMAR más unidades a la tarea ya registrada "${ctx.activeTaskDescription ?? "sin descripción"}".) ${buildRegisteredContext(ctx.registeredTasks)}El usuario respondió: "${ctx.latestMessage}". Declará intent UPDATE_TASK e identificá la tarea en foco por su descripción EXACTA, devolviendo su item en 'data' con quantity = SOLO la cantidad adicional a sumar. Si además menciona OTRAS tareas registradas con datos, devolvé también sus items con su descripción exacta. Si no diste un número para la tarea en foco, devolvé status "pending" y 'missing' con "cantidad". Si el usuario pide borrar la tarea en foco, declará intent DELETE_TASK con su descripción exacta. Si pregunta algo, declará intent QUERY_TASK con data vacío. No escribas mensajes ni preguntas: solo el JSON de datos.\n\nRespondé únicamente con el JSON del esquema indicado: sin texto fuera del JSON, sin markdown, sin backticks.`,
    run: async ({ supabase, conversationId, parsedJSON, activeStep }) => {
      if (!activeStep) throw new Error("Flujo CLARIFY_ADICIONAL sin paso activo.");

      const focusDescription = activeStep.tasks?.description ?? "";

      // Borrar la tarea en foco durante la aclaración: se elimina y se resuelve
      // el paso (el CASCADE de pending_steps.task_id limpia la cola).
      if (parsedJSON.intent === "DELETE_TASK") {
        await chatTasksService.removeByDescription(conversationId, [focusDescription]);
        await resolveStep(supabase, activeStep.id);
        const tareas = await chatTasksService.listAll(conversationId);
        return { tareas, respuesta: `Listo, eliminé "${focusDescription}".` };
      }

      // Consulta o intención no clara: no tocar la tarea en foco ni gastar intentos.
      if (parsedJSON.intent === "QUERY_TASK" || parsedJSON.intent === "UNKNOWN") {
        const tareas = await chatTasksService.listAll(conversationId);
        return {
          tareas,
          respuesta: parsedJSON.intent === "UNKNOWN" ? replyForUnknown() : replyForQuery(tareas),
        };
      }

      const focusItem = focusWorkItem(parsedJSON.data, focusDescription);

      // Otras tareas que el usuario quiera tocar se resuelven por descripción
      // exacta vía sync; la de foco se suma aparte (evita pisar/duplicar).
      const itemsToSync = (parsedJSON.data ?? []).filter(
        (item) => normalizeDescription(item.description) !== normalizeDescription(focusDescription)
      );
      const tareas = await chatTasksService.sync(conversationId, itemsToSync);

      // El usuario resolvió otra petición y no la suma de la tarea en foco:
      // se deja el paso PENDING sin penalizar (attempts no aumenta).
      if (!focusItem) {
        return {
          tareas,
          respuesta: itemsToSync.length > 0 ? replyForRegistered(itemsToSync) : replyForQuery(tareas),
        };
      }

      const existenteCantidad = activeStep.tasks?.quantity ?? null;
      const existentePrecio = activeStep.tasks?.precio ?? null;

      const adicional = focusItem.quantity ?? 0;
      const quantity = (existenteCantidad ?? 0) + adicional;
      const precio = existentePrecio ?? focusItem.precio ?? null;
      const resolved = focusItem.quantity != null;

      await chatTasksService.update(activeStep.task_id, { quantity, precio });

      if (resolved) {
        await resolveStep(supabase, activeStep.id);
        return {
          tareas,
          respuesta: `Perfecto, sumo ${adicional} a los ${existenteCantidad ?? 0} ya registrados: "${focusDescription}" queda con ${quantity} en total.`,
        };
      }

      const message = await failOrRetryStep(supabase, activeStep.id, activeStep.attempts, focusDescription);
      if (message) return { tareas, respuesta: message };

      return { tareas, respuesta: replyForPendingQuestion(focusDescription, ["cantidad"]) };
    },
  },

  // El usuario contestó los datos que faltaban (cantidad y/o precio) de una tarea.
  [CHAT_FLOWS.CLARIFY_DATOS]: {
    flow: CHAT_FLOWS.CLARIFY_DATOS,
    prompt: (ctx) =>
      `(Aclaración pendiente: falta definir ${missingFieldsLabel(ctx.missingFields)} de la tarea "${ctx.activeTaskDescription ?? "sin descripción"}".) ${buildRegisteredContext(ctx.registeredTasks)}El usuario respondió: "${ctx.latestMessage}". Declará intent UPDATE_TASK e identificá la tarea en foco por su descripción EXACTA, devolviendo su item en 'data' con SOLO los datos que el usuario dio (quantity y/o precio). Si además menciona OTRAS tareas registradas con datos, devolvé también sus items con su descripción exacta. Si la tarea en foco quedó con todo definido, devolvé status "completed"; si le falta algo, devolvé status "pending" y 'missing' con lo que falta. Si el usuario pide borrar la tarea en foco, declará intent DELETE_TASK con su descripción exacta. Si pregunta algo, declará intent QUERY_TASK con data vacío. No escribas mensajes ni preguntas: solo el JSON de datos.\n\nRespondé únicamente con el JSON del esquema indicado: sin texto fuera del JSON, sin markdown, sin backticks.`,
    run: async ({ supabase, conversationId, parsedJSON, activeStep }) => {
      if (!activeStep) throw new Error("Flujo CLARIFY_DATOS sin paso activo.");

      const focusDescription = activeStep.tasks?.description ?? "";

      // Borrar la tarea en foco durante la aclaración: se elimina y se resuelve
      // el paso (el CASCADE de pending_steps.task_id limpia la cola).
      if (parsedJSON.intent === "DELETE_TASK") {
        await chatTasksService.removeByDescription(conversationId, [focusDescription]);
        await resolveStep(supabase, activeStep.id);
        const tareas = await chatTasksService.listAll(conversationId);
        return { tareas, respuesta: `Listo, eliminé "${focusDescription}".` };
      }

      // Consulta o intención no clara: no tocar la tarea en foco ni gastar intentos.
      if (parsedJSON.intent === "QUERY_TASK" || parsedJSON.intent === "UNKNOWN") {
        const tareas = await chatTasksService.listAll(conversationId);
        return {
          tareas,
          respuesta: parsedJSON.intent === "UNKNOWN" ? replyForUnknown() : replyForQuery(tareas),
        };
      }

      const focusItem = focusWorkItem(parsedJSON.data, focusDescription);

      // Otras tareas que el usuario quiera tocar (precio de otra, tarea nueva,
      // etc.) se resuelven por descripción exacta vía sync; la de foco aparte.
      const itemsToSync = (parsedJSON.data ?? []).filter(
        (item) => normalizeDescription(item.description) !== normalizeDescription(focusDescription)
      );

      const tareas = await chatTasksService.sync(conversationId, itemsToSync);

      // El usuario atendió OTRA petición y no dio datos de la tarea en foco:
      // se deja el paso PENDING sin penalizar (attempts no aumenta).
      if (!focusItem) {
        return {
          tareas,
          respuesta: itemsToSync.length > 0 ? replyForRegistered(itemsToSync) : replyForQuery(tareas),
        };
      }

      const existenteCantidad = activeStep.tasks?.quantity ?? null;
      const existentePrecio = activeStep.tasks?.precio ?? null;

      // Se rellena SOLO lo que el usuario aportó, sin pisar con null lo definido.
      const quantity = focusItem.quantity ?? existenteCantidad;
      const precio = focusItem.precio ?? existentePrecio;
      const resolved = quantity != null && precio != null;

      await chatTasksService.update(activeStep.task_id, { quantity, precio });

      if (resolved) {
        await resolveStep(supabase, activeStep.id);
        return { tareas, respuesta: replyForUpdated(focusDescription, quantity, precio) };
      }

      const message = await failOrRetryStep(supabase, activeStep.id, activeStep.attempts, focusDescription);
      if (message) return { tareas, respuesta: message };

      return { tareas, respuesta: replyForPendingQuestion(focusDescription, missingFieldsOf({ quantity, precio })) };
    },
  },

  // Turno normal: detecta tareas nuevas, datos faltantes y aumentos a existentes.
  [CHAT_FLOWS.FRESH]: {
    flow: CHAT_FLOWS.FRESH,
    prompt: (ctx) =>
      `${buildRegisteredContext(ctx.registeredTasks)}El usuario dijo: "${ctx.latestMessage}". Declará el intent y armá 'data':

1) CREATE_TASK — tarea NUEVA (no figura en el contexto): data con {description} y los datos que haya dado (quantity y/o precio).
2) UPDATE_TASK — se refiere a una tarea YA REGISTRADA (contexto): data con la descripción EXACTA y los datos que dé. Para SUMAR más unidades, incluí 'add': true y quantity = SOLO la cantidad adicional (si no la dio, quantity: null y quedará pendiente). Si solo completa cantidad/precio, no uses 'add'.
3) DELETE_TASK — quiere eliminar una tarea registrada: data con la descripción EXACTA de la que se elimina.
4) QUERY_TASK — pregunta sobre el estado/lista: data vacío.
5) UNKNOWN — no se entiende: data vacío y 'missing' con lo que no quedó claro.

Si alguna tarea de CREATE/UPDATE queda sin cantidad o sin precio, devolvé status "pending" e indicá en 'missing' qué falta. Si todo quedó definido, devolvé status "completed". No escribas mensajes ni preguntas: solo el JSON de datos.\n\nRespondé únicamente con el JSON del esquema indicado: sin texto fuera del JSON, sin markdown, sin backticks.`,
    run: async ({ supabase, conversationId, parsedJSON }) => {
      // DELETE_TASK: se borran las tareas cuya descripción exacta coincida.
      if (parsedJSON.intent === "DELETE_TASK") {
        const descripciones = (parsedJSON.data ?? []).map((item) => item.description);
        let respuesta = "";
        if (descripciones.length > 0) {
          const deleted = await chatTasksService.removeByDescription(conversationId, descripciones);
          if (deleted.length > 0) {
            respuesta = `Listo, eliminé: ${deleted.map((t) => `"${t.description}"`).join(", ")}.`;
          }
        }
        const tareas = await chatTasksService.listAll(conversationId);
        return { tareas, respuesta: respuesta || replyForQuery(tareas) };
      }

      // QUERY_TASK / UNKNOWN: no se escribe nada en la base, solo se responde.
      if (parsedJSON.intent === "QUERY_TASK" || parsedJSON.intent === "UNKNOWN") {
        const tareas = await chatTasksService.listAll(conversationId);
        return {
          tareas,
          respuesta: parsedJSON.intent === "UNKNOWN" ? replyForUnknown() : replyForQuery(tareas),
        };
      }

      // CREATE_TASK / UPDATE_TASK: mismo merge de siempre.
      // Tareas ya registradas: la IA decide el match usando el contexto completo
      // y la descripción exacta; acá solo se valida con coincidencia normalizada exacta.
      const existingTasks = await chatTasksService.listExisting(conversationId);

      const existingMap = new Map<
        string,
        { id: string; description: string; quantity: number | null; precio: number | null }
      >();
      for (const task of existingTasks) {
        existingMap.set(normalizeDescription(task.description), task);
      }

      // Los items de 'data' con 'add': true apuntan a una tarea ya registrada:
      // - Con cantidad: se SUMA y se resuelve directo en este turno.
      // - Sin cantidad: queda pendiente y se encola CLARIFY_CANTIDAD_ADICIONAL.
      const pendingAdditiveIds = new Set<string>();
      const pendingAdditiveDesc: string[] = [];
      const addRespuestas: string[] = [];
      const itemsToSync: WorkItem[] = [];

      for (const item of parsedJSON.data ?? []) {
        if (item.add !== true) {
          itemsToSync.push(item);
          continue;
        }

        const match = existingMap.get(normalizeDescription(item.description));
        if (!match) {
          // La IA marcó aditivo pero no hay coincidencia exacta: se trata como nueva.
          itemsToSync.push({ ...item, add: undefined });
          continue;
        }

        if (item.quantity != null) {
          const existente = match.quantity ?? 0;
          const quantity = existente + item.quantity;
          const precio = match.precio ?? item.precio ?? null;
          await chatTasksService.update(match.id, { quantity, precio });
          addRespuestas.push(
            `Perfecto, sumo ${item.quantity} a los ${existente} ya registrados: "${match.description}" queda con ${quantity} en total.`
          );
        } else {
          pendingAdditiveIds.add(match.id);
          pendingAdditiveDesc.push(match.description);
        }
      }

      const tareas = await chatTasksService.sync(conversationId, itemsToSync);

      let respuesta: string;

      if (pendingAdditiveIds.size > 0) {
        // Encola un paso aditivo por cada aumento que quedó sin cantidad.
        parsedJSON.status = "pending";
        for (const taskId of pendingAdditiveIds) {
          await enqueueStep(supabase, conversationId, taskId, "CLARIFY_CANTIDAD_ADICIONAL");
        }
        respuesta = pendingAdditiveDesc.map((d) => replyForPendingQuestion(d, ["cantidad"])).join(" ");
      } else if (addRespuestas.length > 0) {
        // Hubo aumentos resueltos: la respuesta exacta (con los números reales)
        // reemplaza el resumen genérico; se agregan los items nuevos si hubo.
        const parts = [...addRespuestas];
        if (itemsToSync.length > 0) parts.push(replyForRegistered(itemsToSync));
        respuesta = parts.join(" ");
      } else if (parsedJSON.status === "pending" && parsedJSON.missing.length > 0) {
        // Falta cantidad/precio en alguna tarea: se encola la aclaración y se pregunta.
        const needsClarification = tareas.find((t) => isIncomplete({ quantity: t.cantidad, precio: t.precio }));
        if (needsClarification) {
          await enqueueStep(supabase, conversationId, needsClarification.id, "CLARIFY_DATOS");
          respuesta = replyForPendingQuestion(
            needsClarification.descripcion,
            missingFieldsOf({ quantity: needsClarification.cantidad, precio: needsClarification.precio })
          );
        } else {
          respuesta = replyForRegistered(itemsToSync);
        }
      } else if (itemsToSync.length > 0) {
        respuesta = replyForRegistered(itemsToSync);
      } else {
        respuesta = replyForQuery(tareas);
      }

      return { tareas, respuesta };
    },
  },
};
