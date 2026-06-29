import { TareaItem } from "./tarea-item";

interface PriorityTaskGroupProps {
  title: string;
  tasks: any[];
  onToggle: (taskId: string, current: boolean) => void;
}

export function PriorityTaskGroup({ title, tasks, onToggle }: PriorityTaskGroupProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-semibold text-on-surface-variant/80 mb-3 ml-1 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TareaItem key={task.id} task={task} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}
