import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="emit-pdf-title" onClick={onClose}>
      <div className="bg-surface/90 dark:bg-surface/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.3)] max-w-sm w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 id="emit-pdf-title" className="text-lg font-bold text-on-surface">¿Emitir presupuesto?</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-on-surface/10 text-on-surface-variant transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-on-surface-variant/70 leading-relaxed">
          Vas a generar el PDF del presupuesto para este trabajo. ¿Querés emitirlo formalmente o solo guardar el PDF?
        </p>
        <div className="flex gap-2 pt-2">
          <button
            onClick={onGuardar}
            disabled={generatingAction !== null}
            className="flex-1 px-4 py-3 rounded-xl bg-on-surface/5 text-on-surface font-bold text-sm hover:bg-on-surface/10 transition-colors transition-transform active:scale-95 cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {generatingAction === "guardar" && <Loader2 className="w-4 h-4 animate-spin" />}
            Solo guardar PDF
          </button>
          <button
            onClick={onEmitir}
            disabled={generatingAction !== null}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors transition-transform active:scale-95 shadow-[0_4px_12px_rgba(61,139,110,0.3)] cursor-pointer flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {generatingAction === "emitir" && <Loader2 className="w-4 h-4 animate-spin" />}
            Emitir
          </button>
        </div>
      </div>
    </div>
  );
}
