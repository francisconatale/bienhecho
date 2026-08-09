export interface WorkItem {
  description: string;
  quantity?: number | null;
  precio?: number | null;
  add?: boolean | null;  // increment quantity in task
}

export type MissingField = "cantidad" | "precio";

export type Intent =
  | "CREATE_TASK"
  | "UPDATE_TASK"
  | "DELETE_TASK"
  | "QUERY_TASK"
  | "UNKNOWN";

export interface RegisteredTask {
  description: string;
  quantity: number | null;
  precio: number | null;
}

export interface LLMResponse {
  intent: Intent;
  status: "completed" | "pending";
  data: WorkItem[];
  missing: string[];
  confidence: number;
}

export interface BackendResponse {
  respuesta: string;
  status: "completed" | "pending";
  tareas: Tarea[];
  active_pending_step: PendingStep | null;
  conversation: ConversationMeta;
}

export interface ConversationMeta {
  id: string;
  cliente_id: string | null;
  trabajo_id: string | null;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Tarea {
  id: string;
  descripcion: string;
  cantidad: number | null;
  precio: number | null;
}

export interface PendingStep {
  type: string;
  tarea_id: string;
}
