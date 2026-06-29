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

  const renderContent = () => {
    if (tasks.length === 0 && effectiveCount === 0) {
      if (viewMode === "board") {
        return (
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="w-full h-full border-2 border-dashed border-outline-variant/10 rounded-xl flex items-center justify-center min-h-[120px]">
              <span className="text-xs text-on-surface-variant/40 font-medium">Vacío</span>
            </div>
          </div>
        );
      }
      return null;
    }

    return (
      <>
        <div className={cn(
          "flex flex-col",
          viewMode === "list" ? "divide-y divide-outline-variant/10" : "p-4 space-y-3"
        )}>
          {tasks.map((task) => (
            <TareaItem key={task.id} task={task} viewMode={viewMode} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
          ))}
        </div>
        {hasMore && onViewAll && (
          <div className={cn(
            "flex justify-center",
            viewMode === "list" ? "pt-3 pb-3 border-t border-outline-variant/10 bg-surface/30" : "px-4 pb-4"
          )}>
            <button 
              onClick={onViewAll}
              className={cn(
                "group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-variant/30 text-xs font-semibold text-on-surface-variant hover:text-primary transition-all active:scale-95",
                viewMode === "board" && "w-full justify-center bg-surface-variant/10"
              )}
            >
              <span>Mostrar {effectiveCount - tasks.length} tareas más</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        )}
      </>
    );
  };

  if (tasks.length === 0 && effectiveCount === 0 && viewMode === "list") {
    return null;
  }

  return (
    <div className={cn(
      "flex flex-col bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm transition-all",
      viewMode === "board" ? "h-full" : "mb-6 last:mb-0"
    )}>
      <div className="flex items-center justify-between gap-4 px-4 py-4 border-b border-outline-variant/10 bg-surface/50 shrink-0">
        <h3 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-widest">
          {title}
        </h3>
        <span className="bg-surface-variant/30 text-[10px] px-2 py-0.5 rounded-full font-bold text-on-surface-variant/70">
          {effectiveCount}
        </span>
      </div>
      
      {renderContent()}
    </div>
  );
}
