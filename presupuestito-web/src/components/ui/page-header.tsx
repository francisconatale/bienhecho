import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mb-8",
        className
      )}
    >
      <div>
        <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-base text-on-surface-variant/60 font-medium">
            {description}
          </p>
        )}
      </div>
      {action && <div className="hidden md:block">{action}</div>}
    </div>
  );
}
