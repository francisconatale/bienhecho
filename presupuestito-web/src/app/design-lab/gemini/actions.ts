"use server";

import { GoogleGenerativeAI, SchemaType, Schema, GenerationConfig } from "@google/generative-ai";
import { requireAuth } from "@/utils/supabase/require-auth";
import { LLMResponse, BackendResponse, Message } from "./types/chat";
import {
  chatSystemInstruction,
  resolveFlow,
  FLOW_STRATEGIES,
  enqueueStep,
} from "./lib/chat-flow-strategy";
import { chatTasksService, missingFieldsOf } from "./services/chat-tasks.service";
import { chatLoadService } from "./services/chat-load.service";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// El LLM NO escribe texto libre: solo identifica y llena los datos del backend
// (el texto del bot lo arma el backend). Sin campos de prosa, el schema queda
// sin free-text, que es el trigger del loop degenerativo de gemma.
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    intent: {
      type: SchemaType.STRING,
      format: "enum",
      description: "Intención del turno: CREATE_TASK | UPDATE_TASK | DELETE_TASK | QUERY_TASK | UNKNOWN",
      enum: ["CREATE_TASK", "UPDATE_TASK", "DELETE_TASK", "QUERY_TASK", "UNKNOWN"],
    },
    status: {
      type: SchemaType.STRING,
      format: "enum",
      description: "completed | pending",
      enum: ["completed", "pending"],
    },
    data: {
      type: SchemaType.ARRAY,
      description: "Trabajos involucrados según el intent (vacíos para QUERY_TASK/UNKNOWN).",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          description: { type: SchemaType.STRING },
          quantity: { type: SchemaType.NUMBER, nullable: true },
          precio: { type: SchemaType.NUMBER, nullable: true },
          add: {
            type: SchemaType.BOOLEAN,
            nullable: true,
            description: "true si es un AUMENTO de cantidad a una tarea ya registrada (misma descripción exacta)",
          },
        },
        required: ["description"],
      },
    },
    missing: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
    },
    confidence: {
      type: SchemaType.NUMBER,
      description: "Qué tan seguro está el modelo de la interpretación (0 a 1).",
    },
  },
  required: ["intent", "status", "data", "missing", "confidence"],
};

const model = genAI.getGenerativeModel({
  model: "gemma-4-26b-a4b-it",
  systemInstruction: chatSystemInstruction,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema,
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 1024,
    thinkingConfig: {
      // Gemma 4 genera un canal de razonamiento por defecto que (a) se filtra
      // como preámbulo en la respuesta (el "* User input: ... * Instruction: ..."
      // en loop) y (b) pelea con la salida estructurada (google-gemini/cookbook
      // #1198, ollama #15386). includeThoughts:false es no-op silencioso en la
      // API para gemma; el toggle que SÍ funciona es thinkingLevel "minimal"
      // (cero thought tokens, documentado en "Run Gemma with the Gemini API").
      thinkingLevel: "minimal",
    },
    // thinkingConfig no existe aún en el type del SDK, pero el REST v1beta lo
    // acepta y es la única forma de apagar el razonamiento de gemma.
  } as GenerationConfig & { thinkingConfig: { thinkingLevel: string } },
});

// Gemma suele emitir el objeto JSON seguido de texto suelto (prosa, resúmenes,
// un segundo objeto). Esto NO es rescatar output inválido: se toma el primer
// objeto JSON balanceado y luego assertLLMResponse valida cada campo estricto.
function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }
  return null;
}

// El parse se mantiene estricto: si el modelo desvía, falla (no se rescata).
// Hasta 3 intentos por si la generación sale truncada; la validación sigue igual.
async function generateParsedResponse(stepPrompt: string): Promise<LLMResponse> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: stepPrompt }] }],
      });
      const raw = result.response.text();

      if (!raw || raw.trim().length === 0) {
        throw new Error("El modelo devolvió una respuesta vacía.");
      }

      const extracted = extractFirstJsonObject(raw);
      if (!extracted) {
        throw new Error("El modelo no respondió un objeto JSON válido.");
      }

      return assertLLMResponse(JSON.parse(extracted));
    } catch (error) {
      lastError = error;
      console.warn(`Output inválido del modelo (intento ${attempt}):`, error instanceof Error ? error.message : error);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("El modelo no pudo generar una respuesta válida.");
}

// El modelo debe cumplir EXACTAMENTE el contrato JSON. Se valida de forma
// estricta: si falta un campo o el tipo no corresponde, falla (no se rescata).
const INTENTS = ["CREATE_TASK", "UPDATE_TASK", "DELETE_TASK", "QUERY_TASK", "UNKNOWN"];

function assertLLMResponse(value: unknown): LLMResponse {
  if (typeof value !== "object" || value === null) {
    throw new Error("El modelo no respondió un objeto JSON válido.");
  }
  const v = value as Record<string, unknown>;
  if (typeof v.intent !== "string" || !INTENTS.includes(v.intent)) {
    throw new Error("El modelo no cumplió el esquema: 'intent' debe ser CREATE_TASK | UPDATE_TASK | DELETE_TASK | QUERY_TASK | UNKNOWN.");
  }
  if (v.status !== "completed" && v.status !== "pending") {
    throw new Error("El modelo no cumplió el esquema: 'status' debe ser 'completed' o 'pending'.");
  }
  if (!Array.isArray(v.data)) {
    throw new Error("El modelo no cumplió el esquema: falta 'data' (array).");
  }
  if (!Array.isArray(v.missing)) {
    throw new Error("El modelo no cumplió el esquema: falta 'missing' (array).");
  }
  if (typeof v.confidence !== "number" || !Number.isFinite(v.confidence)) {
    throw new Error("El modelo no cumplió el esquema: falta 'confidence' (number).");
  }
  for (const item of v.data) {
    if (typeof item !== "object" || item === null) {
      throw new Error("El modelo no cumplió el esquema: hay un item en 'data' que no es un objeto.");
    }
    const it = item as Record<string, unknown>;
    if (it.description != null && typeof it.description !== "string") {
      throw new Error("El modelo no cumplió el esquema: 'description' de un item debe ser string.");
    }
    if (it.quantity != null && (typeof it.quantity !== "number" || !Number.isFinite(it.quantity))) {
      throw new Error("El modelo no cumplió el esquema: 'quantity' de un item debe ser un número finito.");
    }
    if (it.precio != null && (typeof it.precio !== "number" || !Number.isFinite(it.precio))) {
      throw new Error("El modelo no cumplió el esquema: 'precio' de un item debe ser un número finito.");
    }
  }
  return value as LLMResponse;
}

export async function generateChatResponse(
  messages: Message[],
  _userId: string,
  conversationId?: string
): Promise<{ success: boolean; data?: BackendResponse; conversationId?: string; error?: string }> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY no está configurada.");
    }

    const { supabase, user } = await requireAuth();

    const latestMessage = messages[messages.length - 1]?.content;
    if (!latestMessage) throw new Error("Mensaje vacío.");

    // use conversation or create a new
    let currentConvId = conversationId ?? null;
    if (!currentConvId) {
      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .insert({ status: "IN_PROGRESS", user_id: user.id })
        .select()
        .single();

      if (convErr) throw new Error(convErr.message);
      currentConvId = conv.id;
    }

    // Sirve una tarea a la vez: toma el único pending_step activo (FR-004/FR-008)
    const { data: activeStep } = await supabase
      .from("pending_steps")
      .select("*, tasks(*)")
      .eq("conversation_id", currentConvId)
      .eq("status", "PENDING")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    // La memoria del chat es el estado (tasks_snapshot + pending_step), no el
    // historial de mensajes: cada prompt se construye desde cero con ese estado.
    const registeredTasks = await chatTasksService.listRegistered(currentConvId);

    // adition - clarification - fresh
    const flow = resolveFlow(activeStep?.step_type ?? null);
    const strategy = FLOW_STRATEGIES[flow];

     // if missing fields, enrich a message to user and require fields
    const activeTask = activeStep?.tasks as { quantity: number | null; precio: number | null } | undefined;

    const stepPrompt = strategy.prompt({
      latestMessage,
      registeredTasks,
      missingFields: activeTask ? missingFieldsOf(activeTask) : ["cantidad", "precio"],
      activeTaskDescription: activeStep?.tasks?.description,
    });

    const parsedJSON = await generateParsedResponse(stepPrompt);

    // El backend arma el mensaje del bot desde los datos que devolvió el LLM
    // (el LLM no escribe texto libre; solo identifica y llena el contrato).
    const { respuesta } = await strategy.run({ supabase, conversationId: currentConvId, parsedJSON, activeStep });

    if (parsedJSON.status === "completed") {
      const nextTask = await chatTasksService.findNextIncomplete(currentConvId);

      if (nextTask) {
        await enqueueStep(supabase, currentConvId, nextTask.id, "CLARIFY_DATOS");
      }
    }

    // Devuelve el estado completo: todas las tareas + el único paso activo
    const dbTareas = await chatTasksService.listAll(currentConvId);

    const { data: nextActiveStep } = await supabase
      .from("pending_steps")
      .select("*")
      .eq("conversation_id", currentConvId)
      .eq("status", "PENDING")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const { data: conversationRow } = await supabase
      .from("conversations")
      .select("id, cliente_id, trabajo_id")
      .eq("id", currentConvId)
      .single();

    // if tasks with null -> pending
    const finalStatus: "completed" | "pending" = nextActiveStep ? "pending" : "completed";

    const response: BackendResponse = {
      respuesta,
      status: finalStatus,
      tareas: dbTareas,
      active_pending_step: nextActiveStep
        ? { type: nextActiveStep.step_type, tarea_id: nextActiveStep.task_id }
        : null,
      conversation: {
        id: conversationRow?.id ?? currentConvId,
        cliente_id: conversationRow?.cliente_id ?? null,
        trabajo_id: conversationRow?.trabajo_id ?? null,
      },
    };

    return { success: true, data: response, conversationId: currentConvId };
  } catch (error: any) {
    console.error("Error calling Gemini/Supabase API:", error);
    return { success: false, error: error.message };
  }
}

export const loadChatTasksIntoJob: typeof chatLoadService.loadTasksIntoJob = async (...args) =>
  chatLoadService.loadTasksIntoJob(...args);
