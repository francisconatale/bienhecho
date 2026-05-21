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
    <div className="flex flex-col gap-1 px-4 py-3.5 border-b border-outline-variant/10 last:border-0 group hover:bg-surface-container-low/30 transition-all duration-200">
      <div className="flex justify-between w-full items-start gap-3">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-bold text-[15px] text-on-surface truncate tracking-tight">{name}</span>
            <span className="text-[11px] text-on-surface-variant font-bold opacity-40 tabular-nums">
              {quantity} {unit === 'horas' ? 'hs' : unit === 'unidades' ? 'unid' : 'un'} × {price}
            </span>
          </div>
          {description && (
            <span className="text-xs text-on-surface-variant/80 block mt-1 line-clamp-2 leading-relaxed">
              {description}
            </span>
          )}
        </div>
        
        {/* Amount & Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-black text-[15px] text-on-surface tabular-nums tracking-tighter">{amount}</span>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={onEdit}
              className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-90"
              aria-label={`Editar ${name}`}
            >
              <Pencil className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 text-on-surface-variant/40 hover:text-error hover:bg-error/10 rounded-xl transition-all active:scale-90"
              aria-label={`Eliminar ${name}`}
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

