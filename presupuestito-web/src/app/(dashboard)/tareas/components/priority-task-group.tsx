import { TareaItem } from "./tarea-item";
import { cn } from "@/lib/utils";

interface PriorityTaskGroupProps {
  title: string;
  tasks: any[];
  onToggle: (taskId: string, current: boolean) => void;
  onTogglePriority: (taskId: string, currentPriority: string | null) => void;
  onDelete: (taskId: string) => void;
  pendingId?: string | null;
  viewMode?: "list" | "board";
  totalCount?: number;
  isResumen?: boolean;
  onViewAll?: () => void;
}

export function PriorityTaskGroup({ title, tasks, onToggle, onTogglePriority, onDelete, pendingId, totalCount = 0, isResumen = false, onViewAll }: PriorityTaskGroupProps) {
  const effectiveCount = totalCount || tasks.length;
  const hasMore = isResumen && effectiveCount > tasks.length;

  const renderContent = () => {
    return (
      <>
        <div className="flex flex-col divide-y divide-outline-variant/10">
          {tasks.map((task) => (
            <TareaItem key={task.id} task={task} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} pending={pendingId === task.id} />
          ))}
        </div>
        {hasMore && onViewAll && (
          <div className="flex justify-center pt-3 pb-3 border-t border-outline-variant/10 bg-surface/30">
            <button 
              onClick={onViewAll}
              className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-variant/30 text-xs font-semibold text-on-surface-variant hover:text-primary transition-[background-color,color,transform] duration-[120ms] active:scale-95"
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

  if (tasks.length === 0 && effectiveCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-surface rounded-2xl border border-outline-variant/10 shadow-sm mb-6 last:mb-0">
      <div className="flex items-center justify-between gap-4 px-4 py-3 shrink-0 border-b border-outline-variant/10">
        <h3 className="text-[13px] font-bold text-on-surface-variant">
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
