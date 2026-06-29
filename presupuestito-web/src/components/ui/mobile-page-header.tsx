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
    <div className="md:hidden absolute top-0 left-0 w-full z-50 px-4 pt-12 pb-3 flex items-center justify-between bg-transparent pointer-events-none">
      <div className="pointer-events-auto">
        {backHref ? (
          <Link href={backHref} className="w-10 h-10 rounded-full bg-surface/50 backdrop-blur-xl border border-outline-variant/20 shadow-sm flex items-center justify-center text-primary hover:bg-surface transition-colors active:scale-95">
            <ChevronLeft className="w-6 h-6 -ml-0.5" strokeWidth={2.5} />
          </Link>
        ) : (
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-surface/50 backdrop-blur-xl border border-outline-variant/20 shadow-sm flex items-center justify-center text-primary cursor-pointer hover:bg-surface transition-colors active:scale-95">
            <ChevronLeft className="w-6 h-6 -ml-0.5" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div className="pointer-events-auto">
        <MobileHeaderActions {...actionsProps} />
      </div>
    </div>
  );
}
