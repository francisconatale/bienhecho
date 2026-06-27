import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { MobileHeaderActions } from "./mobile-header-actions";
import { ComponentProps } from "react";

type MobilePageHeaderProps = {
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
} & ComponentProps<typeof MobileHeaderActions>;

export function MobilePageHeader({
  backHref,
  backLabel = "Volver",
  onBack,
  ...actionsProps
}: MobilePageHeaderProps) {
  return (
    <div className="md:hidden relative z-10 px-4 pt-2.5 pb-6 flex items-center justify-between">
      {backHref ? (
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant font-medium hover:text-on-surface transition-colors active:scale-95">
          <ChevronLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      ) : (
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant font-medium hover:text-on-surface transition-colors active:scale-95 cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
          {backLabel}
        </button>
      )}
      <MobileHeaderActions {...actionsProps} />
    </div>
  );
}
