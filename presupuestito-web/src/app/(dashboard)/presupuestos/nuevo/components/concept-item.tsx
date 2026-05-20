import { Pencil, Trash2 } from "lucide-react";

interface ConceptItemProps {
  name: string;
  description: string;
  amount: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function ConceptItem({ name, description, amount, onEdit, onDelete }: ConceptItemProps) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3.5 border-b border-outline-variant/10 last:border-0 group">
      <div className="flex justify-between w-full items-start gap-3 sm:gap-4">
        {/* Texts section */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-on-surface block break-words">{name}</span>
          {description && (
            <span className="text-xs text-on-surface-variant block mt-0.5 line-clamp-2">
              {description}
            </span>
          )}
        </div>
        
        {/* Right side: Amount and Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={onEdit}
              className="p-1.5 text-on-surface-variant hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
            >
              <Pencil className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button 
              onClick={onDelete}
              className="p-1.5 text-on-surface-variant hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
          </div>
          <span className="font-semibold text-on-surface whitespace-nowrap">{amount}</span>
        </div>
      </div>
    </div>
  );
}
