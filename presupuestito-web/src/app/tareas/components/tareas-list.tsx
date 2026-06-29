import { TareaItem } from "./tarea-item";
import { TareasEmpty } from "./tareas-empty";
import type { FilterType } from "../hooks/use-tareas";

interface TareasListProps {
  items: any[];
  filter: FilterType;
  onToggle: (taskId: string, current: boolean) => void;
}

export function TareasList({ items, filter, onToggle }: TareasListProps) {
  if (items.length === 0) {
    return <TareasEmpty filter={filter} />;
  }

  return (
    <div className="space-y-3">
      {items.map((task) => (
        <TareaItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </div>
  );
}
