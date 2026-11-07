import { create } from "zustand";
import { Message, Tarea, PendingStep, ConversationMeta } from "../types/chat";

interface ChatState {
  messages: Message[];
  status: "completed" | "pending";
  tareas: Tarea[];
  active_pending_step: PendingStep | null;
  isLoading: boolean;
  conversationId: string | null;
  conversation: ConversationMeta | null;

  // Actions
  addMessage: (msg: Message) => void;
  setLoading: (loading: boolean) => void;
  updateFromBackend: (data: { respuesta: string; status: "completed" | "pending"; tareas: Tarea[]; active_pending_step: PendingStep | null; conversation: ConversationMeta }, convId?: string) => void;
  setConversation: (conv: ConversationMeta) => void;
  reset: () => void;
}

export const useChatTasks = create<ChatState>((set) => ({
  messages: [],
  status: "completed",
  tareas: [],
  active_pending_step: null,
  isLoading: false,
  conversationId: null,
  conversation: null,

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setLoading: (loading) => set({ isLoading: loading }),
  updateFromBackend: (data, convId) =>
    set((state) => ({
      messages: [...state.messages, { role: "assistant", content: data.respuesta }],
      status: data.status,
      tareas: data.tareas,
      active_pending_step: data.active_pending_step,
      conversationId: convId || state.conversationId,
      conversation: data.conversation,
    })),
  setConversation: (conv) =>
    set((state) => ({
      conversation: conv,
      conversationId: conv.id || state.conversationId,
    })),
  reset: () =>
    set({
      messages: [],
      status: "completed",
      tareas: [],
      active_pending_step: null,
      isLoading: false,
      conversationId: null,
      conversation: null,
    }),
}));
