import { TareasEmpty } from "./tareas-empty";
import { PriorityTaskGroup } from "./priority-task-group";
import type { FilterType, CategoryType } from "../hooks/use-tareas";

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
}

export function TareasList({ groupedTasks, categoryCounts, filter, category, setCategory, viewMode = "list", onToggle, onTogglePriority, onDelete }: TareasListProps) {
  const { alta, media, baja, completadas } = groupedTasks;

  if (filter === "completadas") {
    if (completadas.length === 0) return <TareasEmpty filter={filter} />;
    return <PriorityTaskGroup title="Completadas" tasks={completadas} viewMode={viewMode} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />;
  }

  const hasPending = categoryCounts.alta > 0 || categoryCounts.media > 0 || categoryCounts.baja > 0;
  if (!hasPending) {
    return <TareasEmpty filter={filter} />;
  }

  const isResumen = category === "resumen";

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
