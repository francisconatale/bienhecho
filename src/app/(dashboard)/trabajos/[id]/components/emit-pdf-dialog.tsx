import React, { useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

export function EmitPdfDialog({
  show,
  onClose,
  generatingAction,
  onGuardar,
  onEmitir,
}: {
  show: boolean;
  onClose: () => void;
  generatingAction: 'guardar' | 'emitir' | null;
  onGuardar: () => void;
  onEmitir: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!show) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button")
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="emit-pdf-title" onClick={onClose}>
      <div ref={dialogRef} className="glass-thick rounded-3xl p-6 border border-white/20 dark:border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.3)] max-w-sm w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 id="emit-pdf-title" className="text-heading text-on-surface">¿Emitir presupuesto?</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-on-surface/10 text-on-surface-variant transition-[background-color,transform] ease-spring active:scale-[0.96] cursor-pointer hit-padding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-body text-on-surface-variant/70 leading-relaxed">
          Vas a generar el PDF del presupuesto para este trabajo. ¿Querés emitirlo formalmente o solo guardar el PDF?
        </p>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onGuardar}
            disabled={generatingAction !== null}
            className="flex-1 px-4 py-3 rounded-xl bg-on-surface/5 text-on-surface font-bold text-sm hover:bg-on-surface/10 transition-[background-color,transform] ease-spring active:scale-[0.96] cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {generatingAction === "guardar" && <Loader2 className="w-4 h-4 animate-spin" />}
            Solo guardar PDF
          </button>
          <button
            type="button"
            onClick={onEmitir}
            disabled={generatingAction !== null}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-[background-color,transform] ease-spring active:scale-[0.96] shadow-[0_4px_12px_rgba(61,139,110,0.3)] cursor-pointer flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {generatingAction === "emitir" && <Loader2 className="w-4 h-4 animate-spin" />}
            Emitir
          </button>
        </div>
      </div>
    </div>
  );
}
