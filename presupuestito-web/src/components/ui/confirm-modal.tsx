import { Modal } from "./modal";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} position="center">
      <div className="flex flex-col items-center text-center space-y-4 pt-4 pb-2">
        <div
          className={`p-4 rounded-full ${
            variant === "danger"
              ? "bg-error/10 text-error"
              : variant === "warning"
              ? "bg-accent-dark/10 text-accent-dark"
              : "bg-primary/10 text-primary"
          }`}
        >
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-on-surface-variant font-medium text-sm px-4">
          {description}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-on-surface-variant bg-surface-variant hover:bg-surface-variant/70 transition-[background-color,transform] duration-200 ease-spring active:scale-[0.96] disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isLoading) {
              onConfirm();
            }
          }}
          disabled={isLoading}
          className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white transition-[background-color,transform] duration-200 ease-spring active:scale-[0.96] shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 focus-visible:ring-2 focus-visible:ring-primary/20 ${
            variant === "danger"
              ? "bg-error hover:brightness-110 shadow-red-500/20"
              : variant === "warning"
              ? "bg-accent-dark hover:brightness-110 shadow-yellow-500/20"
              : "bg-primary hover:bg-primary-dark shadow-primary/20"
          }`}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
