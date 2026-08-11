import { TareasEmpty } from "./tareas-empty";
import { PriorityTaskGroup } from "./priority-task-group";
import { TareaItem } from "./tarea-item";
import type { FilterType, CategoryType } from "../hooks/use-tareas";
import { PaginationButtons } from "@/components/ui/pagination-buttons";

interface TareasListProps {
  groupedTasks: {
    alta: any[];
    media: any[];
    baja: any[];
    completadas: any[];
  };
  categoryCounts: {
    alta: number;
    media: number;
    baja: number;
  };
  filter: FilterType;
  category: CategoryType;
  setCategory: (c: CategoryType) => void;
  onToggle: (taskId: string, current: boolean) => void;
  onTogglePriority: (taskId: string, currentPriority: string | null) => void;
  onDelete: (taskId: string) => void;
  pendingId?: string | null;
  pag: any;
}

export function TareasList({ groupedTasks, categoryCounts, filter, category, setCategory, onToggle, onTogglePriority, onDelete, pendingId, pag }: TareasListProps) {
  const { alta, media, baja, completadas } = groupedTasks;
  const isResumen = category === "resumen";
  const activeTasks = category === "alta" ? alta : category === "media" ? media : baja;

  if (filter === "completadas") {
    if (completadas.length === 0) return <TareasEmpty filter={filter} />;
    return <PriorityTaskGroup title="Completadas" tasks={completadas} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} pendingId={pendingId} />;
  }

  const hasPending = categoryCounts.alta > 0 || categoryCounts.media > 0 || categoryCounts.baja > 0;
  if (!hasPending) {
    return <TareasEmpty filter={filter} />;
  }

  if (!isResumen) {
    if (activeTasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-outline-variant/10 rounded-xl">
          <span className="text-on-surface-variant font-medium">No hay tareas en esta categoría.</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {pag.paginatedItems.map(task => (
            <div key={task.id} className="bg-surface rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden h-full">
              <TareaItem task={task} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} pending={pendingId === task.id} />
            </div>
          ))}
        </div>
        <div className="pb-8">
          <PaginationButtons
            currentPage={pag.currentPage}
            totalPages={pag.totalPages}
            totalItems={pag.totalItems}
            pageSize={pag.pageSize}
            onPageChange={pag.goToPage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full" aria-live="polite">
      <PriorityTaskGroup title="Hoy" tasks={alta} totalCount={categoryCounts.alta} isResumen={isResumen} onViewAll={() => setCategory("alta")} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} pendingId={pendingId} />
      <PriorityTaskGroup title="Próximamente" tasks={media} totalCount={categoryCounts.media} isResumen={isResumen} onViewAll={() => setCategory("media")} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} pendingId={pendingId} />
      <PriorityTaskGroup title="Sin apuro" tasks={baja} totalCount={categoryCounts.baja} isResumen={isResumen} onViewAll={() => setCategory("baja")} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} pendingId={pendingId} />
    </div>
  );
}
