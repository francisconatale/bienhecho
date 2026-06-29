import { TareasEmpty } from "./tareas-empty";
import { PriorityTaskGroup } from "./priority-task-group";
import type { FilterType } from "../hooks/use-tareas";

interface TareasListProps {
  groupedTasks: {
    alta: any[];
    media: any[];
    baja: any[];
    completadas: any[];
  };
  filter: FilterType;
  onToggle: (taskId: string, current: boolean) => void;
  onTogglePriority: (taskId: string, currentPriority: string | null) => void;
  onDelete: (taskId: string) => void;
  viewMode?: "list" | "board";
}

export function TareasList({ groupedTasks, filter, viewMode = "list", onToggle, onTogglePriority, onDelete }: TareasListProps) {
  const { alta, media, baja, completadas } = groupedTasks;

  if (filter === "completadas") {
    if (completadas.length === 0) return <TareasEmpty filter={filter} />;
    return <PriorityTaskGroup title="Completadas" tasks={completadas} viewMode={viewMode} onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />;
  }

  const hasPending = alta.length > 0 || media.length > 0 || baja.length > 0;
  if (!hasPending) {
    return <TareasEmpty filter={filter} />;
  }

  if (viewMode === "board") {
    return (
      <div className="hidden md:grid grid-cols-3 gap-6 items-start">
        <PriorityTaskGroup title="Hoy" tasks={alta} viewMode="board" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
        <PriorityTaskGroup title="Próximamente" tasks={media} viewMode="board" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
        <PriorityTaskGroup title="Sin apuro" tasks={baja} viewMode="board" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
      </div>
    );
  }

  return (
    <div>
      <PriorityTaskGroup title="Hoy" tasks={alta} viewMode="list" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
      <PriorityTaskGroup title="Próximamente" tasks={media} viewMode="list" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
      <PriorityTaskGroup title="Sin apuro" tasks={baja} viewMode="list" onToggle={onToggle} onTogglePriority={onTogglePriority} onDelete={onDelete} />
    </div>
  );
}
