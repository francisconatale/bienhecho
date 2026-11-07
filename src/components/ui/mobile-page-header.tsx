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
    <div className="md:hidden fixed top-0 left-0 w-full z-50 px-4 pt-10 pb-2 flex items-center justify-between bg-transparent pointer-events-none">
      <div className="pointer-events-auto">
        {backHref ? (
          <Link href={backHref} aria-label={backLabel} className="w-10 h-10 rounded-full glass-thin flex items-center justify-center text-primary hover:bg-surface transition-[background-color,transform] duration-200 ease-spring active:scale-[0.96]">
            <ChevronLeft className="w-6 h-6 -ml-0.5" strokeWidth={2.5} />
          </Link>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); if (onBack) onBack(); }} aria-label={backLabel} className="w-10 h-10 rounded-full glass-thin flex items-center justify-center text-primary cursor-pointer hover:bg-surface transition-[background-color,transform] duration-200 ease-spring active:scale-[0.96]">
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
