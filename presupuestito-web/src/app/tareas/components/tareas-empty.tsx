import { Check, Circle } from "lucide-react";
import type { FilterType } from "../hooks/use-tareas";

interface TareasEmptyProps {
  filter: FilterType;
}

export function TareasEmpty({ filter }: TareasEmptyProps) {
  return (
    <div className="py-20 text-center">
      <div className="bg-on-surface/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        {filter === "pendientes" ? (
          <Check className="w-8 h-8 text-emerald-500/40" />
        ) : (
          <Circle className="w-8 h-8 text-on-surface-variant/20" />
        )}
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-1">
        {filter === "pendientes" ? "Todo completado" : "Sin completadas"}
      </h3>
      <p className="text-sm text-on-surface-variant/40">
        {filter === "pendientes"
          ? "No hay tareas pendientes."
          : "Aún no completaste ninguna tarea."}
      </p>
    </div>
  );
}
