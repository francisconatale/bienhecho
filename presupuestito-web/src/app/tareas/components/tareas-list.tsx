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
}

export function TareasList({ groupedTasks, filter, onToggle }: TareasListProps) {
  const { alta, media, baja, completadas } = groupedTasks;

  if (filter === "completadas") {
    if (completadas.length === 0) return <TareasEmpty filter={filter} />;
    return <PriorityTaskGroup title="Completadas" tasks={completadas} onToggle={onToggle} />;
  }

  const hasPending = alta.length > 0 || media.length > 0 || baja.length > 0;
  if (!hasPending) {
    return <TareasEmpty filter={filter} />;
  }

  return (
    <div>
      <PriorityTaskGroup title="Hoy" tasks={alta} onToggle={onToggle} />
      <PriorityTaskGroup title="Próximamente" tasks={media} onToggle={onToggle} />
      <PriorityTaskGroup title="Sin apuro" tasks={baja} onToggle={onToggle} />
    </div>
  );
}
