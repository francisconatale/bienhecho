"use client";

import { useEffect, useState } from "react";
import { ChatInterface } from "./chat-interface";
import { TaskList } from "./task-list";
import { TaskLoadPanel } from "./task-load-panel";
import { generateChatResponse } from "../actions";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

const supabase = createClient();

export function ChatView() {
  const [userId, setUserId] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setUserId(data.session.user.id);
      } else {
        setAuthError(true);
      }
    });
  }, []);

  if (authError) {
    return (
      <div className="flex h-full w-full items-center justify-center text-on-surface-variant p-4">
        <p>Necesitas estar logueado para probar el chat (requerido por la base de datos).</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[85vh] max-w-6xl mx-auto w-full p-4 md:p-6">
      <div className="flex-1 min-w-0 h-full flex flex-col">
        <h2 className="font-semibold text-on-surface text-lg mb-4 px-2">Asistente de Presupuestos</h2>
        <ChatInterface userId={userId} action={generateChatResponse} />
      </div>
      
      <div className="w-full md:w-96 flex-none bg-surface border border-outline-variant/10 rounded-2xl overflow-y-auto p-4 shadow-sm h-full">
        <TaskList />
        <TaskLoadPanel />
      </div>
    </div>
  );
}
