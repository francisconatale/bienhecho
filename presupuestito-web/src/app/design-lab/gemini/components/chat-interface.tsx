"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useChatTasks } from "../hooks/use-chat-tasks";
import { generateChatResponse as defaultGenerateChatResponse } from "../actions";

interface ChatInterfaceProps {
  userId: string;
  action?: typeof defaultGenerateChatResponse;
}

export function ChatInterface({ userId, action = defaultGenerateChatResponse }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const { messages, addMessage, setLoading, isLoading, updateFromBackend, conversationId } = useChatTasks();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user" as const, content: input.trim() };
    addMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      const res = await action([...messages, userMsg], userId, conversationId || undefined);
      if (res.success && res.data) {
        updateFromBackend(res.data, res.conversationId);
      } else {
        console.error("Error del backend:", res.error);
        addMessage({ role: "assistant", content: "Hubo un error al procesar tu solicitud." });
      }
    } catch (error) {
      console.error(error);
      addMessage({ role: "assistant", content: "Hubo un error de conexión." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-surface border border-outline-variant/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-on-surface-variant text-sm mt-8">
            Escribí lo que querés hacer para comenzar.
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === "user"
                ? "bg-primary text-white ml-auto rounded-br-none"
                : "bg-surface border border-outline-variant/10 text-on-surface mr-auto rounded-bl-none"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-surface border border-outline-variant/10 text-on-surface mr-auto rounded-2xl rounded-bl-none p-3 max-w-[80%]">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-outline-variant/10 bg-surface">
        <form onSubmit={handleSend} className="flex gap-2 items-center relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej: Necesito cargar 2 cocas..."
            className="flex-1 bg-transparent border border-outline-variant/10 rounded-full px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-primary text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center shrink-0"
          >
            <Send className="w-5 h-5" strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
}
