import { Modal } from "./modal";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
  primaryButtonText = "Continuar",
  onPrimaryClick,
  secondaryButtonText,
  onSecondaryClick,
}: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center text-center space-y-4 pt-4 pb-2">
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-on-surface">{title}</h3>
        <p className="text-on-surface-variant font-medium text-sm px-4">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => {
            if (onPrimaryClick) onPrimaryClick();
            onClose();
          }}
          className="w-full h-12 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-dark transition-[background-color] duration-[120ms] shadow-lg shadow-primary/20"
        >
          {primaryButtonText}
        </button>
        {secondaryButtonText && (
          <button
            onClick={() => {
              if (onSecondaryClick) onSecondaryClick();
              onClose();
            }}
            className="w-full h-12 rounded-xl font-bold text-sm text-on-surface-variant bg-surface-variant/30 hover:bg-surface-variant/50 transition-[background-color] duration-[120ms]"
          >
            {secondaryButtonText}
          </button>
        )}
      </div>
    </Modal>
  );
}
