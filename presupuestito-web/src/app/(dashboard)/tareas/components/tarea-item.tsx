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

export function TareaItem({ task, viewMode = "list", onToggle, onTogglePriority, onDelete }: TareaItemProps) {
  const isBoard = viewMode === "board";

  return (
    <div className={cn(
      "transition-all group",
      isBoard 
        ? "bg-surface/30 dark:bg-surface/10 backdrop-blur-xl border border-outline-variant/10 shadow-sm hover:-translate-y-0.5 flex flex-col gap-3 p-4 rounded-xl hover:shadow-md hover:scale-[1.02]" 
        : "flex items-center gap-4 px-4 py-3 bg-transparent hover:bg-on-surface/5"
    )}>
      {/* Top Row: Checkbox & Title */}
      <div className={cn("flex w-full", isBoard ? "items-start gap-3" : "items-center gap-4 flex-1 min-w-0")}>
        <button
          onClick={() => onToggle(task.id, task.completada)}
          role="checkbox"
          aria-checked={task.completada}
          aria-label={task.completada ? `Marcar "${task.descripcion}" como pendiente` : `Marcar "${task.descripcion}" como completada`}
          className={cn(
            "rounded-lg border-2 flex items-center justify-center shrink-0 transition-all active:scale-90",
            isBoard ? "w-5 h-5 mt-0.5" : "w-6 h-6",
            task.completada
              ? "bg-emerald-500 border-emerald-500"
              : "border-outline-variant/30 hover:border-primary/50 group-hover:border-primary/40"
          )}
        >
          {task.completada && <Check className={isBoard ? "w-3 h-3 text-white" : "w-3.5 h-3.5 text-white"} strokeWidth={3} />}
        </button>

        <Link href={`/tareas/${task.id}`} className="flex-1 min-w-0">
          <p
            className={cn(
              "font-bold transition-all line-clamp-2",
              isBoard ? "text-[13px] leading-tight" : "text-sm",
              task.completada
                ? "text-on-surface-variant/40 line-through"
                : "text-on-surface"
            )}
          >
            {task.descripcion}
          </p>
          {!isBoard && (
            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant/40 mt-0.5">
              <Briefcase className="w-3 h-3" />
              <span className="font-bold truncate">{task.job?.titulo}</span>
              <span className="opacity-30 shrink-0">•</span>
              <span className="truncate">{task.client?.nombre}</span>
            </div>
          )}
        </Link>
      </div>

      {/* Board Metadata & Actions (Bottom Row for Board, Right aligned for List) */}
      <div className={cn(
        "flex shrink-0",
        isBoard ? "w-full items-center justify-between mt-auto pt-2 border-t border-outline-variant/5" : "items-center gap-2"
      )}>
        {/* Left Side Metadata (only for Board) */}
        {isBoard && (
          <div className="flex flex-col gap-1 text-[10px] text-on-surface-variant/50 max-w-[60%]">
            <div className="flex items-center gap-1.5 truncate">
              <Briefcase className="w-3 h-3 shrink-0" />
              <span className="font-bold truncate">{task.job?.titulo}</span>
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {task.precio !== null && (
            <span className={cn(
              "font-bold text-on-surface/50 cursor-default select-none hidden sm:inline-block mr-1",
              isBoard ? "text-[11px]" : "text-xs mr-2"
            )}>
              ${task.precio.toLocaleString("es-AR")}
            </span>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePriority(task.id, task.prioridad)}
              title={task.prioridad === "alta" ? "Prioridad Alta" : task.prioridad === "media" ? "Prioridad Media" : "Prioridad Baja"}
              aria-label={`Prioridad actual: ${task.prioridad || "ninguna"}. Cambiar prioridad.`}
              className={cn(
                "p-1.5 rounded-full transition-all",
                task.prioridad === "alta" 
                  ? "text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 opacity-100" 
                  : task.prioridad === "media"
                  ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 opacity-100"
                  : "text-on-surface-variant/30 hover:text-orange-500 hover:bg-orange-500/10"
              )}
            >
              <Flame className={cn(isBoard ? "w-4 h-4" : "w-[18px] h-[18px]", task.prioridad === "alta" ? "fill-orange-500" : task.prioridad === "media" ? "fill-amber-500" : "")} />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              title="Eliminar tarea"
              aria-label={`Eliminar tarea: ${task.descripcion}`}
              className={cn(
                "p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-on-surface-variant/30 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              )}
            >
              <Trash2 className={isBoard ? "w-4 h-4" : "w-[18px] h-[18px]"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
