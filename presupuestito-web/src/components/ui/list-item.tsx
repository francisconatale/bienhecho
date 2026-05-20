"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ListItemProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  showChevron?: boolean;
}

export function ListItem({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  href,
  className = "",
  showChevron = true,
}: ListItemProps) {
  const content = (
    <>
      {icon && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-on-surface truncate">{title}</div>
        {subtitle && <div className="text-xs text-on-surface-variant truncate">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {trailing}
        {showChevron && (onClick || href) && (
          <ChevronRight
            className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors"
            strokeWidth={2.5}
          />
        )}
      </div>
    </>
  );

  const baseClasses = `w-full flex items-center gap-3 px-4 py-3 border-b border-outline-variant/10 last:border-0 hover:bg-surface-variant/30 transition-colors text-left group ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses} type="button">
      {content}
    </button>
  );
}
