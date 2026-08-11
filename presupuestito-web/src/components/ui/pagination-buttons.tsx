"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}

export function PaginationButtons({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationButtonsProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const btnBase =
    "flex items-center justify-center min-w-[36px] h-10 px-3 rounded-[12px] text-caption transition-[background-color,transform] duration-200 ease-spring select-none";

  return (
    <div className={cn("flex flex-col items-center gap-3 pt-6", className)}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
          className={cn(
            btnBase,
            "gap-1 px-3.5",
            currentPage === 1
              ? "text-on-surface-variant/30 cursor-not-allowed"
              : "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface active:scale-[0.96]"
          )}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers(currentPage, totalPages).map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                aria-hidden="true"
                className="flex items-center justify-center w-[30px] h-9 text-caption text-on-surface-variant/40 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Página ${page}`}
                className={cn(
                  btnBase,
                  page === currentPage
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface active:scale-[0.96]"
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
          className={cn(
            btnBase,
            "gap-1 px-3.5",
            currentPage === totalPages
              ? "text-on-surface-variant/30 cursor-not-allowed"
              : "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface active:scale-[0.96]"
          )}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      <span className="text-caption text-on-surface-variant">
        Mostrando {startItem}–{endItem} de {totalItems} resultados
      </span>
    </div>
  );
}
