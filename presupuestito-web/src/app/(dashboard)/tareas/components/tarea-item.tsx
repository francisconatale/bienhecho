import { Check, Briefcase, Flame, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TareaItemProps {
  task: any; // Type as needed, ideally Task with job and client attached
  onToggle: (taskId: string, current: boolean) => void;
  onTogglePriority: (taskId: string, currentPriority: string | null) => void;
  onDelete: (taskId: string) => void;
  viewMode?: "list" | "board";
}

export function TareaItem({ task, onToggle, onTogglePriority, onDelete }: TareaItemProps) {
  return (
    <div className="transition-[background-color] duration-[120ms] group flex items-center gap-4 px-4 py-3 bg-transparent hover:bg-on-surface/5">
      {/* Top Row: Checkbox & Title */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={() => onToggle(task.id, task.completada)}
          role="checkbox"
          aria-checked={task.completada}
          aria-label={task.completada ? `Marcar "${task.descripcion}" como pendiente` : `Marcar "${task.descripcion}" como completada`}
          className={cn(
            "rounded-lg border-2 flex items-center justify-center shrink-0 transition-[background-color,border-color,transform] duration-[100ms] active:scale-90 w-6 h-6",
            task.completada
              ? "bg-emerald-500 border-emerald-500"
              : "border-outline-variant/30 hover:border-primary/50 group-hover:border-primary/40"
          )}
        >
          {task.completada && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </button>

        <Link href={`/tareas/${task.id}`} className="flex-1 min-w-0">
          <p
            className={cn(
              "font-bold transition-[color,text-decoration-color] duration-[180ms] line-clamp-2 text-sm",
              task.completada
                ? "text-on-surface-variant/40 line-through"
                : "text-on-surface"
            )}
          >
            {task.descripcion}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant/40 mt-0.5">
            <Briefcase className="w-3 h-3" />
            <span className="font-bold truncate">{task.job?.titulo}</span>
            <span className="opacity-30 shrink-0">•</span>
            <span className="truncate">{task.client?.nombre}</span>
          </div>
        </Link>
      </div>

      {/* Metadata & Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Price and Actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {task.precio !== null && (
            <span className="font-bold text-on-surface/50 cursor-default select-none hidden sm:inline-block text-xs mr-2">
              ${task.precio.toLocaleString("es-AR")}
            </span>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePriority(task.id, task.prioridad)}
              title={task.prioridad === "alta" ? "Prioridad Alta" : task.prioridad === "media" ? "Prioridad Media" : "Prioridad Baja"}
              aria-label={`Prioridad actual: ${task.prioridad || "ninguna"}. Cambiar prioridad.`}
              className={cn(
                "p-1.5 rounded-full transition-[background-color,color] duration-[120ms]",
                task.prioridad === "alta" 
                  ? "text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 opacity-100" 
                  : task.prioridad === "media"
                  ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 opacity-100"
                  : "text-on-surface-variant/30 hover:text-orange-500 hover:bg-orange-500/10"
              )}
            >
              <Flame className={cn("w-[18px] h-[18px]", task.prioridad === "alta" ? "fill-orange-500" : task.prioridad === "media" ? "fill-amber-500" : "")} />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              title="Eliminar tarea"
              aria-label={`Eliminar tarea: ${task.descripcion}`}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-on-surface-variant/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
