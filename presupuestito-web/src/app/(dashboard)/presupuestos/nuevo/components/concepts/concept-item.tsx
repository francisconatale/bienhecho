import { Pencil, Trash2 } from "lucide-react";

interface ConceptItemProps {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  price: string;
  amount: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function ConceptItem({ name, description, quantity, unit, price, amount, onEdit, onDelete }: ConceptItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/5 transition-colors group border-b border-outline-variant/10 last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-on-surface truncate">{name}</span>
          <span className="text-[10px] text-on-surface-variant/60 tabular-nums shrink-0">
            {quantity}{unit} × {price}
          </span>
        </div>
        {description && (
          <p className="text-xs text-on-surface-variant/60 mt-0.5 truncate">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-semibold tabular-nums text-on-surface">{amount}</span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 hover:bg-primary/10 rounded transition-colors"
            aria-label={`Editar ${name}`}
          >
            <Pencil className="w-3 h-3 text-on-surface-variant/60" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-error/10 rounded transition-colors"
            aria-label={`Eliminar ${name}`}
          >
            <Trash2 className="w-3 h-3 text-on-surface-variant/60" />
          </button>
        </div>
      </div>
    </div>
  );
}
