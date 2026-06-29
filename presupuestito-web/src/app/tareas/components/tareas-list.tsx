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
  viewMode?: "list" | "board";
  pag: any;
}

export function TareasList({ groupedTasks, categoryCounts, filter, category, setCategory, viewMode = "list", onToggle, onTogglePriority, onDelete, pag }: TareasListProps) {
  const { alta, media, baja, completadas } = groupedTasks;
  const isResumen = category === "resumen";
  const activeTasks = category === "alta" ? alta : category === "media" ? media : baja;

  if (filter === "completadas") {
    if (completadas.length === 0) return <TareasEmpty filter={filter} />;
    return <PriorityTaskGroup title="Completadas" tasks={completadas} viewMode={viewMode} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />;
  }

  const hasPending = categoryCounts.alta > 0 || categoryCounts.media > 0 || categoryCounts.baja > 0;
  if (!hasPending) {
    return <TareasEmpty filter={filter} />;
  }

  // Si estamos en una vista especializada, renderizamos solo los items de esa categoría,
  // sin agrupadores extra (ya que el título de la página cumple esa función).
  if (!isResumen) {
    
    if (activeTasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-outline-variant/10 rounded-xl">
          <span className="text-on-surface-variant font-medium">No hay tareas en esta categoría.</span>
        </div>
      );
    }

    // Al tocar "ver más", el usuario quiere ver siempre la grilla cuadriculada
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {pag.paginatedItems.map(task => (
            <TareaItem key={task.id} task={task} viewMode="board" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
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

  if (viewMode === "board") {
    return (
      <div className="hidden md:grid grid-cols-3 gap-6 items-start">
        <PriorityTaskGroup title="Hoy" tasks={alta} totalCount={categoryCounts.alta} isResumen={isResumen} onViewAll={() => setCategory("alta")} viewMode="board" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
        <PriorityTaskGroup title="Próximamente" tasks={media} totalCount={categoryCounts.media} isResumen={isResumen} onViewAll={() => setCategory("media")} viewMode="board" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
        <PriorityTaskGroup title="Sin apuro" tasks={baja} totalCount={categoryCounts.baja} isResumen={isResumen} onViewAll={() => setCategory("baja")} viewMode="board" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
      </div>
    );
  }

  return (
    <div>
      <PriorityTaskGroup title="Hoy" tasks={alta} totalCount={categoryCounts.alta} isResumen={isResumen} onViewAll={() => setCategory("alta")} viewMode="list" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
      <PriorityTaskGroup title="Próximamente" tasks={media} totalCount={categoryCounts.media} isResumen={isResumen} onViewAll={() => setCategory("media")} viewMode="list" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
      <PriorityTaskGroup title="Sin apuro" tasks={baja} totalCount={categoryCounts.baja} isResumen={isResumen} onViewAll={() => setCategory("baja")} viewMode="list" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
    </div>
  );
}
