"use client";

import { CheckCircle2, CircleDashed } from "lucide-react";
import { useChatTasks } from "../hooks/use-chat-tasks";

export function TaskList() {
  const { tareas, active_pending_step } = useChatTasks();

  if (tareas.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-on-surface text-sm px-2">Tareas Detectadas</h3>
      <div className="flex flex-col gap-2">
        {tareas.map((tarea) => {
          const isPending = active_pending_step?.tarea_id === tarea.id;
          const isComplete = tarea.cantidad !== null && tarea.precio !== null;

          return (
            <div
              key={tarea.id}
              className={`p-4 rounded-2xl border transition-all ${
                isPending 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "border-outline-variant/10 bg-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                {isComplete && !isPending ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" strokeWidth={2} />
                ) : (
                  <CircleDashed className={`w-5 h-5 shrink-0 ${isPending ? 'text-primary animate-pulse' : 'text-on-surface-variant'}`} strokeWidth={2} />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface truncate">{tarea.descripcion}</p>
                  <p className="text-xs text-on-surface-variant">
                    {tarea.cantidad !== null ? `${tarea.cantidad} x` : "Cantidad: falta definir"}
                    {" · "}
                    {tarea.precio !== null ? `$${tarea.precio}` : "Precio: falta definir"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
