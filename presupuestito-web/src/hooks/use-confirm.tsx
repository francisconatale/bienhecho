import { useState } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
}

export function useConfirm() {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = (opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(opts);
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    if (promise) {
      promise.resolve(false);
      setPromise(null);
      setOptions(null);
    }
  };

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(true);
      setPromise(null);
      setOptions(null);
    }
  };

  const ConfirmDialog = () => {
    if (!options) return null;
    return (
      <ConfirmModal
        isOpen={promise !== null}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={options.title}
        description={options.description}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
      />
    );
  };

  return [ConfirmDialog, confirm] as const;
}
