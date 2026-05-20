import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 transition-opacity">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] bg-surface rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header más limpio sin borde sólido */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-6 pb-2 shrink-0">
          <h2 className="text-xl font-bold text-on-surface tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-outline-variant/10 transition-colors text-on-surface-variant hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-5 sm:px-6 pb-6 pt-2 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
