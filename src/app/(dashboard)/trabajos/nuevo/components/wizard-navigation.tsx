import { ArrowRight, Sparkles } from "lucide-react";

interface Props {
  currentQ: number;
  isLast: boolean;
  canAdvance: () => boolean;
  canSave: boolean;
  isLoading?: boolean;
  prev: () => void;
  next: () => void;
  handleSave: () => void;
}

export function WizardNavigation({ currentQ, isLast, canAdvance, canSave, isLoading, prev, next, handleSave }: Props) {
  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant/10">
      <button
        onClick={prev}
        disabled={currentQ === 0}
        className={`text-sm font-semibold transition-colors cursor-pointer ${
          currentQ === 0
            ? "text-on-surface-variant/20 cursor-not-allowed"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        ← Anterior
      </button>

      {!isLast ? (
        <button
          onClick={next}
          disabled={!canAdvance()}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
            canAdvance()
              ? "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary-dark active:scale-95"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
          }`}
        >
          Siguiente
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      ) : (
        <button
          onClick={handleSave}
          disabled={!canSave || isLoading}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
            canSave && !isLoading
              ? "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary-dark active:scale-95"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
          {isLoading ? "Creando..." : "Crear Trabajo"}
        </button>
      )}
    </div>
  );
}
