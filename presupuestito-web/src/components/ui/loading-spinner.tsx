import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} role="status" aria-label="Cargando">
      <Loader2 className="animate-spin text-primary/60" size={size} aria-hidden="true" />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
