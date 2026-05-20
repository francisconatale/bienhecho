import React from "react";

interface HeaderProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  /**
   * Custom class for the title. Defaults to the project's headline-large-mobile style.
   */
  titleClassName?: string;
  /**
   * Optional custom container class for action buttons.
   */
  actionContainerClassName?: string;
}

/**
 * Reusable Header component following the project's pattern:
 * - Fixed position at the top
 * - Backdrop blur and semi-transparent background
 * - Centered title with optional left/right actions
 */
export function Header({
  title,
  leftAction,
  rightAction,
  titleClassName = "font-headline-large-mobile text-headline-large-mobile text-primary flex-1 text-center font-bold tracking-tight",
  actionContainerClassName = "w-10 flex items-center shrink-0 min-w-[40px]"
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/10 px-4 pb-4 pt-safe flex items-end justify-between transition-all min-h-[5rem]">
      <div className={`${actionContainerClassName} justify-start`}>
        {leftAction || <div className="w-10" />}
      </div>
      
      <h1 className={titleClassName}>
        {title}
      </h1>
      
      <div className={`${actionContainerClassName} justify-end`}>
        {rightAction || <div className="w-10" />}
      </div>
    </header>
  );
}
