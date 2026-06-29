import { TareaItem } from "./tarea-item";
import { cn } from "@/lib/utils";

interface PriorityTaskGroupProps {
  title: string;
  tasks: any[];
  onToggle: (taskId: string, current: boolean) => void;
  onTogglePriority: (taskId: string, currentPriority: string | null) => void;
  onDelete: (taskId: string) => void;
  viewMode?: "list" | "board";
  totalCount?: number;
  isResumen?: boolean;
  onViewAll?: () => void;
}

export function PriorityTaskGroup({ title, tasks, viewMode = "list", onToggle, onTogglePriority, onDelete, totalCount = 0, isResumen = false, onViewAll }: PriorityTaskGroupProps) {
  const effectiveCount = totalCount || tasks.length;
  const hasMore = isResumen && effectiveCount > tasks.length;

  if (tasks.length === 0 && effectiveCount === 0) {
    if (viewMode === "board") {
      // Return an empty column in board mode to keep the grid structure
      return (
        <div className="bg-surface/20 backdrop-blur-xl rounded-[28px] p-4 border border-outline-variant/10 shadow-sm flex flex-col h-full min-h-[200px]">
          <h3 className="text-sm font-bold text-on-surface-variant/80 mb-4 ml-1 uppercase tracking-wider flex items-center justify-between">
            <span>{title}</span>
            <span className="bg-surface-variant/30 text-[10px] px-2 py-0.5 rounded-full">{effectiveCount}</span>
          </h3>
          <div className="flex-1 border-2 border-dashed border-outline-variant/10 rounded-[20px] flex items-center justify-center">
            <span className="text-xs text-on-surface-variant/40 font-medium">Vacío</span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={cn(
      "last:mb-0 transition-all",
      viewMode === "board" 
        ? "bg-surface/20 backdrop-blur-xl rounded-[28px] p-4 border border-outline-variant/10 shadow-sm flex flex-col h-full"
        : "mb-6"
    )}>
      <h3 className={cn(
        "text-sm font-bold text-on-surface-variant/80 ml-1 uppercase tracking-wider flex items-center justify-between",
        viewMode === "board" ? "mb-4" : "mb-3"
      )}>
        <span>{title}</span>
        {viewMode === "board" && (
          <span className="bg-surface-variant/30 text-[10px] px-2 py-0.5 rounded-full text-on-surface-variant/70">{effectiveCount}</span>
        )}
      </h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TareaItem key={task.id} task={task} viewMode={viewMode} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
        ))}
        {hasMore && onViewAll && (
          <div className="pt-3 pb-1 flex justify-center">
            <button 
              onClick={onViewAll}
              className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-variant/30 text-xs font-semibold text-on-surface-variant hover:text-primary transition-all active:scale-95"
            >
              <span>Mostrar {effectiveCount - tasks.length} tareas más</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
