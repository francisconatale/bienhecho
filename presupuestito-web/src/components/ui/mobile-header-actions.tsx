import { Pencil, Trash2, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderActionsProps {
  isEditing: boolean;
  onEditStart?: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete?: () => void;
  hasChanges?: boolean;
}

export function MobileHeaderActions({
  isEditing,
  onEditStart,
  onCancel,
  onSave,
  onDelete,
  hasChanges = true,
}: MobileHeaderActionsProps) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-on-surface/10 text-on-surface-variant transition-colors transition-transform active:scale-95 cursor-pointer"
          title="Cancelar"
        >
          <X className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!hasChanges}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors transition-transform active:scale-95 cursor-pointer",
            hasChanges
              ? "bg-primary text-white shadow-md hover:bg-primary-dark"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
          )}
          title="Guardar"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {onEditStart && (
        <button
          type="button"
          onClick={onEditStart}
          className="w-10 h-10 rounded-full bg-on-surface/5 hover:bg-on-surface/10 flex items-center justify-center transition-colors transition-transform active:scale-95 text-on-surface-variant hover:text-primary cursor-pointer"
          title="Editar"
        >
          <Pencil className="w-4 h-4 text-on-surface" strokeWidth={2.5} />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="w-10 h-10 rounded-full bg-on-surface/5 hover:bg-on-surface/10 flex items-center justify-center transition-colors transition-transform active:scale-95 text-on-surface-variant hover:text-error cursor-pointer"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
