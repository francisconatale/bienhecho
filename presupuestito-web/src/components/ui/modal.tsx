import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: "auto" | "center";
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ isOpen, onClose, title, children, position = "auto" }: ModalProps) {
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
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
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        if (dialogRef.current) {
          const first = dialogRef.current.querySelector<HTMLElement>(FOCUSABLE);
          first?.focus();
        }
      }, 0);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
        previouslyFocused.current?.focus();
      };
    }
    document.body.style.overflow = "unset";
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[100] flex ${position === "center" ? "items-center" : "items-end sm:items-center"} justify-center bg-black/40 sm:p-6 transition-opacity duration-[200ms]`}
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
        className={
          "relative w-full max-h-[95dvh] bg-surface/95 dark:bg-surface/90 backdrop-blur-xl shadow-2xl flex flex-col " +
          (position === "center"
            ? "rounded-3xl border border-outline-variant/15 animate-in fade-in zoom-in-95 duration-200 max-w-lg max-h-[85vh] m-4 sm:m-0"
            : "rounded-t-[28px] rounded-b-none sm:rounded-3xl border-t sm:border border-outline-variant/15 animate-in fade-in-0 slide-in-from-bottom-[100%] sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 sm:duration-200 sm:max-w-lg sm:max-h-[85vh]")
        }
      >
        {position !== "center" && (
          <div className="w-full flex justify-center pt-3 pb-1 sm:hidden shrink-0">
            <div className="w-10 h-1.5 rounded-full bg-outline-variant/30" />
          </div>
        )}
        
        <div className={`flex items-center justify-between px-5 sm:px-6 pb-2 shrink-0 ${position === "center" ? "pt-6" : "pt-3 sm:pt-6"}`}>
          <h2 id="modal-title" className="text-xl font-bold text-on-surface tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 -mr-2 rounded-full hover:bg-outline-variant/10 transition-[background-color,color] duration-[120ms] text-on-surface-variant hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/50 sm:bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-5 sm:px-6 pb-8 sm:pb-6 pt-2 overflow-y-auto custom-scrollbar flex-1 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pb-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
