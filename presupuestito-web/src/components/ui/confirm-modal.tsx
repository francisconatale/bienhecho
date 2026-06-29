import { Modal } from "./modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
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
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4 pt-4 pb-2">
        <div
          className={`p-4 rounded-full ${
            variant === "danger"
              ? "bg-red-500/10 text-red-500"
              : variant === "warning"
              ? "bg-yellow-500/10 text-yellow-500"
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
          onClick={onClose}
          className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-on-surface-variant bg-surface-variant/30 hover:bg-surface-variant/50 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white transition-colors shadow-lg ${
            variant === "danger"
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
              : variant === "warning"
              ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20"
              : "bg-primary hover:bg-primary-dark shadow-primary/20"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
