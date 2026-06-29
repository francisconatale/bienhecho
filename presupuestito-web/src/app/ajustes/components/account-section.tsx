import Link from "next/link";
import { CircleUserRound, ChevronRight } from "lucide-react";
import { SectionLabel } from "./section-label";

export function AccountSection() {
  return (
    <section>
      <SectionLabel label="Cuenta" />
      <div className="bg-surface/80 rounded-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-outline-variant/20 overflow-hidden">
        <Link
          href="/ajustes/perfil"
          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-variant/10 transition-colors text-left group"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <CircleUserRound className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-on-surface">Juan Pérez</h4>
            <p className="text-xs text-on-surface-variant truncate">
              juan@empresa.com
            </p>
          </div>
          <ChevronRight
            className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors shrink-0"
            strokeWidth={2.5}
          />
        </Link>
      </div>
    </section>
  );
}
