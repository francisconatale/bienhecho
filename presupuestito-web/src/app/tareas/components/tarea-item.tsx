import { Check, Briefcase } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TareaItemProps {
  task: any; // Type as needed, ideally Task with job and client attached
  onToggle: (taskId: string, current: boolean) => void;
}

export function TareaItem({ task, onToggle }: TareaItemProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 bg-surface/30 dark:bg-surface/10 backdrop-blur-xl rounded-[28px] border border-outline-variant/10 shadow-sm transition-all hover:-translate-y-0.5 group">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id, task.completada)}
        className={cn(
          "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all active:scale-90",
          task.completada
            ? "bg-emerald-500 border-emerald-500"
            : "border-outline-variant/30 hover:border-primary/50 group-hover:border-primary/40"
        )}
      >
        {task.completada && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <Link href={`/tareas/${task.id}`} className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-bold transition-all",
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

      {/* Price */}
      {task.precio !== null && (
        <span className="text-xs font-bold text-on-surface/50 shrink-0 cursor-default select-none">
          ${task.precio.toLocaleString("es-AR")}
        </span>
      )}
    </div>
  );
}
