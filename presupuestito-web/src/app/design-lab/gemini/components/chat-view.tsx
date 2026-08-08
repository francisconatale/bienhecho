"use client";

import { useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

export function ChatView() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "¡Hola! Soy Gemini. ¿En qué te puedo ayudar hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Import on demand or via top level import
      const { generateChatResponse } = await import("../actions");
      const result = await generateChatResponse(newMessages);
      
      if (result.success && result.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.text }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${result.error || "Algo salió mal"}` }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ocurrió un error de conexión." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-surface">
      {/* Header */}
      <header className="flex-none p-4 border-b border-outline-variant/10 bg-surface z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Bot className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-semibold text-on-surface text-lg">Gemini Chat</h1>
            <p className="text-xs text-on-surface-variant">Prueba de integración</p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[80%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`flex-none w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-surface text-primary border border-outline-variant/10 shadow-sm"
              }`}
            >
              {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            
            <div
              className={`p-4 rounded-2xl text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-tr-sm"
                  : "bg-surface border border-outline-variant/10 text-on-surface rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="flex-none w-8 h-8 rounded-full bg-surface text-primary border border-outline-variant/10 shadow-sm flex items-center justify-center mt-1">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/10 text-on-surface rounded-tl-sm shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-on-surface-variant">Escribiendo...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 bg-surface border-t border-outline-variant/10">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 max-w-4xl mx-auto relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-4 pr-14 rounded-full bg-surface border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface placeholder:text-on-surface-variant transition-all shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
