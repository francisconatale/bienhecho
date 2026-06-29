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
          <button 
            onClick={onViewAll}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm transition-colors text-center border border-primary/10"
          >
            Ver todas (Total: {effectiveCount})
          </button>
        )}
      </div>
    </div>
  );
}
